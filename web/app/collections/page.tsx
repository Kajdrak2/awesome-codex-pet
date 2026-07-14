import type { Metadata } from "next";

import { CollectionsPageContent } from "@/components/collections-page-content";
import { getCollections } from "@/lib/collection-catalog";
import { getAllPets } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

const title = "Codex pet collections";
const description =
  "Browse themed Codex pet collections, including Genshin Impact, Honkai: Star Rail, and community animal companions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/collections" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/collections`,
    images: [siteConfig.ogImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function CollectionsPage() {
  return <CollectionsPageContent collections={getCollections(getAllPets())} />;
}
