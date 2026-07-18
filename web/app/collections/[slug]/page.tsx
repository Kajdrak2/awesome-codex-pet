import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionDetailContent } from "@/components/collection-detail-content";
import { getCollectionBySlug, getCollectionSlugs } from "@/lib/collection-catalog";
import { getAllPets } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getCollectionSlugs(getAllPets()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(getAllPets(), slug);
  if (!collection) return { title: "Collection not found" };

  const title = `${collection.title.en} Codex pets`;
  const description = collection.description.en;
  const canonical = `/collections/${collection.slug}`;
  const cover = collection.pets.find((pet) => collection.coverSlugs.includes(pet.slug));

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${canonical}`,
      images: cover ? [cover.previewImage] : [siteConfig.ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover.previewImage] : [siteConfig.ogImage],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(getAllPets(), slug);
  if (!collection) notFound();

  const url = `${siteConfig.url}/collections/${collection.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title.en,
    description: collection.description.en,
    url,
    hasPart: collection.pets.map((pet) => ({
      "@type": "CreativeWork",
      name: pet.name,
      url: `${siteConfig.url}/pets/${pet.slug}`,
    })),
  };

  return (
    <>
      <CollectionDetailContent collection={collection} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
