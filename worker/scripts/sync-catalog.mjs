#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workerRoot = fileURLToPath(new URL("..", import.meta.url));
const repoRoot = resolve(workerRoot, "..");
const catalogPath = resolve(repoRoot, "pets.json");
const collectionsPath = resolve(repoRoot, "collections.json");
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*--[a-z0-9]+(-[a-z0-9]+)*$/;
const collectionSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const minimumPublicCollectionPets = 3;

function parseArgs(args) {
  const target = args.includes("--remote") ? "--remote" : "--local";
  const skipLegacy = args.includes("--skip-legacy");
  const statsUrlIndex = args.indexOf("--stats-url");
  const statsUrl = statsUrlIndex >= 0 ? args[statsUrlIndex + 1] : null;
  const persistIndex = args.indexOf("--persist-to");
  const persistTo = persistIndex >= 0 ? args[persistIndex + 1] : null;
  if (statsUrlIndex >= 0 && !statsUrl) {
    throw new Error("--stats-url requires a URL");
  }
  if (persistIndex >= 0 && !persistTo) {
    throw new Error("--persist-to requires a directory");
  }
  return { target, skipLegacy, statsUrl, persistTo };
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function nonNegativeInteger(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : 0;
}

async function fetchLegacyStats(statsUrl) {
  const response = await fetch(statsUrl, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error(`Legacy stats request failed with HTTP ${response.status}`);
  }
  const payload = await response.json();
  return payload.pets && typeof payload.pets === "object" ? payload.pets : {};
}

function buildSyncSql(catalog, collections, legacyStats) {
  const seen = new Set();
  const values = catalog.map((pet) => {
    if (!pet || typeof pet.slug !== "string" || !slugPattern.test(pet.slug)) {
      throw new Error(
        `Invalid pet slug in catalog: ${JSON.stringify(pet?.slug)}`,
      );
    }
    if (seen.has(pet.slug)) {
      throw new Error(`Duplicate pet slug in catalog: ${pet.slug}`);
    }
    seen.add(pet.slug);

    const stats = legacyStats[pet.slug] || {};
    return `(${sqlString(pet.slug)}, 1, ${nonNegativeInteger(stats.views)}, ${nonNegativeInteger(stats.installs)}, ${nonNegativeInteger(stats.updatedAt)})`;
  });
  const collectionCounts = new Map();
  for (const pet of catalog) {
    for (const collectionSlug of pet.collections ?? []) {
      collectionCounts.set(
        collectionSlug,
        (collectionCounts.get(collectionSlug) ?? 0) + 1,
      );
    }
  }
  const collectionSlugs = new Set();
  const validCollections = [];
  for (const collection of collections) {
    if (
      !collection ||
      typeof collection.slug !== "string" ||
      !collectionSlugPattern.test(collection.slug)
    ) {
      throw new Error(
        `Invalid collection slug in catalog: ${JSON.stringify(collection?.slug)}`,
      );
    }
    if (collectionSlugs.has(collection.slug)) continue;
    collectionSlugs.add(collection.slug);
    validCollections.push(collection);
  }
  const publicCollections = validCollections.filter(
    (collection) =>
      (collectionCounts.get(collection.slug) ?? 0) >=
      minimumPublicCollectionPets,
  );
  const voteTargets = [
    ...catalog.map((pet) => `('pet', ${sqlString(pet.slug)}, 1)`),
    ...publicCollections.map(
      (collection) => `('collection', ${sqlString(collection.slug)}, 1)`,
    ),
  ];

  return `PRAGMA foreign_keys = ON;
UPDATE pet_stats SET active = 0;
INSERT INTO pet_stats (slug, active, views, installs, updated_at)
VALUES
  ${values.join(",\n  ")}
ON CONFLICT(slug) DO UPDATE SET
  active = 1,
  views = MAX(pet_stats.views, excluded.views),
  installs = MAX(pet_stats.installs, excluded.installs),
  updated_at = MAX(pet_stats.updated_at, excluded.updated_at);

UPDATE vote_targets SET active = 0;
INSERT INTO vote_targets (kind, slug, active)
VALUES
  ${voteTargets.join(",\n  ")}
ON CONFLICT(kind, slug) DO UPDATE SET
  active = 1;
`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error("pets.json must contain a non-empty array");
  }
  const collections = JSON.parse(readFileSync(collectionsPath, "utf8"));
  if (!Array.isArray(collections)) {
    throw new Error("collections.json must contain an array");
  }

  const legacyStats =
    options.statsUrl && !options.skipLegacy
      ? await fetchLegacyStats(options.statsUrl)
      : {};
  const sql = buildSyncSql(catalog, collections, legacyStats);
  const tempPath = resolve(
    tmpdir(),
    `awesome-codex-pet-stats-${process.pid}.sql`,
  );
  writeFileSync(tempPath, sql, { encoding: "utf8", mode: 0o600 });

  try {
    const result = spawnSync(
      process.execPath,
      [
        resolve(workerRoot, "node_modules/wrangler/bin/wrangler.js"),
        "d1",
        "execute",
        "DB",
        options.target,
        ...(options.persistTo
          ? ["--persist-to", resolve(options.persistTo)]
          : []),
        "--file",
        tempPath,
      ],
      { cwd: workerRoot, stdio: "inherit", timeout: 60_000 },
    );
    if (result.error) {
      throw new Error("Failed to start Wrangler", { cause: result.error });
    }
    if (result.status !== 0) {
      throw new Error(`Wrangler exited with status ${result.status}`);
    }
  } finally {
    rmSync(tempPath, { force: true });
  }

  console.log(
    `Synced ${catalog.length} pets and vote targets to D1 (${options.target.slice(2)}).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
