#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workerRoot = fileURLToPath(new URL("..", import.meta.url));
const repoRoot = resolve(workerRoot, "..");
const catalogPath = resolve(repoRoot, "pets.json");
const defaultStatsUrl =
  "https://awesome-codex-pet-stats.legeling.workers.dev/stats";
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*--[a-z0-9]+(-[a-z0-9]+)*$/;

function parseArgs(args) {
  const target = args.includes("--remote") ? "--remote" : "--local";
  const skipLegacy = args.includes("--skip-legacy");
  const statsUrlIndex = args.indexOf("--stats-url");
  const statsUrl =
    statsUrlIndex >= 0 ? args[statsUrlIndex + 1] : defaultStatsUrl;
  if (statsUrlIndex >= 0 && !statsUrl) {
    throw new Error("--stats-url requires a URL");
  }
  return { target, skipLegacy, statsUrl };
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

function buildSyncSql(catalog, legacyStats) {
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
`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error("pets.json must contain a non-empty array");
  }

  const legacyStats = options.skipLegacy
    ? {}
    : await fetchLegacyStats(options.statsUrl);
  const sql = buildSyncSql(catalog, legacyStats);
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
        "--file",
        tempPath,
      ],
      { cwd: workerRoot, stdio: "inherit" },
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
    `Synced ${catalog.length} catalog pets to D1 (${options.target.slice(2)}).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
