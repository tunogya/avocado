import type {Metadata} from "next";
import RecoursePage from "@/components/recourse/RecoursePage";
import {recourseContent} from "@/lib/recourse";
import {toAbsoluteUrl} from "@/lib/site";

const copy = recourseContent.en;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: {
    canonical: "/recourse"
  },
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    type: "website",
    url: toAbsoluteUrl("/recourse")
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.title,
    description: copy.meta.description
  }
};

export default function RecourseIndexPage() {
  return (
    <RecoursePage
      locale="en"
      copy={copy}
      links={{
        home: "/en",
        news: "/news",
        recourse: "/recourse",
        english: "/recourse",
        chinese: "/zh/recourse"
      }}
    />
  );
}
