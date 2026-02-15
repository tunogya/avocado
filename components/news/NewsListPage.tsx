import NewsCard from "@/components/news/NewsCard";
import NewsPagination from "@/components/news/NewsPagination";
import type {NewsPostSummary} from "@/lib/news";

type NewsListPageProps = {
  locale: string;
  basePath: string;
  posts: NewsPostSummary[];
  currentPage: number;
  totalPages: number;
};

export default function NewsListPage({
  locale,
  basePath,
  posts,
  currentPage,
  totalPages
}: NewsListPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-14 md:px-10">
      <header className="mb-10 rounded-3xl border border-[var(--line)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--surface)_75%,white_25%)_0%,color-mix(in_srgb,var(--accent-soft)_45%,white_55%)_100%)] px-7 py-10 md:px-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Insights</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-[var(--foreground)] md:text-5xl">
          News and Market Intelligence
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Corporate updates, market observations, and practical playbooks for clean
          energy and carbon procurement leaders.
        </p>
      </header>

      {posts.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-12 text-center text-[var(--muted)]">
          No articles published yet.
        </section>
      ) : (
        <section className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <NewsCard
              key={post.slug}
              post={post}
              locale={locale}
              basePath={basePath}
            />
          ))}
        </section>
      )}

      <NewsPagination
        basePath={basePath}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </main>
  );
}
