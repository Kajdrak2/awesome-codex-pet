import type { Metadata } from "next";

import { FeaturedCollections } from "@/components/featured-collections";
import { HeroSection } from "@/components/hero-section";
import { PetGallery } from "@/components/pet-gallery";
import { getFeaturedCollections } from "@/lib/collection-catalog";
import { getAllPets, getCategories } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.title} — selected community Codex pets`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.title} — selected community Codex pets`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.title} — selected community Codex pets`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function HomePage() {
  const pets = getAllPets();
  const categories = getCategories(pets);
  const collections = getFeaturedCollections(pets);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.title} — selected pet gallery`,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: ["en", "zh-CN"],
    hasPart: pets.slice(0, 12).map((pet) => ({
      "@type": "CreativeWork",
      name: pet.name,
      url: `${siteConfig.url}/pets/${pet.slug}`,
      author: {
        "@type": "Person",
        name: pet.author,
        url: pet.author_url ?? undefined,
      },
      genre: pet.primary_category,
      license: pet.license,
    })),
  };

  return (
    <main>
      <HeroSection
        petCount={pets.length}
        categoryCount={categories.length}
        featured={pets}
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[1720px]">
          <FeaturedCollections collections={collections} />
          <PetGallery pets={pets} categories={categories} />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
    </main>
  );
}
