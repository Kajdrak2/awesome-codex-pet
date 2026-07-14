"use client";

import Link from "next/link";

import { CollectionCard } from "@/components/collection-card";
import { useLocale } from "@/components/locale-provider";
import type { PetCollection } from "@/lib/collections";

export function FeaturedCollections({ collections }: { collections: PetCollection[] }) {
  const { t } = useLocale();

  return (
    <section aria-labelledby="featured-collections-title" className="mb-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            {t("featuredCollectionsEyebrow")}
          </p>
          <h2 id="featured-collections-title" className="text-3xl font-semibold tracking-tight">
            {t("featuredCollectionsTitle")}
          </h2>
        </div>
        <Link className="text-sm font-medium text-muted hover:text-text transition-colors" href="/collections">
          {t("viewAllCollections")}
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {collections.slice(0, 3).map((collection) => (
          <CollectionCard collection={collection} key={collection.slug} />
        ))}
      </div>
    </section>
  );
}
