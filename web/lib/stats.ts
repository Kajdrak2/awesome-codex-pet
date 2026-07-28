"use client";

import {
  getUtcVotePeriod,
  type VotePeriod,
} from "@/lib/vote-period";

export type { VotePeriod } from "@/lib/vote-period";

export type PetStats = {
  installs: number;
  likes: number;
  installs7d: number;
  weeklyVotes: number;
  trendingScore: number;
  dailyRank: number;
  updatedAt: number;
};

export type StatsMap = Record<string, PetStats>;

export type CollectionStats = {
  weeklyVotes: number;
};

export type VoteKind = "pet" | "collection";

export type StatsPayload = {
  pets: StatsMap;
  collections: Record<string, CollectionStats>;
  generatedAt: number;
  windowDays: number;
  votePeriod: VotePeriod;
};

const STATS_SNAPSHOT_PATH = "/stats.json";
const STATS_WRITE_API =
  process.env.NEXT_PUBLIC_STATS_WRITE_API ?? "https://api.codexpet.top";
const STATS_WRITE_TIMEOUT_MS = 8_000;
const STATS_CACHE_TTL_MS = 60_000;

export class StatsWriteTimeoutError extends Error {
  constructor(options?: ErrorOptions) {
    super("The statistics write request timed out", options);
    this.name = "StatsWriteTimeoutError";
  }
}

let cachedStats: { payload: StatsPayload; expiresAt: number } | undefined;
let pendingStats: Promise<StatsPayload> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonNegativeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

function normalizeStatsPayload(value: unknown): StatsPayload {
  if (!isRecord(value) || !isRecord(value.pets)) {
    throw new Error("Stats snapshot returned an invalid payload");
  }

  const pets: StatsMap = {};
  for (const [slug, rawStats] of Object.entries(value.pets)) {
    if (!isRecord(rawStats)) continue;
    pets[slug] = {
      installs: asNonNegativeNumber(rawStats.installs),
      likes: asNonNegativeNumber(rawStats.likes),
      installs7d: asNonNegativeNumber(rawStats.installs7d),
      weeklyVotes: asNonNegativeNumber(rawStats.weeklyVotes),
      trendingScore: asNonNegativeNumber(rawStats.trendingScore),
      dailyRank: asNonNegativeNumber(rawStats.dailyRank),
      updatedAt: asNonNegativeNumber(rawStats.updatedAt),
    };
  }
  const collections: Record<string, CollectionStats> = {};
  if (isRecord(value.collections)) {
    for (const [slug, rawStats] of Object.entries(value.collections)) {
      if (!isRecord(rawStats)) continue;
      collections[slug] = {
        weeklyVotes: asNonNegativeNumber(rawStats.weeklyVotes),
      };
    }
  }
  const rawPeriod = isRecord(value.votePeriod) ? value.votePeriod : {};
  const generatedAt = asNonNegativeNumber(value.generatedAt);
  const fallbackPeriod = getUtcVotePeriod(generatedAt || Date.now());

  return {
    pets,
    collections,
    generatedAt,
    windowDays: asNonNegativeNumber(value.windowDays) || 7,
    votePeriod: {
      id:
        typeof rawPeriod.id === "string" && rawPeriod.id
          ? rawPeriod.id
          : fallbackPeriod.id,
      startsAt:
        asNonNegativeNumber(rawPeriod.startsAt) || fallbackPeriod.startsAt,
      endsAt:
        asNonNegativeNumber(rawPeriod.endsAt) ||
        fallbackPeriod.endsAt,
    },
  };
}

function logStatsError(context: string, error: unknown) {
  console.warn(context, error instanceof Error ? error.stack : String(error));
}

async function loadStats() {
  const now = Date.now();
  if (cachedStats && cachedStats.expiresAt > now) {
    return cachedStats.payload;
  }

  if (!pendingStats) {
    pendingStats = fetch(STATS_SNAPSHOT_PATH)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Stats snapshot returned HTTP ${response.status}`);
        }
        const payload = normalizeStatsPayload(await response.json());
        cachedStats = {
          payload,
          expiresAt: Date.now() + STATS_CACHE_TTL_MS,
        };
        return payload;
      })
      .finally(() => {
        pendingStats = undefined;
      });
  }

  return pendingStats;
}

function withAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) {
    return Promise.reject(
      new DOMException("The operation was aborted", "AbortError"),
    );
  }

  return new Promise((resolve, reject) => {
    const abort = () =>
      reject(new DOMException("The operation was aborted", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", abort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener("abort", abort);
        reject(error);
      },
    );
  });
}

export function fetchStats(signal?: AbortSignal): Promise<StatsPayload> {
  return withAbort(loadStats(), signal);
}

type LikeResult = {
  slug: string;
  likes: number;
  liked: boolean;
  counted: boolean;
};

const likedMarker = (slug: string) => `awesome-codex-pet:stats:liked:${slug}`;

export function hasLikedPet(slug: string) {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(likedMarker(slug)) === "1";
  } catch (error: unknown) {
    logStatsError("Unable to read anonymous like receipt", error);
    return false;
  }
}

export async function likePet(slug: string): Promise<LikeResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    STATS_WRITE_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `${STATS_WRITE_API}/track/like?slug=${encodeURIComponent(slug)}`,
      { method: "POST", signal: controller.signal },
    );
    if (!response.ok) {
      throw new Error(`Like API returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || payload.slug !== slug) {
      throw new Error("Like API returned an invalid payload");
    }

    const result = {
      slug,
      likes: asNonNegativeNumber(payload.likes),
      liked: payload.liked === true,
      counted: payload.counted === true,
    };
    if (!result.liked) {
      throw new Error("Like API did not confirm the like");
    }

    try {
      window.localStorage.setItem(likedMarker(slug), "1");
    } catch (error: unknown) {
      logStatsError("Unable to persist anonymous like receipt", error);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new StatsWriteTimeoutError({ cause: error });
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export type VoteResult = {
  kind: VoteKind;
  slug: string;
  week: string;
  votes: number;
  voted: boolean;
  counted: boolean;
  previousSlug: string | null;
  previousVotes: number | null;
};

const voteMarker = (periodId: string, kind: VoteKind) =>
  `awesome-codex-pet:stats:vote:${periodId}:${kind}`;

export function getWeeklyVote(periodId: string, kind: VoteKind) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(voteMarker(periodId, kind));
  } catch (error: unknown) {
    logStatsError("Unable to read anonymous weekly vote receipt", error);
    return null;
  }
}

export async function voteForTarget(
  kind: VoteKind,
  slug: string,
  periodId: string,
): Promise<VoteResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    STATS_WRITE_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `${STATS_WRITE_API}/track/vote?kind=${encodeURIComponent(kind)}&slug=${encodeURIComponent(slug)}`,
      { method: "POST", signal: controller.signal },
    );
    if (!response.ok) {
      throw new Error(`Vote API returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (
      !isRecord(payload) ||
      payload.kind !== kind ||
      payload.slug !== slug ||
      typeof payload.week !== "string"
    ) {
      throw new Error("Vote API returned an invalid payload");
    }

    const result: VoteResult = {
      kind,
      slug,
      week: payload.week,
      votes: asNonNegativeNumber(payload.votes),
      voted: payload.voted === true,
      counted: payload.counted === true,
      previousSlug:
        typeof payload.previousSlug === "string"
          ? payload.previousSlug
          : null,
      previousVotes:
        typeof payload.previousVotes === "number"
          ? asNonNegativeNumber(payload.previousVotes)
          : null,
    };
    if (!result.voted) {
      throw new Error("Vote API did not confirm the vote");
    }

    try {
      window.localStorage.setItem(
        voteMarker(periodId, kind),
        slug,
      );
      if (result.week !== periodId) {
        window.localStorage.setItem(voteMarker(result.week, kind), slug);
      }
    } catch (error: unknown) {
      logStatsError("Unable to persist anonymous weekly vote receipt", error);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new StatsWriteTimeoutError({ cause: error });
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
