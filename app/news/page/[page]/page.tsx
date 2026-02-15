import type {Metadata} from "next";
import {notFound} from "next/navigation";
import NewsListPage from "@/components/news/NewsListPage";
import {POSTS_PER_PAGE, getAllPosts, getPaginatedPosts} from "@/lib/news";
import {toAbsoluteUrl} from "@/lib/site";

type NewsPaginationPageProps = {
  params: Promise<{page: string}>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const allPosts = await getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));

  if (totalPages <= 1) {
    return [];
  }

  return Array.from({length: totalPages - 1}, (_, index) => ({
    page: String(index + 2)
  }));
}

export async function generateMetadata({
  params
}: NewsPaginationPageProps): Promise<Metadata> {
  const {page} = await params;
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    return {};
  }

  const title = `News & Insights - Page ${pageNumber} | Carbon Ledger`;
  const description = `Page ${pageNumber} of Carbon Ledger news and insight articles.`;
  const canonicalPath = `/news/page/${pageNumber}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    robots: {
      index: false,
      follow: true
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: toAbsoluteUrl(canonicalPath)
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function NewsPaginationPage({
  params
}: NewsPaginationPageProps) {
  const {page} = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const paginated = await getPaginatedPosts(pageNumber);
  if (!paginated) {
    notFound();
  }

  return (
    <NewsListPage
      locale="en"
      basePath="/news"
      posts={paginated.posts}
      currentPage={paginated.currentPage}
      totalPages={paginated.totalPages}
    />
  );
}
