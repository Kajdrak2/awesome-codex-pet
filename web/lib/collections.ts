import type { Locale } from "@/lib/i18n";
import type { Pet } from "@/lib/pets";

export type LocalizedText = Record<Locale, string>;

export type CollectionCatalogEntry = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  featured: boolean;
  coverSlugs: string[];
};

export type PetCollection = CollectionCatalogEntry & {
  pets: Pet[];
};

export function getCollectionCoverPets(collection: PetCollection) {
  const petsBySlug = new Map(collection.pets.map((pet) => [pet.slug, pet]));
  return collection.coverSlugs
    .map((slug) => petsBySlug.get(slug))
    .filter((pet): pet is Pet => pet !== undefined);
}
