import assert from "node:assert/strict";
import test from "node:test";

import worker, {
  buildInstallKeys,
  buildLikeKey,
  buildVoteKey,
  buildVoteRateKey,
  computeTrendingScore,
  isOriginAllowed,
  serializeStatsRows,
  utcWeekStart,
} from "../src/index.js";

const env = {
  ALLOWED_ORIGINS: "https://codexpet.top,http://localhost:3000",
  HASH_SALT: "test-only-hash-salt-value",
};

test("origin checks allow scripts and configured browser origins", () => {
  assert.equal(
    isOriginAllowed(new Request("https://stats.example/stats"), env),
    true,
  );
  assert.equal(
    isOriginAllowed(
      new Request("https://stats.example/stats", {
        headers: { Origin: "https://codexpet.top" },
      }),
      env,
    ),
    true,
  );
  assert.equal(
    isOriginAllowed(
      new Request("https://stats.example/stats", {
        headers: { Origin: "https://example.invalid" },
      }),
      env,
    ),
    false,
  );
});

test("high-volume public read and view routes stay disabled", async () => {
  const routeEnv = { ...env, DB: {} };
  const stats = await worker.fetch(
    new Request("https://api.example/stats"),
    routeEnv,
  );
  const view = await worker.fetch(
    new Request("https://api.example/track/view?slug=firefly--lingxiaotian", {
      method: "POST",
      headers: { Origin: "https://codexpet.top" },
    }),
    routeEnv,
  );

  assert.equal(stats.status, 404);
  assert.equal(view.status, 404);
});

test("install receipt IDs are idempotent", async () => {
  const request = new Request(
    "https://stats.example/track/install?slug=firefly--lingxiaotian",
    {
      method: "POST",
      headers: {
        "CF-Connecting-IP": "203.0.113.4",
        "X-Event-ID": "install.12345678",
      },
    },
  );
  const first = await buildInstallKeys(
    request,
    env,
    "firefly--lingxiaotian",
    Date.UTC(2026, 6, 14, 1),
  );
  const later = await buildInstallKeys(
    request,
    env,
    "firefly--lingxiaotian",
    Date.UTC(2026, 6, 15, 1),
  );

  assert.equal(first.eventKey, later.eventKey);
});

test("like keys allow one like per IP and pet", async () => {
  const firstRequest = new Request("https://stats.example/track/like", {
    headers: { "CF-Connecting-IP": "203.0.113.4" },
  });
  const sameIpRequest = new Request("https://stats.example/track/like", {
    headers: {
      "CF-Connecting-IP": "203.0.113.4",
      "User-Agent": "another browser",
    },
  });
  const otherIpRequest = new Request("https://stats.example/track/like", {
    headers: { "CF-Connecting-IP": "203.0.113.5" },
  });

  const first = await buildLikeKey(firstRequest, env, "firefly--lingxiaotian");
  const sameIp = await buildLikeKey(
    sameIpRequest,
    env,
    "firefly--lingxiaotian",
  );
  const otherIp = await buildLikeKey(
    otherIpRequest,
    env,
    "firefly--lingxiaotian",
  );
  const otherPet = await buildLikeKey(
    firstRequest,
    env,
    "acheron--lingxiaotian",
  );

  assert.equal(first, sameIp);
  assert.notEqual(first, otherIp);
  assert.notEqual(first, otherPet);
});

test("weekly vote keys allow one ballot per IP, kind, and week", async () => {
  const firstRequest = new Request("https://stats.example/track/vote", {
    headers: { "CF-Connecting-IP": "203.0.113.4" },
  });
  const sameIpRequest = new Request("https://stats.example/track/vote", {
    headers: {
      "CF-Connecting-IP": "203.0.113.4",
      "User-Agent": "another browser",
    },
  });
  const otherIpRequest = new Request("https://stats.example/track/vote", {
    headers: { "CF-Connecting-IP": "203.0.113.5" },
  });
  const week = "2026-07-13";

  const first = await buildVoteKey(firstRequest, env, "pet", week);
  const sameBallot = await buildVoteKey(sameIpRequest, env, "pet", week);
  const collectionBallot = await buildVoteKey(
    firstRequest,
    env,
    "collection",
    week,
  );
  const nextWeek = await buildVoteKey(firstRequest, env, "pet", "2026-07-20");
  const otherIp = await buildVoteKey(otherIpRequest, env, "pet", week);
  const firstRate = await buildVoteRateKey(
    firstRequest,
    env,
    "pet",
    Date.UTC(2026, 6, 13, 1),
  );
  const sameRate = await buildVoteRateKey(
    sameIpRequest,
    env,
    "pet",
    Date.UTC(2026, 6, 13, 1, 59),
  );
  const otherIpRate = await buildVoteRateKey(
    otherIpRequest,
    env,
    "pet",
    Date.UTC(2026, 6, 13, 1),
  );
  const collectionRate = await buildVoteRateKey(
    firstRequest,
    env,
    "collection",
    Date.UTC(2026, 6, 13, 1),
  );
  const nextHourRate = await buildVoteRateKey(
    firstRequest,
    env,
    "pet",
    Date.UTC(2026, 6, 13, 2),
  );

  assert.equal(first, sameBallot);
  assert.notEqual(first, otherIp);
  assert.notEqual(first, collectionBallot);
  assert.notEqual(first, nextWeek);
  assert.equal(firstRate.key, sameRate.key);
  assert.notEqual(firstRate.key, otherIpRate.key);
  assert.notEqual(firstRate.key, collectionRate.key);
  assert.notEqual(firstRate.key, nextHourRate.key);
});

test("UTC vote periods start on Monday", () => {
  assert.equal(utcWeekStart(Date.UTC(2026, 6, 13, 0)), "2026-07-13");
  assert.equal(utcWeekStart(Date.UTC(2026, 6, 19, 23, 59)), "2026-07-13");
  assert.equal(utcWeekStart(Date.UTC(2026, 6, 20, 0)), "2026-07-20");
});

test("stats serialization exposes trend, vote, and collection fields", () => {
  const payload = serializeStatsRows(
    [
      {
        slug: "firefly--lingxiaotian",
        installs: 10,
        likes: 7,
        installs_7d: 3,
        weekly_votes: 5,
        updated_at: 42,
      },
    ],
    Date.UTC(2026, 6, 14),
    [{ slug: "animal-companions", weekly_votes: 4 }],
  );

  assert.equal(payload.windowDays, 7);
  assert.equal(payload.pets["firefly--lingxiaotian"].installs7d, 3);
  assert.equal(payload.pets["firefly--lingxiaotian"].likes, 7);
  assert.equal(payload.pets["firefly--lingxiaotian"].weeklyVotes, 5);
  assert.equal(
    payload.pets["firefly--lingxiaotian"].trendingScore,
    computeTrendingScore(3, 5),
  );
  assert.equal(payload.collections["animal-companions"].weeklyVotes, 4);
  assert.equal(payload.votePeriod.id, "2026-07-13");
  assert.ok(payload.pets["firefly--lingxiaotian"].dailyRank >= 0);
});

test("trending score combines recent installs and weekly votes", () => {
  assert.ok(computeTrendingScore(5) > computeTrendingScore(1));
  assert.ok(computeTrendingScore(1, 5) > computeTrendingScore(1, 1));
  assert.equal(computeTrendingScore(-1), 0);
  assert.equal(computeTrendingScore(Number.NaN), 0);
});
