export type VotePeriod = {
  id: string;
  startsAt: number;
  endsAt: number;
};

export function getUtcVotePeriod(timestamp: number): VotePeriod {
  const date = new Date(timestamp);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  date.setUTCHours(0, 0, 0, 0);
  const startsAt = date.getTime();
  return {
    id: date.toISOString().slice(0, 10),
    startsAt,
    endsAt: startsAt + 7 * 24 * 60 * 60 * 1000,
  };
}

export function normalizeVotePeriod(
  value: unknown,
  fallbackTimestamp: number,
): VotePeriod {
  const fallback = getUtcVotePeriod(fallbackTimestamp);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }

  const period = value as Record<string, unknown>;
  const id = typeof period.id === "string" ? period.id : "";
  const startsAt =
    typeof period.startsAt === "number" &&
    Number.isFinite(period.startsAt) &&
    period.startsAt >= 0
      ? period.startsAt
      : -1;
  const endsAt =
    typeof period.endsAt === "number" &&
    Number.isFinite(period.endsAt) &&
    period.endsAt >= 0
      ? period.endsAt
      : -1;
  const expected = startsAt >= 0 ? getUtcVotePeriod(startsAt) : null;
  if (
    expected &&
    id === expected.id &&
    startsAt === expected.startsAt &&
    endsAt === expected.endsAt
  ) {
    return { id, startsAt, endsAt };
  }
  return fallback;
}
