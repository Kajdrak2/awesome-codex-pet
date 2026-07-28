import type { Metadata } from "next";

import { RankingsPageContent } from "@/components/rankings-page-content";
import { getLeaderboardData } from "@/lib/leaderboards";
import { getAllPets } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

const title = "Community rankings for Codex pets, creators, and collections";
const description =
  "Explore weekly and all-time Awesome Codex Pet rankings, recognize community contributors, discover popular series, and cast a privacy-conscious weekly vote.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/rankings" },
  keywords: [
    "Codex pet rankings",
    "popular Codex pets",
    "Codex pet creators",
    "Codex pet vote",
    "Codex 宠物排行榜",
    "Codex 宠物投票",
  ],
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/rankings`,
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

export default function RankingsPage() {
  const data = getLeaderboardData(getAllPets());
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/rankings/#community-rankings`,
    name: title,
    description,
    url: `${siteConfig.url}/rankings`,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    inLanguage: ["en", "zh-CN"],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.pets.length,
      itemListElement: [...data.pets]
        .sort((a, b) => b.weeklyScore - a.weeklyScore)
        .slice(0, 20)
        .map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.pet.localizedNames.en ?? entry.pet.name,
          url: `${siteConfig.url}/pets/${entry.pet.slug}`,
        })),
    },
  };

  return (
    <>
      <RankingsPageContent data={data} />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
        }}
        type="application/ld+json"
      />
    </>
  );
}
