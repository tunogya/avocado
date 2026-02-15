import Image from "next/image";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  renderMarkdown
} from "@/lib/news";
import {toAbsoluteUrl} from "@/lib/site";

type NewsDetailPageProps = {
  params: Promise<{locale: string; slug: string}>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const allPosts = await getAllPosts();
  return allPosts.map((post) => ({slug: post.slug}));
}

export async function generateMetadata({
  params
}: NewsDetailPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const canonicalPath = `/${locale}/news/${slug}`;
  const title = `${post.title} | Carbon Ledger Insights`;
  const description = post.excerpt;
  const imageUrl = post.featuredImage
    ? post.featuredImage.startsWith("http")
      ? post.featuredImage
      : toAbsoluteUrl(post.featuredImage)
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      type: "article",
      url: toAbsoluteUrl(canonicalPath),
      title,
      description,
      publishedTime: `${post.date}T00:00:00.000Z`,
      tags: [post.category],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: post.title
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined
    }
  };
}

export default async function NewsDetailPage({params}: NewsDetailPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const htmlContent = await renderMarkdown(post.content);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 md:px-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[linear-gradient(155deg,color-mix(in_srgb,var(--surface)_83%,white_17%)_0%,color-mix(in_srgb,var(--accent-soft)_42%,white_58%)_100%)] p-7 md:p-10">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] bg-[var(--background)] px-3 py-1">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
        </div>

        <h1 className="mt-5 font-display text-4xl leading-tight text-[var(--foreground)] md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">
          {post.excerpt}
        </p>

        {post.featuredImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--line)]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        ) : null}
      </header>

      <article
        className="news-prose mt-10 text-base leading-8 text-[color-mix(in_srgb,var(--foreground)_87%,black_13%)] [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2 [&_a]:font-semibold [&_a]:text-[var(--accent)] hover:[&_a]:text-[var(--accent-strong)]"
        dangerouslySetInnerHTML={{__html: htmlContent}}
      />
    </main>
  );
}
