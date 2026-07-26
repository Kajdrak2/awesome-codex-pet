import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_URL = "https://codexpet.top";
const INDEXNOW_KEY = "08254c99d6c240bbe7ccf299084678a7";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(scriptDir, "../out");
const failures = [];
const canonicalUrls = new Set();

function requireMatch(content, pattern, message) {
  if (!pattern.test(content)) failures.push(message);
}

function normalizeUrl(value) {
  const url = new URL(value);
  return url.pathname === "/" && !url.search ? url.origin : url.href;
}

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? findHtmlFiles(path)
        : Promise.resolve(entry.name.endsWith(".html") ? [path] : []);
    }),
  );
  return nested.flat();
}

function checkPage(filePath, html) {
  const outputPath = relative(outDir, filePath).replaceAll("\\", "/");
  if (outputPath === "404.html") return;
  const route =
    outputPath === "index.html"
      ? ""
      : outputPath.replace(/(?:\/index)?\.html$/, "");
  const expectedCanonical = `${SITE_URL}${route ? `/${route}` : ""}`;
  requireMatch(html, /<title>[^<]+<\/title>/, `${outputPath}: missing title`);
  requireMatch(
    html,
    /<meta name="description" content="[^"]+"/,
    `${outputPath}: missing description`,
  );
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== expectedCanonical) {
    failures.push(
      `${outputPath}: canonical is ${canonical ?? "missing"}, expected ${expectedCanonical}`,
    );
  } else {
    canonicalUrls.add(normalizeUrl(canonical));
  }
  if (/noindex/i.test(html)) {
    failures.push(`${outputPath}: unexpectedly noindex`);
  }
  if (/pages\.dev|www\.codexpet\.top/.test(html)) {
    failures.push(
      `${outputPath}: contains a non-canonical production hostname`,
    );
  }
}

async function checkWorker() {
  const workerPath = join(outDir, "_worker.js");
  const worker = (await import(pathToFileURL(workerPath).href)).default;
  const assets = { fetch: () => new Response("asset", { status: 200 }) };
  for (const host of ["www.codexpet.top", "awesome-codex-pet.pages.dev"]) {
    const response = await worker.fetch(
      new Request(`https://${host}/pets/example?from=seo`),
      { ASSETS: assets },
    );
    const expected = `${SITE_URL}/pets/example?from=seo`;
    if (
      response.status !== 301 ||
      response.headers.get("location") !== expected
    ) {
      failures.push(`_worker.js: ${host} does not redirect to ${expected}`);
    }
  }
}

const htmlFiles = await findHtmlFiles(outDir);
await Promise.all(
  htmlFiles.map(async (filePath) => {
    checkPage(filePath, await readFile(filePath, "utf8"));
  }),
);

const home = await readFile(join(outDir, "index.html"), "utf8");
for (const language of ["en-US", "zh-CN", "x-default"]) {
  requireMatch(
    home,
    new RegExp(`hreflang="${language}"`, "i"),
    `index.html: missing ${language} hreflang`,
  );
}

const chineseInstall = await readFile(join(outDir, "zh/install.html"), "utf8");
for (const required of [
  "如何安装 Codex 小宠物",
  "install-pet.sh",
  "Install-CodexPet",
  "application/ld+json",
]) {
  if (!chineseInstall.includes(required)) {
    failures.push(`zh/install.html: missing ${required}`);
  }
}
for (const language of ["en-US", "zh-CN", "x-default"]) {
  requireMatch(
    chineseInstall,
    new RegExp(`hreflang="${language}"`, "i"),
    `zh/install.html: missing ${language} hreflang`,
  );
}

const sitemap = await readFile(join(outDir, "sitemap.xml"), "utf8");
requireMatch(
  sitemap,
  /<loc>https:\/\/codexpet\.top\//,
  "sitemap: no canonical URLs",
);
if (/<lastmod>/.test(sitemap)) {
  failures.push(
    "sitemap: lastmod must be omitted until source dates are reliable",
  );
}
if (/pages\.dev|www\.codexpet\.top/.test(sitemap)) {
  failures.push("sitemap: contains a non-canonical production hostname");
}
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    normalizeUrl(match[1]),
  ),
);
for (const url of canonicalUrls) {
  if (!sitemapUrls.has(url)) {
    failures.push(`sitemap: missing ${url}`);
  }
}
for (const url of sitemapUrls) {
  if (!canonicalUrls.has(url)) failures.push(`sitemap: unknown URL ${url}`);
}

const robots = await readFile(join(outDir, "robots.txt"), "utf8");
requireMatch(
  robots,
  /Sitemap: https:\/\/codexpet\.top\/sitemap\.xml/,
  "robots.txt: missing canonical sitemap",
);
for (const agent of [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "PerplexityBot",
]) {
  requireMatch(
    robots,
    new RegExp(
      `^User-agent:[ \\t]*${agent}[ \\t]*\\r?$(?:(?!^User-agent:)[\\s\\S])*?^Allow:[ \\t]*/[ \\t]*\\r?$`,
      "m",
    ),
    `robots.txt: ${agent} is not explicitly allowed`,
  );
}
const llms = await readFile(join(outDir, "llms.txt"), "utf8");
for (const required of [
  `${SITE_URL}/zh/install`,
  "how to install a Codex pet",
  "install-pet.sh",
]) {
  if (!llms.includes(required)) failures.push(`llms.txt: missing ${required}`);
}
const indexNowKey = await readFile(join(outDir, `${INDEXNOW_KEY}.txt`), "utf8");
if (indexNowKey.trim() !== INDEXNOW_KEY) {
  failures.push("IndexNow ownership key is missing or invalid");
}
await checkWorker();

if (failures.length > 0) {
  throw new Error(`SEO validation failed:\n- ${failures.join("\n- ")}`);
}
console.log(
  `SEO validation passed for ${htmlFiles.length - 1} indexable pages.`,
);
