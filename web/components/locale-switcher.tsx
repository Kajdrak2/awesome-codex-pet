"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale } from "@/components/locale-provider";
import {
  type Locale,
  localeConfig,
  localeFromPathname,
  localePath,
  supportedLocales,
} from "@/lib/i18n";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    const routeLocale = localeFromPathname(pathname);
    const basePath = routeLocale
      ? pathname.replace(new RegExp(`^/${routeLocale}(?=/|$)`), "") || "/"
      : pathname;
    if (basePath === "/" || basePath === "/install" || basePath === "/request") {
      router.push(localePath(nextLocale, basePath));
    }
  }

  return (
    <label className="relative">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="h-9 w-[104px] cursor-pointer appearance-none rounded-md border border-border bg-bg-elevated py-0 pl-3 pr-7 text-xs font-medium text-text transition-colors hover:border-border-hover hover:bg-bg-secondary"
        onChange={(event) => changeLocale(event.target.value as Locale)}
        value={locale}
      >
        {supportedLocales.map((item) => (
          <option key={item} value={item}>
            {localeConfig[item].label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted"
      >
        ▾
      </span>
    </label>
  );
}
