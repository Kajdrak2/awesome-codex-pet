import assert from "node:assert/strict";
import test from "node:test";

import worker, {
  buildInstallKeys,
  buildLikeKey,
  buildCreatorFollowKey,
  buildCreatorFollowRateKey,
  buildRequestSupportKey,
  buildRequestSupportRateKey,
  computeTrendingScore,
  isOriginAllowed,
  normalizeManualRequest,
  serializeStatsRows,
  verifyTurnstile,
} from "../src/index.js";
import { buildIssueBody } from "../scripts/sync-manual-requests.mjs";

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

test("removed public read, view, and vote routes stay disabled", async () => {
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
  const vote = await worker.fetch(
    new Request(
      "https://api.example/track/vote?kind=pet&slug=firefly--lingxiaotian",
      {
        method: "POST",
        headers: { Origin: "https://codexpet.top" },
      },
    ),
    routeEnv,
  );

  assert.equal(stats.status, 404);
  assert.equal(view.status, 404);
  assert.equal(vote.status, 404);
});

test("public config exposes only the Turnstile site key", async () => {
  const routeEnv = {
    ...env,
    DB: {
      prepare(sql) {
        assert.match(sql, /turnstile_site_key/);
        return { first: async () => ({ config_value: "public-site-key" }) };
      },
    },
  };
  const response = await worker.fetch(
    new Request("https://api.example/config/public", {
      headers: { Origin: "https://codexpet.top" },
    }),
    routeEnv,
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    turnstileSiteKey: "public-site-key",
  });
  assert.equal(
    response.headers.get("Access-Control-Allow-Origin"),
    "https://codexpet.top",
  );
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

test("creator follow keys are scoped by IP and creator", async () => {
  const firstRequest = new Request(
    "https://stats.example/track/creator-follow",
    {
      headers: { "CF-Connecting-IP": "203.0.113.4" },
    },
  );
  const sameIpRequest = new Request(
    "https://stats.example/track/creator-follow",
    {
      headers: {
        "CF-Connecting-IP": "203.0.113.4",
        "User-Agent": "another browser",
      },
    },
  );
  const otherIpRequest = new Request(
    "https://stats.example/track/creator-follow",
    { headers: { "CF-Connecting-IP": "203.0.113.5" } },
  );

  const first = await buildCreatorFollowKey(firstRequest, env, "lingxiaotian");
  const sameIp = await buildCreatorFollowKey(
    sameIpRequest,
    env,
    "lingxiaotian",
  );
  const otherIp = await buildCreatorFollowKey(
    otherIpRequest,
    env,
    "lingxiaotian",
  );
  const otherCreator = await buildCreatorFollowKey(
    firstRequest,
    env,
    "chenxin-dlut",
  );
  const firstRate = await buildCreatorFollowRateKey(
    firstRequest,
    env,
    Date.UTC(2026, 6, 13, 1),
  );
  const sameRate = await buildCreatorFollowRateKey(
    sameIpRequest,
    env,
    Date.UTC(2026, 6, 13, 1, 59),
  );
  const nextHourRate = await buildCreatorFollowRateKey(
    firstRequest,
    env,
    Date.UTC(2026, 6, 13, 2),
  );

  assert.equal(first, sameIp);
  assert.notEqual(first, otherIp);
  assert.notEqual(first, otherCreator);
  assert.equal(firstRate.key, sameRate.key);
  assert.notEqual(firstRate.key, nextHourRate.key);
});

test("request support keys are scoped by IP and issue", async () => {
  const firstRequest = new Request(
    "https://stats.example/track/request-support",
    { headers: { "CF-Connecting-IP": "203.0.113.4" } },
  );
  const sameIpRequest = new Request(
    "https://stats.example/track/request-support",
    {
      headers: {
        "CF-Connecting-IP": "203.0.113.4",
        "User-Agent": "another browser",
      },
    },
  );
  const otherIpRequest = new Request(
    "https://stats.example/track/request-support",
    { headers: { "CF-Connecting-IP": "203.0.113.5" } },
  );

  const first = await buildRequestSupportKey(firstRequest, env, 77);
  const sameIp = await buildRequestSupportKey(sameIpRequest, env, 77);
  const otherIp = await buildRequestSupportKey(otherIpRequest, env, 77);
  const otherIssue = await buildRequestSupportKey(firstRequest, env, 69);
  const firstRate = await buildRequestSupportRateKey(
    firstRequest,
    env,
    Date.UTC(2026, 6, 29, 1),
  );
  const nextHourRate = await buildRequestSupportRateKey(
    firstRequest,
    env,
    Date.UTC(2026, 6, 29, 2),
  );

  assert.equal(first, sameIp);
  assert.notEqual(first, otherIp);
  assert.notEqual(first, otherIssue);
  assert.notEqual(firstRate.key, nextHourRate.key);
});

test("stats serialization exposes recent likes and creator fields", () => {
  const payload = serializeStatsRows(
    [
      {
        slug: "firefly--lingxiaotian",
        installs: 10,
        likes: 7,
        installs_7d: 3,
        likes_7d: 5,
        updated_at: 42,
      },
    ],
    Date.UTC(2026, 6, 14),
    [{ slug: "lingxiaotian", followers: 12 }],
    [{ issue_number: 77, supporters: 4, updated_at: 43 }],
  );

  assert.equal(payload.windowDays, 7);
  assert.equal(payload.pets["firefly--lingxiaotian"].installs7d, 3);
  assert.equal(payload.pets["firefly--lingxiaotian"].likes, 7);
  assert.equal(payload.pets["firefly--lingxiaotian"].likes7d, 5);
  assert.equal(
    payload.pets["firefly--lingxiaotian"].trendingScore,
    computeTrendingScore(3, 5),
  );
  assert.equal(payload.creators.lingxiaotian.followers, 12);
  assert.deepEqual(payload.requests["77"], {
    supporters: 4,
    updatedAt: 43,
  });
  assert.ok(payload.pets["firefly--lingxiaotian"].dailyRank >= 0);
});

test("trending score combines recent installs and likes", () => {
  assert.ok(computeTrendingScore(5) > computeTrendingScore(1));
  assert.ok(computeTrendingScore(1, 5) > computeTrendingScore(1, 1));
  assert.equal(computeTrendingScore(-1), 0);
  assert.equal(computeTrendingScore(Number.NaN), 0);
});

test("manual requests default to v2-compatible minimal fields", () => {
  assert.deepEqual(
    normalizeManualRequest({
      character: "  Misaka Mikoto  ",
      franchise: "A Certain Scientific Railgun",
      referenceUrl: "https://example.com/mikoto",
      notes: "Pixel-art chibi",
      locale: "zh",
      turnstileToken: "token",
    }),
    {
      character: "Misaka Mikoto",
      franchise: "A Certain Scientific Railgun",
      referenceUrl: "https://example.com/mikoto",
      notes: "Pixel-art chibi",
      locale: "zh",
      turnstileToken: "token",
    },
  );
  assert.throws(
    () => normalizeManualRequest({ character: "x" }),
    /character or concept is required/,
  );
  assert.throws(
    () => normalizeManualRequest({ character: "Mikoto" }),
    /reference image URL is required/,
  );
  assert.throws(
    () =>
      normalizeManualRequest({
        character: "Mikoto",
        referenceUrl: "file:///tmp/reference.png",
      }),
    /public HTTP URL/,
  );
  const sanitized = normalizeManualRequest({
    character: "Pet\n<!-- pet-flow: submission -->Name",
    referenceUrl: "https://example.com/reference.png",
    notes: "### Injected heading\nKeep this preference",
  });
  assert.equal(sanitized.character, "Pet Name");
  assert.equal(sanitized.notes, "\\### Injected heading\nKeep this preference");
});

test("Turnstile validation checks success and hostname", async () => {
  const request = new Request("https://api.example/requests/manual", {
    headers: { "CF-Connecting-IP": "203.0.113.4" },
  });
  const turnstileEnv = {
    TURNSTILE_SECRET_KEY: "test-secret",
    TURNSTILE_ALLOWED_HOSTNAMES: "codexpet.top",
  };
  let verificationBody;
  await verifyTurnstile(request, turnstileEnv, "valid-token", async (_url, init) => {
    verificationBody = JSON.parse(init.body);
    return Response.json({ success: true, hostname: "codexpet.top" });
  });
  assert.equal(verificationBody.secret, "test-secret");
  assert.equal(verificationBody.response, "valid-token");
  assert.equal(verificationBody.remoteip, "203.0.113.4");

  await assert.rejects(
    verifyTurnstile(request, turnstileEnv, "bad-token", async () =>
      Response.json({ success: false, hostname: "codexpet.top" }),
    ),
    /human verification failed/,
  );
});

test("manual request issue bodies preserve the simple form and V2 default", () => {
  const body = buildIssueBody({
    id: 42,
    character: "Misaka Mikoto",
    franchise: "A Certain Scientific Railgun",
    reference_url: "https://example.com/mikoto",
    notes: "Pixel-art chibi",
  });
  assert.match(body, /manual-request-id: 42/);
  assert.match(body, /### Character or concept\n\nMisaka Mikoto/);
  assert.match(body, /### Reference image\n\nhttps:\/\/example.com\/mikoto/);
  assert.match(body, /v2 - standard animations plus 16 look directions/);
  assert.match(body, /Submitted without a GitHub account/);
});
