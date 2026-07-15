"use client";

import { CollectionCard } from "@/components/collection-card";
import { useLocale } from "@/components/locale-provider";
import type { PetCollection } from "@/lib/collections";

export function CollectionsPageContent({ collections }: { collections: PetCollection[] }) {
  const { t } = useLocale();
  const franchiseSeries = collections.filter((collection) => collection.kind === "franchise");
  const themeCollections = collections.filter((collection) => collection.kind === "theme");

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
      {franchiseSeries.length > 0 ? (
        <section aria-labelledby="franchise-series-title" className="mb-16">
          <div className="mb-6 max-w-2xl">
            <h2 id="franchise-series-title" className="mb-2 text-2xl font-semibold">
              {t("franchiseSeriesTitle")}
            </h2>
            <p className="leading-relaxed text-muted">{t("franchiseSeriesDesc")}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {franchiseSeries.map((collection) => (
              <CollectionCard collection={collection} key={collection.slug} />
            ))}
          </div>
        </section>
      ) : null}

      {themeCollections.length > 0 ? (
        <section aria-labelledby="theme-collections-title">
          <div className="mb-6 max-w-2xl">
            <h2 id="theme-collections-title" className="mb-2 text-2xl font-semibold">
              {t("themeCollectionsTitle")}
            </h2>
            <p className="leading-relaxed text-muted">{t("themeCollectionsDesc")}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {themeCollections.map((collection) => (
              <CollectionCard collection={collection} key={collection.slug} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
