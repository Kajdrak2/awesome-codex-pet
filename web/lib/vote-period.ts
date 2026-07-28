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
