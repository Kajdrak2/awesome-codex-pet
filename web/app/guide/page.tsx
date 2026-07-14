import type { Metadata } from "next";

import { GuidePageContent } from "@/components/guide-page-content";
import { getCategoryCatalog } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

const title = "Submit a Codex pet";
const description =
  "Submission guide for the Awesome Codex Pet gallery: categories, folder layout, reviewer checklist, and how generated previews land in the repo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/guide`,
    images: [siteConfig.ogImage],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function GuidePage() {
  const categories = getCategoryCatalog();
  return <GuidePageContent categories={categories} />;
}
