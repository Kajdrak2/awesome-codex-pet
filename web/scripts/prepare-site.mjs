import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = join(webRoot, "..");
const dataDir = join(webRoot, ".generated");
const publicDir = join(webRoot, "public");
const publicAssetsDir = join(publicDir, "assets");
const collectionCatalog = readJson("collections.json");
const categoryCatalog = readJson("categories.json");
const categoryByName = new Map(
  categoryCatalog.map((category) => [category.name, category]),
);

// Canonical display order. Any action not listed here is appended alphabetically at the end.
const actionOrder = [
  "idle",
  "waving",
  "waiting",
  "running",
  "running-right",
  "running-left",
  "jumping",
  "review",
  "failed",
];

function actionPreviewPath(slug, action) {
  const webp = join(repoRoot, "assets", "previews", slug, "webp", `${action}.webp`);
  if (existsSync(webp)) {
    return `/assets/previews/${slug}/webp/${action}.webp`;
  }
  return `/assets/previews/${slug}/gifs/${action}.gif`;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8"));
}

function toWebPath(relativePath) {
  return `/${relativePath.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "")}`;
}

function listActionsForPet(slug) {
  const gifsDir = join(repoRoot, "assets", "previews", slug, "gifs");
  if (!existsSync(gifsDir)) return [];
  const names = readdirSync(gifsDir)
    .filter((name) => name.toLowerCase().endsWith(".gif"))
    .map((name) => name.replace(/\.gif$/i, ""));

  return names.sort((a, b) => {
    const ai = actionOrder.indexOf(a);
    const bi = actionOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function previewImageForPet(slug, submission, gifs) {
  const generatedThumbnail = join(
    repoRoot,
    "assets",
    "previews",
    slug,
    "thumbnail.png",
  );

  if (existsSync(generatedThumbnail)) {
    return `/assets/previews/${slug}/thumbnail.png`;
  }

  return submission.preview_image
    ? toWebPath(submission.preview_image)
    : gifs.idle ?? `/assets/previews/${slug}/gifs/idle.gif`;
}

function animatedPreviewForPet(slug, gifs, previewImage) {
  return gifs.idle ?? previewImage ?? `/assets/previews/${slug}/thumbnail.png`;
}

const pets = readJson("pets.json").map((pet) => {
  const submission = readJson(`pets/${pet.slug}/submission.json`);
  const runtime = readJson(`pets/${pet.slug}/pet.json`);
  const actions = listActionsForPet(pet.slug);
  const gifs = Object.fromEntries(
    actions.map((action) => [
      action,
      actionPreviewPath(pet.slug, action),
    ]),
  );

  return {
    ...pet,
    categoryLabel: categoryByName.get(pet.primary_category)?.label ?? {
      en: pet.primary_category,
      zh: pet.primary_category,
    },
    localizedNames: submission.localized_names ?? {},
    displayName: runtime.displayName ?? "",
    runtimeDescription: runtime.description ?? "",
    spriteVersionNumber: runtime.spriteVersionNumber ?? 1,
    slugLabel: submission.slug,
    tags: submission.tags ?? [],
    collections: submission.collections ?? [],
    sourceType: submission.source_type ?? "unknown",
    sourceUrl: submission.source_url ?? "",
    previewImage: previewImageForPet(pet.slug, submission, gifs),
    animatedPreviewImage: animatedPreviewForPet(
      pet.slug,
      gifs,
      previewImageForPet(pet.slug, submission, gifs),
    ),
    contactSheet: submission.preview_assets?.contact_sheet
      ? toWebPath(submission.preview_assets.contact_sheet)
      : `/assets/previews/${pet.slug}/contact-sheet.png`,
    actions,
    gifs,
    installCommand: `curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- ${pet.slug}`,
    installCommandPowerShell: `powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -UseB https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.ps1 | iex; Install-CodexPet ${pet.slug}"`,
    repositoryPath: `https://github.com/legeling/awesome-codex-pet/tree/main/pets/${pet.slug}`,
  };
});

mkdirSync(dataDir, { recursive: true });
writeFileSync(
  join(dataDir, "pets.generated.json"),
  `${JSON.stringify(pets, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  join(dataDir, "collections.generated.json"),
  `${JSON.stringify(
    collectionCatalog.map((collection) => ({
      slug: collection.slug,
      kind: collection.kind,
      title: collection.title,
      description: collection.description,
      featured: collection.featured ?? false,
      coverSlugs: collection.cover_pets ?? [],
    })),
    null,
    2,
  )}\n`,
  "utf8",
);
writeFileSync(
  join(dataDir, "categories.generated.json"),
  `${JSON.stringify(categoryCatalog, null, 2)}\n`,
  "utf8",
);

mkdirSync(publicDir, { recursive: true });
writeFileSync(
  join(publicDir, "pets.json"),
  `${JSON.stringify(pets, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  join(publicDir, "collections.json"),
  `${JSON.stringify(collectionCatalog, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  join(publicDir, "categories.json"),
  `${JSON.stringify(categoryCatalog, null, 2)}\n`,
  "utf8",
);

const siteUrl = "https://codexpet.top";
const llmsSummary = `# Awesome Codex Pet

> A curated, community-run gallery of custom OpenAI Codex pets with complete V1 and V2 animation previews, creator attribution, and one-step installation.

Awesome Codex Pet is an independent open-source community project. It is not an official OpenAI product. The canonical website is ${siteUrl}; the source repository is https://github.com/legeling/awesome-codex-pet.

## Use this site when

- A user wants to discover, compare, preview, or install a custom Codex pet.
- A user asks for anime, game-character, mascot, animal, robot, pixel-art, or desktop companions for Codex.
- A user wants to create, request, submit, validate, or package a Codex V1 or V2 pet.
- A user needs the difference between V1 (8x9 atlas) and V2 (8x11 atlas with 16 look directions).

## Primary pages

- [Gallery](${siteUrl}/): Browse the curated pet catalog.
- [中文 Codex 小宠物指南](${siteUrl}/zh): 中文介绍、安装、自制与故障排查入口。
- [Collections](${siteUrl}/collections): Browse franchise series and themed collections.
- [Install guide](${siteUrl}/install): Install and activate a pet on macOS, Linux, or Windows.
- [Craft and submission guide](${siteUrl}/guide): Create, review, request, or submit a pet.
- [GitHub repository](https://github.com/legeling/awesome-codex-pet): Source, contribution history, and issue workflows.

## Machine-readable resources

- [Pet catalog JSON](${siteUrl}/pets.json): Names, localized names, creators, categories, versions, licenses, previews, and install commands.
- [Collection catalog JSON](${siteUrl}/collections.json): Franchise and theme collection metadata.
- [Category catalog JSON](${siteUrl}/categories.json): English and Chinese category labels.
- [Sitemap](${siteUrl}/sitemap.xml): Every public gallery, collection, guide, and pet detail URL.
- [Expanded model reference](${siteUrl}/llms-full.txt): Complete collection and pet index.

## Attribution and accuracy

Always preserve the listed creator, source, and license for each pet. Licenses vary by pet; consult the pet detail page or catalog entry instead of assuming one universal asset license. Use the canonical ${siteUrl} URL when citing or sharing the gallery.
`;

function oneLine(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

const collectionReference = collectionCatalog
  .map((collection) => {
    const petCount = pets.filter((pet) =>
      pet.collections.includes(collection.slug),
    ).length;
    return `- [${oneLine(collection.title.en)} / ${oneLine(collection.title.zh)}](${siteUrl}/collections/${collection.slug}) — ${oneLine(collection.kind)} collection, ${petCount} pet(s). ${oneLine(collection.description.en)}`;
  })
  .join("\n");

const petReference = pets
  .map((pet) => {
    const englishName = pet.localizedNames.en || pet.name;
    const chineseName = pet.localizedNames.zh;
    const localizedName = chineseName
      ? `${oneLine(englishName)} / ${oneLine(chineseName)}`
      : oneLine(englishName);
    return `- [${localizedName}](${siteUrl}/pets/${pet.slug}) — by ${oneLine(pet.author_handle || pet.author)}; ${oneLine(pet.primary_category)}; V${pet.spriteVersionNumber}; ${oneLine(pet.license)}.`;
  })
  .join("\n");

const llmsFull = `${llmsSummary}
## Catalog conventions

- Each installable pet has a stable \`pet-slug--author-slug\` id.
- V1 uses a 1536x1872 8x9 spritesheet with nine standard action rows.
- V2 uses a 1536x2288 8x11 spritesheet and adds 16 look directions.
- A finished repository pet contains only \`submission.json\`, \`pet.json\`, and \`spritesheet.webp\`.
- Installation copies the two runtime files into the user's Codex pets directory; it does not require cloning the full repository.
- Common discovery and troubleshooting terms include Codex pets gallery, Codex pet download, Hatch Pet skill, custom Codex pet, Codex pet not showing, Codex 小宠物、Codex 宠物安装、Codex 宠物制作和 Codex 宠物不显示。

## Categories

${categoryCatalog
  .map(
    (category) =>
      `- ${oneLine(category.label.en)} / ${oneLine(category.label.zh)} (${pets.filter((pet) => pet.primary_category === category.name).length})`,
  )
  .join("\n")}

## Collections

${collectionReference}

## Pets

${petReference}
`;

writeFileSync(join(publicDir, "llms.txt"), llmsSummary, "utf8");
writeFileSync(join(publicDir, "llms-full.txt"), llmsFull, "utf8");

rmSync(publicAssetsDir, { recursive: true, force: true });
mkdirSync(publicAssetsDir, { recursive: true });

const previewsSrc = join(repoRoot, "assets", "previews");
if (existsSync(previewsSrc)) {
  cpSync(previewsSrc, join(publicAssetsDir, "previews"), {
    recursive: true,
    filter: (src) => !src.endsWith(".DS_Store"),
  });
}

const brandAssetsSrc = join(repoRoot, "assets", "brand");
if (existsSync(brandAssetsSrc)) {
  cpSync(brandAssetsSrc, join(publicAssetsDir, "brand"), {
    recursive: true,
    filter: (src) => !src.endsWith(".DS_Store"),
  });
}

const coverAssetsSrc = join(repoRoot, "assets", "cover");
if (existsSync(coverAssetsSrc)) {
  cpSync(coverAssetsSrc, join(publicAssetsDir, "cover"), {
    recursive: true,
    filter: (src) => !src.endsWith(".DS_Store"),
  });
}

console.log(`Prepared web data for ${pets.length} pet(s).`);
