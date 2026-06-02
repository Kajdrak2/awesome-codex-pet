"use client";

import { useEffect, useMemo, useState } from "react";

import { FilterBar } from "@/components/filter-bar";
import { PetCard } from "@/components/pet-card";
import { useLocale } from "@/components/locale-provider";
import { fetchStats, type StatsMap } from "@/lib/stats";
import type { Pet } from "@/lib/pets";

type PetGalleryProps = {
  pets: Pet[];
  categories: string[];
};

type SortKey = "popular" | "downloads" | "name";

function normalizeSortText(value: string) {
  return value.normalize("NFKD").toLowerCase();
}

function comparePetsByName(a: Pet, b: Pet) {
  const aName = normalizeSortText(a.name);
  const bName = normalizeSortText(b.name);

  if (aName < bName) return -1;
  if (aName > bName) return 1;
  if (a.slug < b.slug) return -1;
  if (a.slug > b.slug) return 1;
  return 0;
}

export function PetGallery({ pets, categories }: PetGalleryProps) {
  const { t } = useLocale();
  const [filters, setFilters] = useState({ query: "", category: "All" });
  const [sort, setSort] = useState<SortKey>("popular");
  const [stats, setStats] = useState<StatsMap>({});

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal).then(setStats);
    return () => controller.abort();
  }, []);

  const visible = useMemo(() => {
    const loweredQuery = filters.query.toLowerCase();

    const filtered = pets.filter((pet) => {
      const matchesCategory =
        filters.category === "All" || pet.primary_category === filters.category;
      if (!matchesCategory) return false;
      if (!loweredQuery) return true;

      const haystack = [
        pet.name,
        pet.author,
        pet.author_handle,
        pet.primary_category,
        pet.description,
        pet.runtimeDescription,
        pet.displayName,
        ...pet.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(loweredQuery);
    });

    const withStats = filtered.map((pet) => ({
      pet,
      views: stats[pet.slug]?.views ?? 0,
      installs: stats[pet.slug]?.installs ?? 0,
    }));

    withStats.sort((a, b) => {
      switch (sort) {
        case "downloads":
          return (
            b.installs - a.installs ||
            b.views - a.views ||
            comparePetsByName(a.pet, b.pet)
          );
        case "name":
          return comparePetsByName(a.pet, b.pet);
        case "popular":
        default:
          return (
            b.views - a.views ||
            b.installs - a.installs ||
            comparePetsByName(a.pet, b.pet)
          );
      }
    });

    return withStats;
  }, [filters, pets, sort, stats]);

  return (
    <section id="gallery" className="scroll-mt-20">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {t("galleryTitle")}
          </h2>
          <p className="text-muted text-sm mt-1">
            {t("petsAvailable", { count: visible.length })}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline text-muted">{t("sortLabel")}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-9 px-3 pr-8 rounded-lg text-sm text-text bg-bg border border-border focus:border-text focus:ring-0 outline-none transition-colors appearance-none cursor-pointer"
            aria-label={t("sortLabel")}
          >
            <option value="popular">{t("sortPopular")}</option>
            <option value="downloads">{t("sortDownloads")}</option>
            <option value="name">{t("sortName")}</option>
          </select>
        </div>
      </div>

      <FilterBar categories={categories} onChange={setFilters} />

      {visible.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{t("noResults")}</p>
          <p className="text-sm mt-1">{t("noResultsHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(({ pet, views, installs }, i) => (
            <div
              key={pet.slug}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <PetCard pet={pet} views={views} installs={installs} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
