"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  FilterBar,
  type CategoryFilterOption,
} from "@/components/filter-bar";
import { PetCard } from "@/components/pet-card";
import { useLocale } from "@/components/locale-provider";
import { fetchStats, type StatsMap } from "@/lib/stats";
import type { Pet } from "@/lib/pets";

type PetGalleryProps = {
  pets: Pet[];
  categories: Array<{ name: string; label: Pet["categoryLabel"] }>;
};

type SortKey = "trending" | "downloads" | "likes" | "name";

const INITIAL_BATCH_SIZE = 18;
const LOAD_MORE_BATCH_SIZE = 18;

type StatsState =
  | { status: "loading"; pets: StatsMap; generatedAt: number }
  | { status: "ready"; pets: StatsMap; generatedAt: number }
  | { status: "error"; pets: StatsMap; generatedAt: number };

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
  const [filters, setFilters] = useState({
    query: "",
    categories: [] as string[],
  });
  const [sort, setSort] = useState<SortKey>("downloads");
  const [renderCount, setRenderCount] = useState(INITIAL_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [statsState, setStatsState] = useState<StatsState>({
    status: "loading",
    pets: {},
    generatedAt: 0,
  });

  useEffect(() => {
    const controller = new AbortController();
    void fetchStats(controller.signal)
      .then((payload) => {
        setStatsState({
          status: "ready",
          pets: payload.pets,
          generatedAt: payload.generatedAt,
        });
      })
      .catch((error: unknown) => {
        console.warn(
          "Unable to load pet statistics",
          error instanceof Error ? error.stack : String(error),
        );
        if (!controller.signal.aborted) {
          setStatsState({ status: "error", pets: {}, generatedAt: 0 });
        }
      });
    return () => controller.abort();
  }, []);

  const visible = useMemo(() => {
    const queryTerms = normalizeSortText(filters.query)
      .split(/\s+/)
      .filter(Boolean);

    const filtered = pets.filter((pet) => {
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(pet.primary_category);
      if (!matchesCategory) return false;
      if (queryTerms.length === 0) return true;

      const haystack = normalizeSortText([
        pet.name,
        pet.author,
        pet.author_handle,
        pet.primary_category,
        pet.description,
        pet.runtimeDescription,
        pet.displayName,
        pet.categoryLabel.en,
        pet.categoryLabel.zh,
        ...pet.tags,
      ]
        .filter(Boolean)
        .join(" "));

      return queryTerms.every((term) => haystack.includes(term));
    });

    const withStats = filtered.map((pet, originalIndex) => ({
      pet,
      originalIndex,
      views: statsState.pets[pet.slug]?.views ?? 0,
      installs: statsState.pets[pet.slug]?.installs ?? 0,
      likes: statsState.pets[pet.slug]?.likes ?? 0,
      installs7d: statsState.pets[pet.slug]?.installs7d ?? 0,
      trendingScore: statsState.pets[pet.slug]?.trendingScore ?? 0,
      dailyRank: statsState.pets[pet.slug]?.dailyRank ?? 0,
    }));

    withStats.sort((a, b) => {
      if (sort !== "name" && statsState.status !== "ready") {
        return a.originalIndex - b.originalIndex;
      }

      switch (sort) {
        case "downloads":
          return (
            b.installs - a.installs ||
            b.likes - a.likes ||
            b.views - a.views ||
            comparePetsByName(a.pet, b.pet)
          );
        case "likes":
          return (
            b.likes - a.likes ||
            b.installs - a.installs ||
            b.views - a.views ||
            comparePetsByName(a.pet, b.pet)
          );
        case "name":
          return comparePetsByName(a.pet, b.pet);
        case "trending":
        default:
          return (
            b.trendingScore - a.trendingScore ||
            b.installs7d - a.installs7d ||
            b.installs - a.installs ||
            b.likes - a.likes ||
            b.dailyRank - a.dailyRank ||
            comparePetsByName(a.pet, b.pet)
          );
      }
    });

    return withStats;
  }, [filters, pets, sort, statsState]);

  useEffect(() => {
    setRenderCount(INITIAL_BATCH_SIZE);
  }, [filters.categories, filters.query, sort]);

  const categoryOptions = useMemo<CategoryFilterOption[]>(() => {
    const countByCategory = new Map<string, number>();
    for (const pet of pets) {
      countByCategory.set(
        pet.primary_category,
        (countByCategory.get(pet.primary_category) ?? 0) + 1,
      );
    }
    return categories
      .map((category) => ({
        ...category,
        count: countByCategory.get(category.name) ?? 0,
      }))
      .filter((category) => category.count > 0);
  }, [categories, pets]);

  const rendered = visible.slice(0, renderCount);
  const hasMore = rendered.length < visible.length;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!hasMore || !target || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setRenderCount((current) =>
          Math.min(current + LOAD_MORE_BATCH_SIZE, visible.length),
        );
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, visible.length]);

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

        <div className="flex flex-col items-end gap-1 text-sm">
          <span className="text-xs text-muted" aria-live="polite">
            {statsState.status === "loading"
              ? t("statsLoading")
              : statsState.status === "error"
                ? t("statsUnavailable")
                : t("statsUpdated")}
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-muted">
              {t("sortLabel")}
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-9 px-3 pr-8 rounded-lg text-sm text-text bg-bg border border-border focus:border-text focus:ring-0 outline-none transition-colors appearance-none cursor-pointer"
              aria-label={t("sortLabel")}
            >
              <option value="downloads">{t("sortDownloads")}</option>
              <option value="likes">{t("sortLikes")}</option>
              <option value="trending">{t("sortPopular")}</option>
              <option value="name">{t("sortName")}</option>
            </select>
          </div>
        </div>
      </div>

      <FilterBar categories={categoryOptions} onChange={setFilters} />

      {visible.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{t("noResults")}</p>
          <p className="text-sm mt-1">{t("noResultsHint")}</p>
        </div>
      ) : (
        <>
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            }}
          >
          {rendered.map(({ pet, views, installs, likes }, i) => (
            <div
              key={pet.slug}
              className="h-full animate-fade-in-up"
              style={{ animationDelay: `${(i % LOAD_MORE_BATCH_SIZE) * 30}ms` }}
            >
              <PetCard
                pet={pet}
                views={views}
                installs={installs}
                likes={likes}
              />
            </div>
          ))}
          </div>
          <div
            ref={loadMoreRef}
            className="flex min-h-20 flex-col items-center justify-center gap-2 pt-6"
            aria-live="polite"
          >
            <span className="text-xs text-muted">
              {t("showingPets", { count: rendered.length })}
            </span>
            {hasMore ? (
              <button
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-bg-elevated px-4 text-sm font-medium text-text transition-colors hover:border-border-hover hover:bg-surface"
                type="button"
                onClick={() =>
                  setRenderCount((current) =>
                    Math.min(
                      current + LOAD_MORE_BATCH_SIZE,
                      visible.length,
                    ),
                  )
                }
              >
                {t("loadMorePets")}
              </button>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
