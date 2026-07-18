import type { MetadataRoute } from "next";

import { getAllPets } from "@/lib/pets";
import { getCollectionSlugs } from "@/lib/collection-catalog";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/collections`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/install`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
  const petEntries = getAllPets().map((pet) => ({
    url: `${siteConfig.url}/pets/${pet.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const collectionEntries = getCollectionSlugs(getAllPets()).map((slug) => ({
    url: `${siteConfig.url}/collections/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
  return [...staticEntries, ...collectionEntries, ...petEntries];
}
