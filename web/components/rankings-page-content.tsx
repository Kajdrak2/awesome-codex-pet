"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useLocale } from "@/components/locale-provider";
import { getLocalizedPetName } from "@/lib/codex-links";
import type {
  LeaderboardData,
  RankedCollection,
  RankedContributor,
  RankedPet,
  RankingWindow,
} from "@/lib/leaderboards";
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
  window: RankingWindow,
) {
  const key = window === "weekly" ? "weeklyScore" : "allScore";
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
    <div className="min-w-16 text-right">
      <div className="font-mono text-sm font-semibold tabular-nums text-text">
        {formatCount(value)}
      </div>
      <div className="mt-0.5 text-[10px] uppercase text-muted">{label}</div>
    </div>
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
  const [window, setWindow] = useState<RankingWindow>("weekly");
  const [selectedVotes, setSelectedVotes] = useState<
    Record<VoteKind, string | null>
  >({
    pet: null,
    collection: null,
  });
  const [pendingVote, setPendingVote] = useState<string | null>(null);
  const [voteError, setVoteError] = useState(false);
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

  const rankedPets = useMemo(
    () => sortRanked(data.pets, window).slice(0, rankingLimit),
    [data.pets, window],
  );
  const rankedContributors = useMemo(
    () => sortRanked(data.contributors, window).slice(0, rankingLimit),
    [data.contributors, window],
  );
  const rankedCollections = useMemo(
    () => sortRanked(data.collections, window).slice(0, rankingLimit),
    [data.collections, window],
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
            role="tablist"
          >
            {tabs.map((item) => (
              <button
                aria-selected={tab === item.value}
                className={`min-w-0 rounded-md px-3 text-sm font-medium transition-colors sm:min-w-32 ${
                  tab === item.value
                    ? "bg-bg-elevated text-text shadow-sm"
                    : "text-muted hover:text-text"
                }`}
                key={item.value}
                onClick={() => setTab(item.value)}
                role="tab"
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
                aria-pressed={window === value}
                className={`rounded-md px-5 text-sm font-medium transition-colors ${
                  window === value
                    ? "bg-bg-elevated text-text shadow-sm"
                    : "text-muted hover:text-text"
                }`}
                key={value}
                onClick={() => setWindow(value)}
                type="button"
              >
                {t(value === "weekly" ? "rankingWeekly" : "rankingAllTime")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasWeeklyActivity && window === "weekly" ? (
        <p className="border-b border-border py-5 text-sm text-muted">
          {t("rankingNoActivity")}
        </p>
      ) : null}
      {voteError ? (
        <p className="border-b border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
          {t("rankingVoteFailed")}
        </p>
      ) : null}

      <section className="mt-8" role="tabpanel">
        {tab === "pets" ? (
          <PetRanking
            entries={rankedPets}
            locale={locale}
            pendingVote={pendingVote}
            selectedVote={selectedVotes.pet}
            showVote={window === "weekly"}
            votes={petVotes}
            onVote={(slug) => void castVote("pet", slug)}
          />
        ) : null}
        {tab === "contributors" ? (
          <ContributorRanking
            entries={rankedContributors}
            locale={locale}
            window={window}
          />
        ) : null}
        {tab === "collections" ? (
          <CollectionRanking
            entries={rankedCollections}
            locale={locale}
            pendingVote={pendingVote}
            selectedVote={selectedVotes.collection}
            showVote={window === "weekly"}
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
  pendingVote,
  selectedVote,
  showVote,
  votes,
  onVote,
}: {
  entries: RankedPet[];
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
        const name = getLocalizedPetName(entry.pet, locale);
        return (
          <li
            className="grid min-h-20 grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[3rem_4rem_minmax(0,1fr)_auto_auto_auto] sm:gap-4"
            key={entry.pet.slug}
          >
            <span
              className={`inline-flex size-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${rankClass(rank)}`}
            >
              {rank}
            </span>
            <Link
              className="flex size-14 items-center justify-center overflow-hidden rounded-md border border-border bg-bg-secondary sm:size-16"
              href={`/pets/${entry.pet.slug}`}
            >
              <img
                alt=""
                className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
                src={entry.pet.previewImage}
              />
            </Link>
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
            <div className="hidden sm:block">
              <Metric label={t("rankingInstalls")} value={entry.stats.installs7d} />
            </div>
            <div className="hidden md:block">
              <Metric label={t("rankingLikes")} value={entry.stats.likes} />
            </div>
            {showVote ? (
              <div className="flex items-center gap-2">
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
              </div>
            ) : (
              <Metric label={t("rankingInstalls")} value={entry.stats.installs} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ContributorRanking({
  entries,
  locale,
  window,
}: {
  entries: RankedContributor[];
  locale: "en" | "zh";
  window: RankingWindow;
}) {
  const { t } = useLocale();
  return (
    <ol className="divide-y divide-border border-y border-border">
      {entries.map((entry, index) => {
        const rank = index + 1;
        return (
          <li
            className="grid min-h-20 grid-cols-[2.5rem_4.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[3rem_5.5rem_minmax(0,1fr)_auto_auto_auto] sm:gap-4"
            key={entry.slug}
          >
            <span
              className={`inline-flex size-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${rankClass(rank)}`}
            >
              {rank}
            </span>
            <div className="flex h-14 items-center pl-2 sm:h-16">
              {entry.pets.slice(0, 3).map((pet, petIndex) => (
                <div
                  className="-ml-2 flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-bg bg-bg-secondary sm:size-12"
                  key={pet.slug}
                  style={{ zIndex: 3 - petIndex }}
                >
                  <img
                    alt=""
                    className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
                    src={pet.previewImage}
                  />
                </div>
              ))}
            </div>
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
            <div className="hidden sm:block">
              <Metric
                label={t("rankingInstalls")}
                value={window === "weekly" ? entry.installs7d : entry.installs}
              />
            </div>
            <div className="hidden md:block">
              <Metric label={t("rankingLikes")} value={entry.likes} />
            </div>
            <Metric
              label={
                window === "weekly"
                  ? t("rankingVotes")
                  : t("rankingPets")
              }
              value={window === "weekly" ? entry.weeklyVotes : entry.petCount}
            />
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
            className="grid min-h-20 grid-cols-[2.5rem_4.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[3rem_5.5rem_minmax(0,1fr)_auto_auto_auto] sm:gap-4"
            key={collection.slug}
          >
            <span
              className={`inline-flex size-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${rankClass(rank)}`}
            >
              {rank}
            </span>
            <div className="flex h-14 items-center pl-2 sm:h-16">
              {collection.coverPets.slice(0, 3).map((pet, petIndex) => (
                <div
                  className="-ml-2 flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-bg bg-bg-secondary sm:size-12"
                  key={pet.slug}
                  style={{ zIndex: 3 - petIndex }}
                >
                  <img
                    alt=""
                    className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
                    src={pet.previewImage}
                  />
                </div>
              ))}
            </div>
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
            <div className="hidden sm:block">
              <Metric
                label={t("rankingInstalls")}
                value={showVote ? entry.installs7d : entry.installs}
              />
            </div>
            <div className="hidden md:block">
              <Metric label={t("rankingLikes")} value={entry.likes} />
            </div>
            {showVote ? (
              <div className="flex items-center gap-2">
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
              </div>
            ) : (
              <Metric label={t("rankingInstalls")} value={entry.installs} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
