"use client";

import { useEffect } from "react";

import { useLocale } from "@/components/locale-provider";
import { siteConfig } from "@/lib/site";

type LocalizedDocumentTitleProps = {
  en: string;
  zh: string;
};

export function LocalizedDocumentTitle({
  en,
  zh,
}: LocalizedDocumentTitleProps) {
  const { locale } = useLocale();

  useEffect(() => {
    const localizedTitle = `${locale === "zh" ? zh : en} · ${siteConfig.title}`;
    const applyTitle = () => {
      if (document.title !== localizedTitle) {
        document.title = localizedTitle;
      }
    };

    applyTitle();

    // Next may stream route metadata after hydration, so keep the visible tab
    // title aligned with the active client-side locale.
    const observer = new MutationObserver(applyTitle);
    observer.observe(document.head, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [en, locale, zh]);

  return null;
}
