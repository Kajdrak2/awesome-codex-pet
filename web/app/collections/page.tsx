import type { Metadata } from "next";

import { CollectionsPageContent } from "@/components/collections-page-content";
import { getCollections } from "@/lib/collection-catalog";
import { getAllPets } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

const title = "Codex pet series and themed collections";
const description =
  "Browse franchise series and themed Codex pet collections, including Genshin Impact, Honkai: Star Rail, ONIMAI, and community animal companions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/collections" },
  keywords: [
    "Codex pet collections",
    "anime Codex pets",
    "game character Codex pets",
    "Codex 宠物合集",
    "动漫 Codex 宠物",
    "游戏角色 Codex 宠物",
  ],
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/collections`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    images: [
      {
        url: siteConfig.ogImage,
        width: siteConfig.ogImageWidth,
        height: siteConfig.ogImageHeight,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function CollectionsPage() {
  const collections = getCollections(getAllPets());
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/collections/#collections`,
    name: title,
    description,
    url: `${siteConfig.url}/collections`,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    inLanguage: ["en", "zh-CN"],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collections.length,
      itemListElement: collections.map((collection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${collection.title.en} / ${collection.title.zh}`,
        url: `${siteConfig.url}/collections/${collection.slug}`,
      })),
    },
  };

  return (
    <>
      <CollectionsPageContent collections={collections} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
