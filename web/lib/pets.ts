import { readFileSync } from "node:fs";
import { join } from "node:path";

export type PreviewAction = string;

type CatalogPet = {
  slug: string;
  name: string;
  author: string;
  author_handle?: string;
  author_url?: string;
  primary_category: string;
  license: string;
  description?: string;
  spriteVersionNumber: 1 | 2;
};

export type LocalizedCategoryLabel = {
  en: string;
  zh: string;
};

export type LocalizedPetNames = {
  en?: string;
  zh?: string;
};

export type Pet = CatalogPet & {
  categoryLabel: LocalizedCategoryLabel;
  localizedNames: LocalizedPetNames;
  displayName?: string;
  runtimeDescription?: string;
  slugLabel: string;
  tags: string[];
  collections: string[];
  sourceType: string;
  sourceUrl: string;
  previewImage: string;
  animatedPreviewImage: string;
  contactSheet: string;
  actions: PreviewAction[];
  gifs: Record<PreviewAction, string>;
  installCommand: string;
  installCommandPowerShell: string;
  repositoryPath: string;
};

function readGeneratedPets(): Pet[] {
  const path = join(process.cwd(), ".generated", "pets.generated.json");
  return JSON.parse(readFileSync(path, "utf8")) as Pet[];
}

export function getAllPets(): Pet[] {
  return readGeneratedPets();
}

export function getPetBySlug(slug: string) {
  return getAllPets().find((pet) => pet.slug === slug) ?? null;
}

export function getCategories(pets: Pet[]) {
  return Array.from(
    new Map(
      pets.map((pet) => [
        pet.primary_category,
        { name: pet.primary_category, label: pet.categoryLabel },
      ]),
    ).values(),
  );
}

function titleCase(input: string) {
  return input
    .split("-")
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

export function getActionEntries(pet: Pet) {
  return pet.actions.map((action) => ({
    action,
    title: titleCase(action),
    image: pet.gifs[action] ?? `/assets/previews/${pet.slug}/gifs/${action}.gif`,
  }));
}
