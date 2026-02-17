import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import RecoursePage from "@/components/recourse/RecoursePage";
import {type RecourseLocale, recourseContent} from "@/lib/recourse";
import {toAbsoluteUrl} from "@/lib/site";

type RecourseRouteProps = {
  params: Promise<{locale: string}>;
};

function toRecourseLocale(locale: string): RecourseLocale {
  return locale === "zh" ? "zh" : "en";
}

export async function generateMetadata({
  params
}: RecourseRouteProps): Promise<Metadata> {
  const {locale} = await params;
  const currentLocale = toRecourseLocale(locale);
  const copy = recourseContent[currentLocale];
  const canonicalPath = `/${currentLocale}/recourse`;

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      type: "website",
      url: toAbsoluteUrl(canonicalPath)
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description
    }
  };
}

export default async function LocalizedRecoursePage({params}: RecourseRouteProps) {
  const {locale} = await params;
  const currentLocale = toRecourseLocale(locale);
  const copy = recourseContent[currentLocale];
  setRequestLocale(currentLocale);

  return (
    <RecoursePage
      locale={currentLocale}
      copy={copy}
      links={{
        home: `/${currentLocale}`,
        news: `/${currentLocale}/news`,
        recourse: `/${currentLocale}/recourse`,
        english: "/en/recourse",
        chinese: "/zh/recourse"
      }}
    />
  );
}
