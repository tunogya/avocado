import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import NewsListPage from "@/components/news/NewsListPage";
import {getPaginatedPosts} from "@/lib/news";
import {toAbsoluteUrl} from "@/lib/site";

type NewsIndexPageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params
}: NewsIndexPageProps): Promise<Metadata> {
  const {locale} = await params;
  const canonicalPath = `/${locale}/news`;

  return {
    title: "News & Insights | Carbon Ledger",
    description:
      "Explore corporate updates, market intelligence, and procurement playbooks from the Carbon Ledger insights desk.",
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: "News & Insights | Carbon Ledger",
      description:
        "Explore corporate updates, market intelligence, and procurement playbooks from the Carbon Ledger insights desk.",
      type: "website",
      url: toAbsoluteUrl(canonicalPath)
    },
    twitter: {
      card: "summary_large_image",
      title: "News & Insights | Carbon Ledger",
      description:
        "Explore corporate updates, market intelligence, and procurement playbooks from the Carbon Ledger insights desk."
    }
  };
}

export default async function NewsIndexPage({params}: NewsIndexPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const paginated = await getPaginatedPosts(1);

  if (!paginated) {
    return null;
  }

  return (
    <NewsListPage
      locale={locale}
      basePath={`/${locale}/news`}
      posts={paginated.posts}
      currentPage={paginated.currentPage}
      totalPages={paginated.totalPages}
    />
  );
}
