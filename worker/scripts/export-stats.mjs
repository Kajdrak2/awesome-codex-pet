#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { serializeStatsRows } from "../src/index.js";

const workerRoot = fileURLToPath(new URL("..", import.meta.url));
const repoRoot = resolve(workerRoot, "..");
const defaultOutput = resolve(repoRoot, "web/public/stats.json");

function parseArgs(args) {
  const target = args.includes("--remote") ? "--remote" : "--local";
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : defaultOutput;
  if (!output) {
    throw new Error("--output requires a file path");
  }
  return { target, output: resolve(process.cwd(), output) };
}

function runQuery(target, sql) {
  const result = spawnSync(
    process.execPath,
    [
      resolve(workerRoot, "node_modules/wrangler/bin/wrangler.js"),
      "d1",
      "execute",
      "DB",
      target,
      "--command",
      sql,
      "--json",
    ],
    {
      cwd: workerRoot,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
      stdio: ["ignore", "pipe", "inherit"],
      timeout: 60_000,
    },
  );
  if (result.error) {
    throw new Error("Failed to run Wrangler D1 export", {
      cause: result.error,
    });
  }
  if (result.status !== 0) {
    throw new Error(`Wrangler exited with status ${result.status}`);
  }

  const batches = JSON.parse(result.stdout);
  if (!Array.isArray(batches) || batches.some((batch) => !batch?.success)) {
    throw new Error("D1 returned an invalid or unsuccessful export result");
  }
  return batches.flatMap((batch) =>
    Array.isArray(batch.results) ? batch.results : [],
  );
}

async function queryRows(target) {
  const cutoffDay = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const sql = `WITH recent AS (
    SELECT slug, SUM(installs) AS installs_7d
    FROM pet_daily
    WHERE day >= '${cutoffDay}'
    GROUP BY slug
  )
  SELECT
    stats.slug,
    stats.installs,
    stats.likes,
    stats.updated_at,
    COALESCE(recent.installs_7d, 0) AS installs_7d
  FROM pet_stats AS stats
  LEFT JOIN recent ON recent.slug = stats.slug
  WHERE stats.active = 1
  ORDER BY stats.slug ASC`;

  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return runQuery(target, sql);
    } catch (error) {
      lastError = error;
      if (attempt < 2) await delay(500 * 2 ** attempt);
    }
  }
  throw lastError;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rows = await queryRows(options.target);
  const payload = serializeStatsRows(rows);
  const temporaryOutput = `${options.output}.${process.pid}.tmp`;

  mkdirSync(dirname(options.output), { recursive: true });
  try {
    writeFileSync(temporaryOutput, `${JSON.stringify(payload, null, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
    renameSync(temporaryOutput, options.output);
  } finally {
    rmSync(temporaryOutput, { force: true });
  }

  console.log(
    `Exported ${rows.length} pet statistics to ${options.output} (${options.target.slice(2)}).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
