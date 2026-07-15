export const siteConfig = {
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://awesome-codex-pet.pages.dev",
  title: "Awesome Codex Pet",
  altName: "Codex Pet Gallery",
  description:
    "Discover carefully selected community-made Codex pets. Inspect complete animations, meet the creators, install in one step on macOS, Linux, or Windows, and submit through a quality-focused GitHub workflow.",
  shortDescription:
    "A selective gallery of beautifully made Codex pets with complete animation previews and one-step installation.",
  ogImage: "/assets/cover/awesome-codex-pet-cover.png",
  repo: "https://github.com/legeling/awesome-codex-pet",
  keywords: [
    "Codex",
    "Codex pet",
    "Codex pets",
    "Codex CLI",
    "OpenAI Codex",
    "desktop pet",
    "pixel art pet",
    "spritesheet",
    "动漫桌面宠物",
    "代码助手宠物",
    "open source pet",
    "Awesome Codex Pet",
  ],
};

export type SiteConfig = typeof siteConfig;
