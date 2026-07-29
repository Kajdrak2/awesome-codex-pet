"use client";

import Link from "next/link";
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocale } from "@/components/locale-provider";
import { getLocalizedPetName } from "@/lib/codex-links";
import type {
  LeaderboardData,
  RankedCollection,
  RankedContributor,
  RankedPet,
  RankingWindow,
} from "@/lib/leaderboards";
import type { GalleryPet } from "@/lib/pets";
import {
  getWeeklyVote,
  voteForTarget,
  type VoteKind,
} from "@/lib/stats";

type RankingTab = "pets" | "contributors" | "collections";

const rankingLimit = 30;

function formatCount(value: number) {
  if (value < 1_000) return value.toString();
  if (value < 1_000_000) {
    return `${(value / 1_000).toFixed(value < 10_000 ? 1 : 0)}k`;
  }
  return `${(value / 1_000_000).toFixed(1)}m`;
}

function rankClass(rank: number) {
  if (rank === 1) return "border-amber-400/50 bg-amber-400/5 text-amber-700 dark:text-amber-300";
  if (rank === 2) return "border-zinc-400/50 bg-zinc-400/5 text-zinc-600 dark:text-zinc-300";
  if (rank === 3) return "border-orange-500/40 bg-orange-500/5 text-orange-700 dark:text-orange-300";
  return "border-border bg-bg-elevated text-muted";
}

function sortRanked<T extends { weeklyScore: number; allScore: number }>(
  entries: T[],
  rankingWindow: RankingWindow,
) {
  const key = rankingWindow === "weekly" ? "weeklyScore" : "allScore";
  return [...entries].sort((a, b) => b[key] - a[key]);
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-14 text-left sm:min-w-16 sm:text-right">
      <div className="font-mono text-sm font-semibold tabular-nums text-text">
        {formatCount(value)}
      </div>
      <div className="mt-0.5 whitespace-nowrap text-[10px] text-muted">
        {label}
      </div>
    </div>
  );
}

function PreviewMosaic({
  href,
  label,
  locale,
  pets,
}: {
  href: string;
  label: string;
  locale: "en" | "zh";
  pets: GalleryPet[];
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const visiblePets = pets.slice(0, 3);
  const layoutClass =
    visiblePets.length === 1
      ? "grid-cols-1 grid-rows-1"
      : visiblePets.length === 2
        ? "grid-cols-[2fr_1fr] grid-rows-1"
        : "grid-cols-[2fr_1fr] grid-rows-2";

  return (
    <Link
      aria-label={label}
      className={`grid h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-bg-secondary sm:h-20 sm:w-32 ${layoutClass}`}
      href={href}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsAnimating(false);
        }
      }}
      onFocus={() => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setIsAnimating(true);
        }
      }}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "touch" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          setIsAnimating(true);
        }
      }}
      onPointerLeave={() => setIsAnimating(false)}
    >
      {visiblePets.map((pet, index) => (
        <span
          className={`flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-bg-secondary ${
            index === 0 && visiblePets.length === 3
              ? "row-span-2 border-r border-border"
              : index === 1 && visiblePets.length === 2
                ? "border-l border-border"
                : ""
          } ${index === 2 ? "border-t border-border" : ""}`}
          key={pet.slug}
        >
          <img
            alt={getLocalizedPetName(pet, locale)}
            className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
            decoding="async"
            loading="lazy"
            src={
              isAnimating ? pet.animatedPreviewImage : pet.previewImage
            }
          />
        </span>
      ))}
    </Link>
  );
}

function PetRankingPreview({
  autoAnimate,
  name,
  pet,
}: {
  autoAnimate: boolean;
  name: string;
  pet: GalleryPet;
}) {
  const [isInteracting, setIsInteracting] = useState(false);
  const isAnimating = autoAnimate || isInteracting;

  function startAnimation(event?: PointerEvent<HTMLAnchorElement>) {
    if (
      event?.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setIsInteracting(true);
  }

  return (
    <Link
      aria-label={name}
      className="flex size-16 items-center justify-center overflow-hidden rounded-md border border-border bg-bg-secondary sm:size-20"
      href={`/pets/${pet.slug}`}
      onBlur={() => setIsInteracting(false)}
      onFocus={() => startAnimation()}
      onPointerEnter={startAnimation}
      onPointerLeave={() => setIsInteracting(false)}
    >
      <img
        alt={name}
        className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
        decoding="async"
        loading="lazy"
        src={isAnimating ? pet.animatedPreviewImage : pet.previewImage}
      />
    </Link>
  );
}

function VoteButton({
  active,
  disabled,
  label,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`inline-flex h-9 min-w-20 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-bg text-text hover:border-accent hover:text-accent"
      } disabled:cursor-wait disabled:opacity-60`}
      disabled={disabled || active}
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {active ? (
          <path d="m5 12 4 4L19 6" />
        ) : (
          <path d="M12 20V4m0 0L6 10m6-6 6 6" />
        )}
      </svg>
      {label}
    </button>
  );
}

export function RankingsPageContent({
  data,
}: {
  data: LeaderboardData;
}) {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<RankingTab>("pets");
  const [rankingWindow, setRankingWindow] =
    useState<RankingWindow>("weekly");
  const [selectedVotes, setSelectedVotes] = useState<
    Record<VoteKind, string | null>
  >({
    pet: null,
    collection: null,
  });
  const [pendingVote, setPendingVote] = useState<string | null>(null);
  const [voteError, setVoteError] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [petVotes, setPetVotes] = useState(() =>
    Object.fromEntries(
      data.pets.map((entry) => [entry.pet.slug, entry.stats.weeklyVotes]),
    ),
  );
  const [collectionVotes, setCollectionVotes] = useState(() =>
    Object.fromEntries(
      data.collections.map((entry) => [
        entry.collection.slug,
        entry.weeklyVotes,
      ]),
    ),
  );

  useEffect(() => {
    setSelectedVotes({
      pet: getWeeklyVote(data.votePeriod.id, "pet"),
      collection: getWeeklyVote(data.votePeriod.id, "collection"),
    });
  }, [data.votePeriod.id]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setMotionAllowed(!media.matches);
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  const rankedPets = useMemo(
    () => sortRanked(data.pets, rankingWindow).slice(0, rankingLimit),
    [data.pets, rankingWindow],
  );
  const rankedContributors = useMemo(
    () => sortRanked(data.contributors, rankingWindow).slice(0, rankingLimit),
    [data.contributors, rankingWindow],
  );
  const rankedCollections = useMemo(
    () => sortRanked(data.collections, rankingWindow).slice(0, rankingLimit),
    [data.collections, rankingWindow],
  );
  const hasWeeklyActivity =
    data.pets.some(
      (entry) => entry.stats.installs7d > 0 || entry.stats.weeklyVotes > 0,
    ) || data.collections.some((entry) => entry.weeklyVotes > 0);
  const tabs: Array<{ value: RankingTab; label: string }> = [
    { value: "pets", label: t("rankingPets") },
    { value: "contributors", label: t("rankingContributors") },
    { value: "collections", label: t("rankingCollections") },
  ];

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const currentIndex = tabs.findIndex((item) => item.value === tab);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % tabs.length
            : (currentIndex - 1 + tabs.length) % tabs.length;
    setTab(tabs[nextIndex].value);
    event.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  }

  async function castVote(kind: VoteKind, slug: string) {
    setVoteError(false);
    setPendingVote(`${kind}:${slug}`);
    try {
      const result = await voteForTarget(
        kind,
        slug,
        data.votePeriod.id,
      );
      const update =
        kind === "pet" ? setPetVotes : setCollectionVotes;
      update((current) => {
        const next = { ...current, [slug]: result.votes };
        if (result.previousSlug && result.previousVotes !== null) {
          next[result.previousSlug] = result.previousVotes;
        }
        return next;
      });
      setSelectedVotes((current) => ({ ...current, [kind]: slug }));
    } catch (error: unknown) {
      console.warn(
        "Unable to save weekly vote",
        error instanceof Error ? error.stack : String(error),
      );
      setVoteError(true);
    } finally {
      setPendingVote(null);
    }
  }

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { month: "short", day: "numeric", timeZone: "UTC" },
  );
  const snapshotLabel = data.generatedAt
    ? dateFormatter.format(data.generatedAt)
    : "—";
  const voteEndLabel = dateFormatter.format(data.votePeriod.endsAt);

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <header className="border-b border-border pb-9">
        <p className="mb-3 text-xs font-semibold uppercase text-accent">
          {t("rankings")}
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold text-text sm:text-5xl">
              {t("rankingsPageTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {t("rankingsPageSubtitle")}
            </p>
          </div>
          <dl className="grid grid-cols-2 divide-x divide-border border-y border-border lg:min-w-80">
            <div className="px-4 py-3 first:pl-0 lg:first:pl-4">
              <dt className="text-[10px] uppercase text-muted">
                {t("rankingSnapshot")}
              </dt>
              <dd className="mt-1 text-sm font-medium text-text">
                {snapshotLabel}
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-[10px] uppercase text-muted">
                {t("rankingWeeklyVote")}
              </dt>
              <dd className="mt-1 text-sm font-medium text-text">
                {voteEndLabel}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="sticky top-14 z-30 -mx-4 border-b border-border bg-bg/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            aria-label={t("rankings")}
            className="grid h-11 grid-cols-3 rounded-lg border border-border bg-bg-secondary p-1"
            onKeyDown={handleTabKeyDown}
            role="tablist"
          >
            {tabs.map((item) => (
              <button
                aria-controls={`rankings-panel-${item.value}`}
                aria-selected={tab === item.value}
                className={`min-w-0 rounded-md px-3 text-sm font-medium transition-colors sm:min-w-32 ${
                  tab === item.value
                    ? "bg-bg-elevated text-text shadow-sm"
                    : "text-muted hover:text-text"
                }`}
                id={`rankings-tab-${item.value}`}
                key={item.value}
                onClick={() => setTab(item.value)}
                role="tab"
                tabIndex={tab === item.value ? 0 : -1}
                type="button"
              >
                <span className="block truncate">{item.label}</span>
              </button>
            ))}
          </div>
          <div
            className="grid h-11 grid-cols-2 rounded-lg border border-border bg-bg-secondary p-1"
            role="group"
          >
            {(["weekly", "all"] as const).map((value) => (
              <button
                aria-pressed={rankingWindow === value}
                className={`rounded-md px-5 text-sm font-medium transition-colors ${
                  rankingWindow === value
                    ? "bg-bg-elevated text-text shadow-sm"
                    : "text-muted hover:text-text"
                }`}
                key={value}
                onClick={() => setRankingWindow(value)}
                type="button"
              >
                {t(value === "weekly" ? "rankingWeekly" : "rankingAllTime")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasWeeklyActivity && rankingWindow === "weekly" ? (
        <p className="border-b border-border py-5 text-sm text-muted">
          {t("rankingNoActivity")}
        </p>
      ) : null}
      {voteError ? (
        <p className="border-b border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
          {t("rankingVoteFailed")}
        </p>
      ) : null}

      <section
        aria-labelledby="rankings-tab-pets"
        className="mt-8"
        hidden={tab !== "pets"}
        id="rankings-panel-pets"
        role="tabpanel"
      >
        {tab === "pets" ? (
          <PetRanking
            entries={rankedPets}
            locale={locale}
            motionAllowed={motionAllowed}
            pendingVote={pendingVote}
            selectedVote={selectedVotes.pet}
            showVote={rankingWindow === "weekly"}
            votes={petVotes}
            onVote={(slug) => void castVote("pet", slug)}
          />
        ) : null}
      </section>
      <section
        aria-labelledby="rankings-tab-contributors"
        className="mt-8"
        hidden={tab !== "contributors"}
        id="rankings-panel-contributors"
        role="tabpanel"
      >
        {tab === "contributors" ? (
          <ContributorRanking
            entries={rankedContributors}
            rankingWindow={rankingWindow}
          />
        ) : null}
      </section>
      <section
        aria-labelledby="rankings-tab-collections"
        className="mt-8"
        hidden={tab !== "collections"}
        id="rankings-panel-collections"
        role="tabpanel"
      >
        {tab === "collections" ? (
          <CollectionRanking
            entries={rankedCollections}
            locale={locale}
            pendingVote={pendingVote}
            selectedVote={selectedVotes.collection}
            showVote={rankingWindow === "weekly"}
            votes={collectionVotes}
            onVote={(slug) => void castVote("collection", slug)}
          />
        ) : null}
      </section>

      <aside className="mt-10 border-y border-border py-5 text-sm leading-relaxed text-muted">
        {t("rankingFairness")}
        <span className="ml-2 text-text-secondary">
          {t("rankingEnds", { date: voteEndLabel })}
        </span>
      </aside>
    </main>
  );
}

function PetRanking({
  entries,
  locale,
  motionAllowed,
  pendingVote,
  selectedVote,
  showVote,
  votes,
  onVote,
}: {
  entries: RankedPet[];
  locale: "en" | "zh";
  motionAllowed: boolean;
  pendingVote: string | null;
  selectedVote: string | null;
  showVote: boolean;
  votes: Record<string, number>;
  onVote: (slug: string) => void;
}) {
  const { t } = useLocale();
  return (
    <ol className="divide-y divide-border border-y border-border">
      {entries.map((entry, index) => {
        const rank = index + 1;
        const name = getLocalizedPetName(entry.pet, locale);
        return (
          <li
            className="grid grid-cols-[2.25rem_4rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-4 sm:grid-cols-[3rem_5rem_minmax(0,1fr)_auto] sm:gap-x-4"
            key={entry.pet.slug}
          >
            <span
              className={`inline-flex size-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${rankClass(rank)}`}
            >
              {rank}
            </span>
            <PetRankingPreview
              autoAnimate={motionAllowed && rank <= 3}
              name={name}
              pet={entry.pet}
            />
            <div className="min-w-0">
              <Link
                className="block truncate text-sm font-semibold text-text hover:text-accent sm:text-base"
                href={`/pets/${entry.pet.slug}`}
              >
                {name}
              </Link>
              <Link
                className="mt-1 block truncate text-xs text-muted hover:text-text"
                href={`/contributors/${entry.pet.author_slug}`}
              >
                @{entry.pet.author_handle || entry.pet.author}
              </Link>
            </div>
            <div className="col-span-2 col-start-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3 sm:col-span-1 sm:col-start-4 sm:mt-0 sm:flex-nowrap sm:justify-end sm:border-0 sm:pt-0">
              <Metric
                label={t(
                  showVote ? "rankingInstalls7d" : "rankingTotalInstalls",
                )}
                value={
                  showVote ? entry.stats.installs7d : entry.stats.installs
                }
              />
              <Metric label={t("rankingLikes")} value={entry.stats.likes} />
              {showVote ? (
                <>
                  <Metric
                    label={t("rankingVotes")}
                    value={votes[entry.pet.slug] ?? 0}
                  />
                  <VoteButton
                    active={selectedVote === entry.pet.slug}
                    disabled={pendingVote !== null}
                    label={t(
                      selectedVote === entry.pet.slug
                        ? "rankingVoted"
                        : "rankingVote",
                    )}
                    onClick={() => onVote(entry.pet.slug)}
                  />
                </>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ContributorRanking({
  entries,
  rankingWindow,
}: {
  entries: RankedContributor[];
  rankingWindow: RankingWindow;
}) {
  const { locale, t } = useLocale();
  return (
    <ol className="divide-y divide-border border-y border-border">
      {entries.map((entry, index) => {
        const rank = index + 1;
        return (
          <li
            className="grid grid-cols-[2.25rem_6rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-4 sm:grid-cols-[3rem_8rem_minmax(0,1fr)_auto] sm:gap-x-4"
            key={entry.slug}
          >
            <span
              className={`inline-flex size-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${rankClass(rank)}`}
            >
              {rank}
            </span>
            <PreviewMosaic
              href={`/contributors/${entry.slug}`}
              label={entry.name}
              locale={locale}
              pets={entry.pets}
            />
            <div className="min-w-0">
              <Link
                className="block truncate text-sm font-semibold text-text hover:text-accent sm:text-base"
                href={`/contributors/${entry.slug}`}
              >
                {entry.name}
              </Link>
              <p className="mt-1 truncate text-xs text-muted">
                @{entry.handle} · {t("rankingPetCount", { count: entry.petCount })}
              </p>
            </div>
            <div className="col-span-2 col-start-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3 sm:col-span-1 sm:col-start-4 sm:mt-0 sm:flex-nowrap sm:justify-end sm:border-0 sm:pt-0">
              <Metric
                label={t(
                  rankingWindow === "weekly"
                    ? "rankingInstalls7d"
                    : "rankingTotalInstalls",
                )}
                value={
                  rankingWindow === "weekly"
                    ? entry.installs7d
                    : entry.installs
                }
              />
              <Metric label={t("rankingLikes")} value={entry.likes} />
              <Metric
                label={t(
                  rankingWindow === "weekly"
                    ? "rankingVotes"
                    : "rankingPetMetric",
                )}
                value={
                  rankingWindow === "weekly"
                    ? entry.weeklyVotes
                    : entry.petCount
                }
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function CollectionRanking({
  entries,
  locale,
  pendingVote,
  selectedVote,
  showVote,
  votes,
  onVote,
}: {
  entries: RankedCollection[];
  locale: "en" | "zh";
  pendingVote: string | null;
  selectedVote: string | null;
  showVote: boolean;
  votes: Record<string, number>;
  onVote: (slug: string) => void;
}) {
  const { t } = useLocale();
  return (
    <ol className="divide-y divide-border border-y border-border">
      {entries.map((entry, index) => {
        const rank = index + 1;
        const collection = entry.collection;
        return (
          <li
            className="grid grid-cols-[2.25rem_6rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-4 sm:grid-cols-[3rem_8rem_minmax(0,1fr)_auto] sm:gap-x-4"
            key={collection.slug}
          >
            <span
              className={`inline-flex size-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${rankClass(rank)}`}
            >
              {rank}
            </span>
            <PreviewMosaic
              href={`/collections/${collection.slug}`}
              label={collection.title[locale]}
              locale={locale}
              pets={collection.coverPets}
            />
            <div className="min-w-0">
              <Link
                className="block truncate text-sm font-semibold text-text hover:text-accent sm:text-base"
                href={`/collections/${collection.slug}`}
              >
                {collection.title[locale]}
              </Link>
              <p className="mt-1 truncate text-xs text-muted">
                {t(
                  collection.kind === "franchise"
                    ? "franchiseSeries"
                    : "themeCollection",
                )}{" "}
                · {t("rankingPetCount", { count: collection.petSlugs.length })}
              </p>
            </div>
            <div className="col-span-2 col-start-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3 sm:col-span-1 sm:col-start-4 sm:mt-0 sm:flex-nowrap sm:justify-end sm:border-0 sm:pt-0">
              <Metric
                label={t(
                  showVote ? "rankingInstalls7d" : "rankingTotalInstalls",
                )}
                value={showVote ? entry.installs7d : entry.installs}
              />
              <Metric label={t("rankingLikes")} value={entry.likes} />
              {showVote ? (
                <>
                  <Metric
                    label={t("rankingVotes")}
                    value={votes[collection.slug] ?? 0}
                  />
                  <VoteButton
                    active={selectedVote === collection.slug}
                    disabled={pendingVote !== null}
                    label={t(
                      selectedVote === collection.slug
                        ? "rankingVoted"
                        : "rankingVote",
                    )}
                    onClick={() => onVote(collection.slug)}
                  />
                </>
              ) : (
                <Metric
                  label={t("rankingPetMetric")}
                  value={collection.petSlugs.length}
                />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
