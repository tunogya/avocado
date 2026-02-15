import type {Metadata} from "next";
import NewsListPage from "@/components/news/NewsListPage";
import {getPaginatedPosts} from "@/lib/news";
import {toAbsoluteUrl} from "@/lib/site";

export const metadata: Metadata = {
  title: "News & Insights | Carbon Ledger",
  description:
    "Explore corporate updates, market intelligence, and procurement playbooks from the Carbon Ledger insights desk.",
  alternates: {
    canonical: "/news"
  },
  openGraph: {
    title: "News & Insights | Carbon Ledger",
    description:
      "Explore corporate updates, market intelligence, and procurement playbooks from the Carbon Ledger insights desk.",
    type: "website",
    url: toAbsoluteUrl("/news")
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Insights | Carbon Ledger",
    description:
      "Explore corporate updates, market intelligence, and procurement playbooks from the Carbon Ledger insights desk."
  }
};

export default async function NewsIndexPage() {
  const paginated = await getPaginatedPosts(1);
  if (!paginated) {
    return null;
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
