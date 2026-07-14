"use client";

import { CollectionCard } from "@/components/collection-card";
import { useLocale } from "@/components/locale-provider";
import type { PetCollection } from "@/lib/collections";

export function CollectionsPageContent({ collections }: { collections: PetCollection[] }) {
  const { t } = useLocale();

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-16">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
          {t("collections")}
        </p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("collectionsPageTitle")}
        </h1>
        <p className="text-lg leading-relaxed text-muted">{t("collectionsPageSubtitle")}</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard collection={collection} key={collection.slug} />
        ))}
      </div>
    </main>
  );
}
