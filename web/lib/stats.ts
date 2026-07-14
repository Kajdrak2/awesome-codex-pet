"use client";

export type PetStats = {
  views: number;
  installs: number;
  likes: number;
  views7d: number;
  installs7d: number;
  trendingScore: number;
  dailyRank: number;
  updatedAt: number;
};

export type StatsMap = Record<string, PetStats>;

export type StatsPayload = {
  pets: StatsMap;
  generatedAt: number;
  windowDays: number;
};

const STATS_API =
  process.env.NEXT_PUBLIC_STATS_API ??
  "https://awesome-codex-pet-stats.legeling.workers.dev";
const VISITOR_ID_KEY = "awesome-codex-pet:stats:visitor-id";

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
    throw new Error("Stats API returned an invalid payload");
  }

  const pets: StatsMap = {};
  for (const [slug, rawStats] of Object.entries(value.pets)) {
    if (!isRecord(rawStats)) continue;
    pets[slug] = {
      views: asNonNegativeNumber(rawStats.views),
      installs: asNonNegativeNumber(rawStats.installs),
      likes: asNonNegativeNumber(rawStats.likes),
      views7d: asNonNegativeNumber(rawStats.views7d),
      installs7d: asNonNegativeNumber(rawStats.installs7d),
      trendingScore: asNonNegativeNumber(rawStats.trendingScore),
      dailyRank: asNonNegativeNumber(rawStats.dailyRank),
      updatedAt: asNonNegativeNumber(rawStats.updatedAt),
    };
  }

  return {
    pets,
    generatedAt: asNonNegativeNumber(value.generatedAt),
    windowDays: asNonNegativeNumber(value.windowDays) || 7,
  };
}

function logStatsError(context: string, error: unknown) {
  console.warn(context, error instanceof Error ? error.stack : String(error));
}

function randomId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const created = randomId();
    window.localStorage.setItem(VISITOR_ID_KEY, created);
    return created;
  } catch (error) {
    logStatsError("Unable to persist anonymous stats visitor ID", error);
    return randomId();
  }
}

export async function fetchStats(signal?: AbortSignal): Promise<StatsPayload> {
  const response = await fetch(`${STATS_API}/stats`, { signal });
  if (!response.ok) {
    throw new Error(`Stats API returned HTTP ${response.status}`);
  }
  return normalizeStatsPayload(await response.json());
}

export function trackView(slug: string) {
  if (typeof window === "undefined") return;

  const day = new Date().toISOString().slice(0, 10);
  const markerKey = `awesome-codex-pet:stats:view:${day}:${slug}`;
  let eventId = randomId();

  try {
    if (window.localStorage.getItem(markerKey)) return;
    eventId = getVisitorId();
    window.localStorage.setItem(markerKey, "1");
  } catch (error) {
    logStatsError("Unable to persist anonymous view receipt", error);
  }

  void fetch(`${STATS_API}/track/view?slug=${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: { "X-Event-ID": eventId },
    keepalive: true,
  }).catch((error: unknown) => {
    logStatsError("Unable to report anonymous pet view", error);
  });
}

type LikeResult = {
  slug: string;
  likes: number;
  liked: boolean;
  counted: boolean;
};

const likedMarker = (slug: string) =>
  `awesome-codex-pet:stats:liked:${slug}`;

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
  const response = await fetch(
    `${STATS_API}/track/like?slug=${encodeURIComponent(slug)}`,
    { method: "POST" },
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
}
