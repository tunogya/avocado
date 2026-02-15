import Link from "next/link";

type NewsPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

export default function NewsPagination({
  basePath,
  currentPage,
  totalPages
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({length: totalPages}, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="News pagination"
    >
      <Link
        href={pageHref(basePath, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
          currentPage === 1
            ? "pointer-events-none border-[var(--line)] text-[var(--line-strong)]"
            : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        Previous
      </Link>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={pageHref(basePath, page)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition ${
              isActive
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_75%,white_25%)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={pageHref(basePath, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
          currentPage === totalPages
            ? "pointer-events-none border-[var(--line)] text-[var(--line-strong)]"
            : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
