"use client";

import { useLocale } from "@/components/locale-provider";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className="inline-flex h-9 min-w-11 items-center justify-center rounded-md border border-border bg-bg-elevated px-2.5 text-xs font-medium text-muted hover:border-border-hover hover:bg-bg-secondary hover:text-text transition-colors cursor-pointer"
      aria-label="Switch language"
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
