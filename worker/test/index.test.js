import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMetricKeys,
  buildLikeKey,
  computeTrendingScore,
  isOriginAllowed,
  serializeStatsRows,
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

test("view receipts remain stable within one UTC day", async () => {
  const request = new Request(
    "https://stats.example/track/view?slug=firefly--lingxiaotian",
    {
      method: "POST",
      headers: {
        "CF-Connecting-IP": "203.0.113.4",
        "X-Event-ID": "visitor.12345678",
      },
    },
  );
  const first = await buildMetricKeys(
    request,
    env,
    "firefly--lingxiaotian",
    "view",
    Date.UTC(2026, 6, 14, 1),
  );
  const second = await buildMetricKeys(
    request,
    env,
    "firefly--lingxiaotian",
    "view",
    Date.UTC(2026, 6, 14, 23),
  );
  const nextDay = await buildMetricKeys(
    request,
    env,
    "firefly--lingxiaotian",
    "view",
    Date.UTC(2026, 6, 15, 1),
  );

  assert.equal(first.eventKey, second.eventKey);
  assert.notEqual(first.eventKey, nextDay.eventKey);
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
  const first = await buildMetricKeys(
    request,
    env,
    "firefly--lingxiaotian",
    "install",
    Date.UTC(2026, 6, 14, 1),
  );
  const later = await buildMetricKeys(
    request,
    env,
    "firefly--lingxiaotian",
    "install",
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

  const first = await buildLikeKey(
    firstRequest,
    env,
    "firefly--lingxiaotian",
  );
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

test("stats serialization exposes seven-day trend fields", () => {
  const payload = serializeStatsRows(
    [
      {
        slug: "firefly--lingxiaotian",
        views: 20,
        installs: 10,
        likes: 7,
        views_7d: 5,
        installs_7d: 3,
        updated_at: 42,
      },
    ],
    Date.UTC(2026, 6, 14),
  );

  assert.equal(payload.windowDays, 7);
  assert.equal(payload.pets["firefly--lingxiaotian"].views, 20);
  assert.equal(payload.pets["firefly--lingxiaotian"].installs7d, 3);
  assert.equal(payload.pets["firefly--lingxiaotian"].likes, 7);
  assert.equal(
    payload.pets["firefly--lingxiaotian"].trendingScore,
    computeTrendingScore(3, 5),
  );
  assert.ok(payload.pets["firefly--lingxiaotian"].dailyRank >= 0);
});

test("trending score favors installs over equal view volume", () => {
  assert.ok(computeTrendingScore(5, 0) > computeTrendingScore(0, 5));
  assert.equal(computeTrendingScore(-1, Number.NaN), 0);
  assert.equal(computeTrendingScore(0, 2), 0);
  assert.ok(computeTrendingScore(0, 3) > 0);
});
