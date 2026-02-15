import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {cache} from "react";
import {remark} from "remark";
import html from "remark-html";

const NEWS_CONTENT_DIR = path.join(process.cwd(), "content/news");
export const POSTS_PER_PAGE = 10;

export type NewsFrontmatter = {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  featuredImage: string;
};

export type NewsPost = NewsFrontmatter & {
  slug: string;
  content: string;
};

export type NewsPostSummary = Omit<NewsPost, "content">;

export type PaginatedPosts = {
  posts: NewsPostSummary[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toExcerpt(content: string): string {
  const normalized = content
    .replaceAll(/\s+/g, " ")
    .replaceAll(/[#*_`>-]/g, "")
    .trim();
  return normalized.length > 180
    ? `${normalized.slice(0, 177).trimEnd()}...`
    : normalized;
}

function sortByDateDesc(a: NewsPost, b: NewsPost): number {
  return Date.parse(b.date) - Date.parse(a.date);
}

function parseFrontmatter(
  slug: string,
  data: {[key: string]: unknown},
  content: string
): NewsFrontmatter {
  const title = isString(data.title) ? data.title.trim() : "";
  const date = isString(data.date) ? data.date.trim() : "";
  const category = isString(data.category) ? data.category.trim() : "";
  const excerpt = isString(data.excerpt) ? data.excerpt.trim() : toExcerpt(content);
  const featuredImage = isString(data.featuredImage)
    ? data.featuredImage.trim()
    : "";

  if (!title || !date || !category) {
    throw new Error(
      `Invalid frontmatter in "${slug}.md". "title", "date", and "category" are required.`
    );
  }

  return {title, date, category, excerpt, featuredImage};
}

const getAllPostsWithContent = cache(async (): Promise<NewsPost[]> => {
  let filenames: string[];
  try {
    filenames = await fs.readdir(NEWS_CONTENT_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const markdownFiles = filenames.filter((filename) => filename.endsWith(".md"));
  const posts = await Promise.all(
    markdownFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(NEWS_CONTENT_DIR, filename);
      const file = await fs.readFile(fullPath, "utf8");
      const {data, content} = matter(file);
      const frontmatter = parseFrontmatter(slug, data, content);
      return {
        slug,
        ...frontmatter,
        content: content.trim()
      };
    })
  );

  return posts.sort(sortByDateDesc);
});

export const getAllPosts = cache(async (): Promise<NewsPostSummary[]> => {
  const posts = await getAllPostsWithContent();
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage
  }));
});

export async function getPostBySlug(slug: string): Promise<NewsPost | null> {
  const posts = await getAllPostsWithContent();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPaginatedPosts(
  page: number,
  pageSize = POSTS_PER_PAGE
): Promise<PaginatedPosts | null> {
  const posts = await getAllPosts();
  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));

  if (page < 1 || page > totalPages) {
    return null;
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePosts = posts.slice(startIndex, endIndex);

  return {
    posts: pagePosts,
    totalPosts,
    currentPage: page,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

export function formatPostDate(date: string, locale: string): string {
  const resolvedLocale = locale === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(resolvedLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00.000Z`));
}
