import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const petsDir = join(repoRoot, "pets");
const requireGeneratedAssets = process.argv.includes("--require-generated-assets");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*--[a-z0-9]+(?:-[a-z0-9]+)*$/;
const previewStates = ["idle", "waving", "running", "jumping", "review"];
const v2PreviewStates = ["look-000-157", "look-180-337"];
const maxSpritesheetBytesForPr = 5_000_000;
const spriteContracts = new Map([
  [1, { width: 1536, height: 1872 }],
  [2, { width: 1536, height: 2288 }],
]);
const requiredGeneratedPaths = [
  join(repoRoot, "README.md"),
  join(repoRoot, "docs", "zh-CN", "README.md"),
  join(repoRoot, "pets.json"),
];
const errors = [];

function gitChangedPaths() {
  try {
    if (process.env.GITHUB_BASE_REF) {
      const output = execSync(
        `git diff --name-only --diff-filter=AMR origin/${process.env.GITHUB_BASE_REF}...HEAD`,
        { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      );
      return new Set(output.split(/\r?\n/).filter(Boolean));
    }

    const tracked = execSync("git diff --name-only --diff-filter=AMR HEAD", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const untracked = execSync("git ls-files --others --exclude-standard", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return new Set(`${tracked}\n${untracked}`.split(/\r?\n/).filter(Boolean));
  } catch {
    return new Set();
  }
}

const changedPaths = requireGeneratedAssets ? new Set() : gitChangedPaths();

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
    return null;
  }
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function readWebpDimensions(path) {
  const buffer = readFileSync(path);
  if (
    buffer.length < 20 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error("spritesheet.webp is not a valid WebP container");
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    const dataEnd = dataOffset + chunkSize;
    if (dataEnd > buffer.length) {
      throw new Error(`invalid ${chunkType} chunk length`);
    }

    if (chunkType === "VP8X" && chunkSize >= 10) {
      return {
        width: readUInt24LE(buffer, dataOffset + 4) + 1,
        height: readUInt24LE(buffer, dataOffset + 7) + 1,
      };
    }

    if (chunkType === "VP8L" && chunkSize >= 5 && buffer[dataOffset] === 0x2f) {
      const b1 = buffer[dataOffset + 1];
      const b2 = buffer[dataOffset + 2];
      const b3 = buffer[dataOffset + 3];
      const b4 = buffer[dataOffset + 4];
      return {
        width: 1 + b1 + ((b2 & 0x3f) << 8),
        height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
      };
    }

    if (
      chunkType === "VP8 " &&
      chunkSize >= 10 &&
      buffer[dataOffset + 3] === 0x9d &&
      buffer[dataOffset + 4] === 0x01 &&
      buffer[dataOffset + 5] === 0x2a
    ) {
      return {
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
      };
    }

    offset = dataEnd + (chunkSize % 2);
  }

  throw new Error("spritesheet.webp has no supported VP8 image chunk");
}

for (const entry of readdirSync(petsDir)) {
  if (entry.startsWith(".")) continue;

  const petDir = join(petsDir, entry);
  if (!statSync(petDir).isDirectory()) continue;

  if (!slugPattern.test(entry)) {
    errors.push(`${entry}: folder name must use <pet-slug>--<author-slug>`);
  }

  const submissionPath = join(petDir, "submission.json");
  const petJsonPath = join(petDir, "pet.json");
  const spritesheetPath = join(petDir, "spritesheet.webp");
  const allowedEntries = new Set(["submission.json", "pet.json", "spritesheet.webp"]);
  const localOnlyEntries = new Set(["qa"]);

  for (const child of readdirSync(petDir)) {
    if (child.startsWith(".")) continue;
    if (localOnlyEntries.has(child)) continue;
    if (!allowedEntries.has(child)) {
      errors.push(`${entry}: unexpected pet package file ${child}`);
    }
  }

  for (const requiredPath of [submissionPath, petJsonPath, spritesheetPath]) {
    if (!existsSync(requiredPath)) {
      errors.push(`${entry}: missing ${requiredPath.replace(`${petDir}/`, "")}`);
    }
  }

  if (existsSync(spritesheetPath) && !requireGeneratedAssets && changedPaths.has(`pets/${entry}/spritesheet.webp`)) {
    const spritesheetSize = statSync(spritesheetPath).size;
    if (spritesheetSize > maxSpritesheetBytesForPr) {
      errors.push(
        `${entry}: spritesheet.webp is ${spritesheetSize} bytes, exceeds PR budget of ${maxSpritesheetBytesForPr} bytes`,
      );
    }
  }

  const submission = existsSync(submissionPath) ? readJson(submissionPath) : null;
  const pet = existsSync(petJsonPath) ? readJson(petJsonPath) : null;

  if (submission) {
    if (submission.slug !== entry) {
      errors.push(`${entry}: submission.json slug must match folder name`);
    }

    for (const key of ["pet_slug", "author_slug", "name", "author", "primary_category", "license"]) {
      if (!submission[key]) {
        errors.push(`${entry}: submission.json missing ${key}`);
      }
    }
  }

  if (pet) {
    if (pet.id !== entry) {
      errors.push(`${entry}: pet.json id must match folder name`);
    }

    if (pet.spritesheetPath !== "spritesheet.webp") {
      errors.push(`${entry}: pet.json spritesheetPath should be spritesheet.webp`);
    }

    const spriteVersionNumber = pet.spriteVersionNumber ?? 1;
    const contract = spriteContracts.get(spriteVersionNumber);
    if (!contract) {
      errors.push(`${entry}: pet.json spriteVersionNumber must be 1, 2, or omitted for v1`);
    } else if (existsSync(spritesheetPath)) {
      try {
        const dimensions = readWebpDimensions(spritesheetPath);
        if (dimensions.width !== contract.width || dimensions.height !== contract.height) {
          errors.push(
            `${entry}: v${spriteVersionNumber} spritesheet.webp must be ${contract.width}x${contract.height}, got ${dimensions.width}x${dimensions.height}`,
          );
        }
      } catch (error) {
        errors.push(`${entry}: ${error.message}`);
      }
    }
  }
}

for (const generatedPath of requiredGeneratedPaths) {
  if (!existsSync(generatedPath)) {
    errors.push(`missing generated repository file ${generatedPath.replace(`${repoRoot}/`, "")}`);
  }
}

if (requireGeneratedAssets) {
  for (const entry of readdirSync(petsDir)) {
    if (entry.startsWith(".")) continue;

    const petDir = join(petsDir, entry);
    if (!statSync(petDir).isDirectory()) continue;

    const pet = readJson(join(petDir, "pet.json"));
    const requiredPreviewStates = [
      ...previewStates,
      ...(pet?.spriteVersionNumber === 2 ? v2PreviewStates : []),
    ];

    for (const state of requiredPreviewStates) {
      const previewPath = join(repoRoot, "assets", "previews", entry, "gifs", `${state}.gif`);
      if (!existsSync(previewPath)) {
        errors.push(`${entry}: missing generated preview ${previewPath.replace(`${repoRoot}/`, "")}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("All pet folders are valid.");
