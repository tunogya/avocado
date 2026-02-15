import Image from "next/image";
import Link from "next/link";
import type {NewsPostSummary} from "@/lib/news";
import {formatPostDate} from "@/lib/news";

type NewsCardProps = {
  post: NewsPostSummary;
  locale: string;
  basePath: string;
};

export default function NewsCard({post, locale, basePath}: NewsCardProps) {
  const href = `${basePath}/${post.slug}`;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_78%,white_22%)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link className="block" href={href}>
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--accent-soft)]">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[var(--accent-soft)] via-[var(--surface)] to-[var(--accent-bright)]" />
          )}
        </div>
      </Link>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] bg-[var(--background)] px-2 py-1">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
        </div>

        <h2 className="font-display text-2xl leading-tight text-[var(--foreground)]">
          <Link href={href} className="transition group-hover:text-[var(--accent)]">
            {post.title}
          </Link>
        </h2>

        <p className="line-clamp-3 text-sm leading-7 text-[color-mix(in_srgb,var(--muted)_92%,black_8%)]">
          {post.excerpt}
        </p>

        <Link
          href={href}
          className="inline-flex items-center text-sm font-semibold tracking-wide text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
        >
          Read insight
          <span className="ml-2" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
