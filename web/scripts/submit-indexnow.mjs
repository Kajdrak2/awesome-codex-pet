import { readFile } from "node:fs/promises";

const SITE_URL = "https://codexpet.top";
const KEY = "08254c99d6c240bbe7ccf299084678a7";
const argumentsList = process.argv.slice(2);
const dryRun = argumentsList.includes("--dry-run");
const sitemapPath =
  argumentsList.find((argument) => !argument.startsWith("--")) ??
  "out/sitemap.xml";
const sitemap = await readFile(sitemapPath, "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);

if (urlList.length === 0 || urlList.length > 10_000) {
  throw new Error(`Expected 1-10000 sitemap URLs, found ${urlList.length}.`);
}
if (urlList.some((value) => !value.startsWith(`${SITE_URL}/`))) {
  throw new Error("IndexNow only accepts canonical codexpet.top URLs.");
}

if (dryRun) {
  console.log(`Validated ${urlList.length} canonical URLs for IndexNow.`);
} else {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "codexpet.top",
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  });
  if (![200, 202].includes(response.status)) {
    throw new Error(
      `IndexNow returned ${response.status}: ${await response.text()}`,
    );
  }
  console.log(`Submitted ${urlList.length} canonical URLs to IndexNow.`);
}
