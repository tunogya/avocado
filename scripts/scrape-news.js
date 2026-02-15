#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const KEYWORD_TAG_MAP = {
  "renewable energy": "renewable-energy",
  policy: "policy",
  asia: "asia",
  "net zero": "net-zero",
  "clean energy": "clean-energy",
};

const DEFAULT_SITES = [
  {
    name: "IEA News",
    url: "https://www.iea.org/news",
    selectors: {
      articleCard: ".m-news-detailed-listing, article",
      cardHeadline: "h3 a, h2 a, a[href^='/news/']",
      cardLink: "h3 a, h2 a, a[href^='/news/']",
      cardSummary: "p",
      cardDate: "time",
      articleBody: ".m-block__content.f-rte--block, .m-block__content.f-rte, main",
      articleBodyRemove:
        ".m-card-footer-recirculation, .o-page__sidebar-right, .g-footer, .o-footer",
      articleHeadline: "h1",
      articleDate: "time",
      articleSummary: "meta[name='description']",
    },
    urlAllowPatterns: ["^https://www\\.iea\\.org/news/"],
    urlDenyPatterns: ["^https://www\\.iea\\.org/news/?$"],
    maxArticles: 25,
  },
  {
    name: "Clean Energy Wire",
    url: "https://www.cleanenergywire.org/news",
    selectors: {
      articleCard: ".view-content .views-row, .views-row",
      cardHeadline: "h2 a[href*='/news/'], h3 a[href*='/news/'], a[href*='/news/']",
      cardLink: "h2 a[href*='/news/'], h3 a[href*='/news/'], a[href*='/news/']",
      cardSummary: "p",
      cardDate: "time",
      articleBody: "main, article, .field--name-body",
      articleHeadline: "h1",
      articleDate: "time",
      articleSummary: "meta[name='description']",
    },
    urlAllowPatterns: ["^https://www\\.cleanenergywire\\.org/news/"],
    urlDenyPatterns: ["^https://www\\.cleanenergywire\\.org/news/?$"],
    maxArticles: 30,
  },
  {
    name: "UN News Climate",
    url: "https://news.un.org/en/news/topic/climate-change",
    selectors: {
      articleCard: ".view-content article, .view-content .node, article",
      cardHeadline: "h2 a[href*='/story/'], a[href*='/story/']",
      cardLink: "h2 a[href*='/story/'], a[href*='/story/']",
      cardSummary: ".field--name-body p, p",
      cardDate: "time",
      articleBody: "main, article, .field--name-body",
      articleHeadline: "h1",
      articleDate: "time",
      articleSummary: "meta[name='description']",
    },
    urlAllowPatterns: ["^https://news\\.un\\.org/en/story/"],
    urlDenyPatterns: ["facebook\\.com", "twitter\\.com", "mailto:", "#"],
    maxArticles: 30,
  },
];

const OUTPUT_DIR = path.resolve(__dirname, "../content/news");
const REQUEST_TIMEOUT_MS = 20000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; AvocadoNewsBot/1.0; +https://example.com/bot)";

function log(level, message, extra = "") {
  const timestamp = new Date().toISOString();
  const suffix = extra ? ` | ${extra}` : "";
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${suffix}`);
}

function normalizeWhitespace(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function slugify(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toAbsoluteUrl(href, baseUrl) {
  if (!href) return "";
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return "";
  }
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_")) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return "";
  }
}

function matchesAnyPattern(value, patterns) {
  const list = toArray(patterns);
  if (!value || list.length === 0) return false;
  for (const pattern of list) {
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    if (regex.test(value)) return true;
  }
  return false;
}

function isAllowedArticleUrl(url, siteConfig) {
  if (!url) return false;
  const allowPatterns = toArray(siteConfig.urlAllowPatterns);
  const denyPatterns = toArray(siteConfig.urlDenyPatterns);
  if (allowPatterns.length > 0 && !matchesAnyPattern(url, allowPatterns)) {
    return false;
  }
  if (denyPatterns.length > 0 && matchesAnyPattern(url, denyPatterns)) {
    return false;
  }
  return true;
}

function escapeYamlString(value) {
  return (value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').trim();
}

function getFieldText($root, selectors) {
  for (const selector of toArray(selectors)) {
    const value = normalizeWhitespace($root.find(selector).first().text());
    if (value) return value;
  }
  return "";
}

function getFieldAttr($root, selectors, attrName = "href") {
  for (const selector of toArray(selectors)) {
    const value = normalizeWhitespace(
      $root.find(selector).first().attr(attrName) || ""
    );
    if (value) return value;
  }
  return "";
}

function getDocMeta($, selector, attrName = "content") {
  for (const sel of toArray(selector)) {
    const value = normalizeWhitespace($(sel).first().attr(attrName) || "");
    if (value) return value;
  }
  return "";
}

function resolveDate(rawDate) {
  const fallback = new Date().toISOString().slice(0, 10);
  if (!rawDate) return fallback;
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toISOString().slice(0, 10);
}

function detectKeywordTags(text) {
  const lower = (text || "").toLowerCase();
  const tags = [];
  for (const [keyword, tag] of Object.entries(KEYWORD_TAG_MAP)) {
    if (lower.includes(keyword)) tags.push(tag);
  }
  return tags;
}

function renderInline($, node, pageUrl) {
  if (!node) return "";
  if (node.type === "text") return node.data || "";
  if (node.type !== "tag") return "";

  const children = node.children || [];
  const content = children.map((child) => renderInline($, child, pageUrl)).join("");
  const tag = (node.name || "").toLowerCase();

  if (tag === "a") {
    const href = toAbsoluteUrl($(node).attr("href"), pageUrl);
    const label = normalizeWhitespace(content) || href;
    return href ? `[${label}](${href})` : label;
  }
  if (tag === "strong" || tag === "b") {
    return `**${normalizeWhitespace(content)}**`;
  }
  if (tag === "em" || tag === "i") {
    return `*${normalizeWhitespace(content)}*`;
  }
  if (tag === "code") {
    return `\`${normalizeWhitespace(content)}\``;
  }
  if (tag === "br") {
    return "\n";
  }
  return content;
}

function renderBlock($, node, pageUrl, depth = 0) {
  if (!node || node.type !== "tag") return [];
  const tag = (node.name || "").toLowerCase();
  const lines = [];

  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag.slice(1));
    const heading = normalizeWhitespace(renderInline($, node, pageUrl));
    if (heading) lines.push(`${"#".repeat(level)} ${heading}`);
    return lines;
  }

  if (tag === "p") {
    const paragraph = normalizeWhitespace(renderInline($, node, pageUrl));
    if (paragraph) lines.push(paragraph);
    return lines;
  }

  if (tag === "ul" || tag === "ol") {
    const items = $(node).children("li").toArray();
    for (let i = 0; i < items.length; i += 1) {
      const itemText = normalizeWhitespace(renderInline($, items[i], pageUrl));
      if (!itemText) continue;
      if (tag === "ol") {
        lines.push(`${i + 1}. ${itemText}`);
      } else {
        lines.push(`- ${itemText}`);
      }
    }
    return lines;
  }

  if (tag === "blockquote") {
    const quote = normalizeWhitespace($(node).text());
    if (quote) lines.push(`> ${quote}`);
    return lines;
  }

  if (tag === "pre") {
    const code = $(node).text().replace(/\s+$/, "");
    if (code) lines.push(`\`\`\`\n${code}\n\`\`\``);
    return lines;
  }

  const blockLikeTags = new Set(["article", "main", "section", "div"]);
  if (blockLikeTags.has(tag) || depth === 0) {
    const children = $(node).children().toArray();
    for (const child of children) {
      const childBlocks = renderBlock($, child, pageUrl, depth + 1);
      lines.push(...childBlocks);
    }
    return lines;
  }

  const fallback = normalizeWhitespace(renderInline($, node, pageUrl));
  if (fallback) lines.push(fallback);
  return lines;
}

function extractBodyMarkdown($, selectors, pageUrl, removeSelectors = []) {
  let container = null;
  for (const selector of toArray(selectors)) {
    const candidate = $(selector).first();
    if (candidate.length > 0) {
      container = candidate;
      break;
    }
  }

  if (!container || container.length === 0) {
    container = $("article, main").first();
  }

  if (!container || container.length === 0) {
    return "";
  }

  for (const removeSelector of toArray(removeSelectors)) {
    container.find(removeSelector).remove();
  }

  const blocks = [];
  const children = container.children().toArray();
  if (children.length === 0) {
    const text = normalizeWhitespace(container.text());
    return text;
  }

  for (const child of children) {
    const rendered = renderBlock($, child, pageUrl);
    blocks.push(...rendered);
  }

  return blocks
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchHtml(url) {
  const response = await axios.get(url, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
  });
  return response.data;
}

async function getExistingSlugs(outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  const slugSet = new Set();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".md")) continue;
    slugSet.add(path.basename(entry.name, ".md"));
  }
  return slugSet;
}

function buildMarkdown(article) {
  const tagsYaml = article.tags.map((tag) => `"${escapeYamlString(tag)}"`).join(", ");
  return [
    "---",
    `title: "${escapeYamlString(article.title)}"`,
    `date: "${escapeYamlString(article.date)}"`,
    `category: "News"`,
    `source: "${escapeYamlString(article.source)}"`,
    `url: "${escapeYamlString(article.url)}"`,
    `tags: [${tagsYaml}]`,
    "---",
    "",
    article.body || "",
    "",
  ].join("\n");
}

function parseArticleCards(siteConfig, listingHtml) {
  const $ = cheerio.load(listingHtml);
  const selectors = siteConfig.selectors || {};
  const seen = new Set();

  function parseFromGlobalLinks() {
    const links = $(selectors.cardLink || "a").toArray();
    return links
      .map((link) => {
        const $link = $(link);
        const href = normalizeWhitespace($link.attr("href") || "");
        const headline = normalizeWhitespace($link.text());
        const url = normalizeUrl(toAbsoluteUrl(href, siteConfig.url));
        if (!headline || !url) return null;
        if (!isAllowedArticleUrl(url, siteConfig)) return null;
        if (seen.has(url)) return null;
        seen.add(url);
        return {
          headline,
          url,
          summary: "",
          date: "",
        };
      })
      .filter(Boolean);
  }

  const cardSelector = selectors.articleCard || "article";
  const cards = $(cardSelector).toArray();
  const fromCards = cards
    .map((card) => {
      const $card = $(card);
      const headline =
        getFieldText($card, selectors.cardHeadline) ||
        getFieldText($card, selectors.cardLink);
      const href = getFieldAttr($card, selectors.cardLink, "href");
      const url = normalizeUrl(toAbsoluteUrl(href, siteConfig.url));
      const summary = getFieldText($card, selectors.cardSummary);
      const date =
        getFieldAttr($card, selectors.cardDate, "datetime") ||
        getFieldText($card, selectors.cardDate);

      if (!headline || !url) return null;
      if (!isAllowedArticleUrl(url, siteConfig)) return null;
      if (seen.has(url)) return null;
      seen.add(url);
      return { headline, url, summary, date };
    })
    .filter(Boolean);

  if (fromCards.length > 0) return fromCards;
  return parseFromGlobalLinks();
}

async function enrichArticle(siteConfig, baseArticle) {
  const html = await fetchHtml(baseArticle.url);
  const $ = cheerio.load(html);
  const selectors = siteConfig.selectors || {};

  const title =
    getFieldText($.root(), selectors.articleHeadline) ||
    normalizeWhitespace($("title").first().text()) ||
    baseArticle.headline;

  const dateRaw =
    getFieldAttr($.root(), selectors.articleDate, "datetime") ||
    getFieldText($.root(), selectors.articleDate) ||
    getDocMeta($, "meta[property='article:published_time']") ||
    getDocMeta($, "meta[name='pubdate']") ||
    baseArticle.date;

  const summary =
    getDocMeta($, selectors.articleSummary, "content") ||
    getDocMeta($, "meta[name='description']", "content") ||
    baseArticle.summary;

  const body = extractBodyMarkdown(
    $,
    selectors.articleBody,
    baseArticle.url,
    selectors.articleBodyRemove
  );
  const finalBody = body && body.trim() ? body.trim() : normalizeWhitespace(summary);

  return {
    title: normalizeWhitespace(title),
    url: baseArticle.url,
    source: siteConfig.name,
    date: resolveDate(dateRaw),
    summary: normalizeWhitespace(summary),
    body: finalBody,
  };
}

async function scrapeNewsSites(siteConfigs) {
  const stats = { saved: 0, skipped: 0, failed: 0 };
  const slugSet = await getExistingSlugs(OUTPUT_DIR);

  for (const siteConfig of siteConfigs) {
    log("info", `Scraping site: ${siteConfig.name}`, siteConfig.url);

    try {
      const listingHtml = await fetchHtml(siteConfig.url);
      const cards = parseArticleCards(siteConfig, listingHtml);
      const limit = siteConfig.maxArticles || cards.length;
      const candidates = cards.slice(0, limit);

      log("info", `Found candidate cards: ${candidates.length}`, siteConfig.name);

      for (const card of candidates) {
        try {
          const article = await enrichArticle(siteConfig, card);
          const searchable = `${article.title}\n${article.summary}\n${article.body}`;
          const tags = detectKeywordTags(searchable);

          if (tags.length === 0) {
            stats.skipped += 1;
            continue;
          }

          const slugBase = slugify(article.title) || slugify(article.url);
          if (!slugBase) {
            stats.failed += 1;
            log("warn", "Could not create slug for article", article.url);
            continue;
          }

          if (slugSet.has(slugBase)) {
            stats.skipped += 1;
            log("info", "Skipping duplicate slug", slugBase);
            continue;
          }

          const markdown = buildMarkdown({ ...article, tags });
          const targetPath = path.join(OUTPUT_DIR, `${slugBase}.md`);
          await fs.writeFile(targetPath, markdown, "utf8");
          slugSet.add(slugBase);
          stats.saved += 1;
          log("info", "Saved article", targetPath);
        } catch (error) {
          stats.failed += 1;
          log("error", "Article processing failed", `${card.url} | ${error.message}`);
        }
      }
    } catch (error) {
      stats.failed += 1;
      log("error", "Site scraping failed", `${siteConfig.url} | ${error.message}`);
    }
  }

  log(
    "info",
    "Scrape finished",
    `saved=${stats.saved} skipped=${stats.skipped} failed=${stats.failed}`
  );
  return stats;
}

function runScheduler(siteConfigs = DEFAULT_SITES) {
  const schedule = "0 */12 * * *";
  log("info", "Starting scheduler", `cron=${schedule}`);

  const task = cron.schedule(schedule, async () => {
    log("info", "Scheduled scrape run started");
    try {
      await scrapeNewsSites(siteConfigs);
    } catch (error) {
      log("error", "Scheduled scrape failed", error.message);
    }
  });

  return task;
}

if (require.main === module) {
  const shouldSchedule = process.argv.includes("--schedule");
  if (shouldSchedule) {
    runScheduler(DEFAULT_SITES);
    scrapeNewsSites(DEFAULT_SITES).catch((error) => {
      log("error", "Initial scheduled run failed", error.message);
    });
  } else {
    scrapeNewsSites(DEFAULT_SITES)
      .then(() => process.exit(0))
      .catch((error) => {
        log("error", "Scrape failed", error.message);
        process.exit(1);
      });
  }
}

module.exports = {
  DEFAULT_SITES,
  scrapeNewsSites,
  runScheduler,
};
