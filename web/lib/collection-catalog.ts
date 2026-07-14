import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { CollectionCatalogEntry, PetCollection } from "@/lib/collections";
import type { Pet } from "@/lib/pets";

function readGeneratedCollections(): CollectionCatalogEntry[] {
  const path = join(process.cwd(), ".generated", "collections.generated.json");
  return JSON.parse(readFileSync(path, "utf8")) as CollectionCatalogEntry[];
}

export function getCollections(pets: Pet[]): PetCollection[] {
  return readGeneratedCollections().map((collection) => ({
    ...collection,
    pets: pets.filter((pet) => pet.collections.includes(collection.slug)),
  }));
}

export function getFeaturedCollections(pets: Pet[]) {
  return getCollections(pets).filter((collection) => collection.featured);
}

export function getCollectionBySlug(pets: Pet[], slug: string) {
  return getCollections(pets).find((collection) => collection.slug === slug) ?? null;
}

export function getCollectionSlugs() {
  return readGeneratedCollections().map((collection) => collection.slug);
}
