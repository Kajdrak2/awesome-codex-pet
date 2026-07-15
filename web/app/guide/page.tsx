import type { Metadata } from "next";

import { GuidePageContent } from "@/components/guide-page-content";
import { getCategoryCatalog } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

const title = "Craft and submit a selected Codex pet";
const description =
  "A complete guide to Codex pet V1 and V2, action-by-action craft, transparent edge cleanup, packaging, review, submission, and community sharing.";

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
