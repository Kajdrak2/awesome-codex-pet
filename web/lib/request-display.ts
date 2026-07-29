import type { Locale } from "@/lib/i18n";
import type { RequestStatus } from "@/lib/request-catalog";

const statusLabels: Record<RequestStatus, Record<Locale, string>> = {
  triage: { en: "Under review", zh: "待审核" },
  open: { en: "Open", zh: "待认领" },
  "in-progress": { en: "In production", zh: "制作中" },
  review: { en: "In review", zh: "审查中" },
  completed: { en: "Published", zh: "已完成" },
  declined: { en: "Closed", zh: "已关闭" },
};

const categoryLabels: Record<string, Record<Locale, string>> = {
  animal: { en: "Animals", zh: "动物" },
  anime: { en: "Anime", zh: "动漫角色" },
  game: { en: "Games", zh: "游戏角色" },
  mascot: { en: "Mascots", zh: "吉祥物" },
  meme: { en: "Memes", zh: "梗图" },
  object: { en: "Objects", zh: "物品" },
  original: { en: "Original", zh: "原创角色" },
  other: { en: "Other", zh: "其他" },
  robot: { en: "Robots", zh: "机器人" },
};

export function getRequestStatusLabel(status: RequestStatus, locale: Locale) {
  return statusLabels[status][locale];
}

export function getRequestCategoryLabel(category: string, locale: Locale) {
  return categoryLabels[category]?.[locale] ?? category;
}

export function formatRequestDate(value: string, locale: Locale) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "";
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(timestamp);
}

export function requestExcerpt(value: string, maxLength = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
