"use client";

import Link from "next/link";

import { ActionDropdown } from "@/components/action-dropdown";
import { CodexIcon } from "@/components/codex-icon";
import { useLocale } from "@/components/locale-provider";
import { buildCodexUrl, getSubmissionPrompt } from "@/lib/codex-links";

const manualSubmissionUrl =
  "https://github.com/legeling/awesome-codex-pet/issues/new?template=pet-submission.yml";

export function SubmissionMenu() {
  const { locale, t } = useLocale();

  return (
    <ActionDropdown
      label={t("submitPet")}
      menuWidth={288}
      triggerClassName="ml-1 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
      trigger={
        <>
          {t("submitPet")}
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </>
      }
    >
      <a
        className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm text-text transition-colors hover:bg-surface"
        href={buildCodexUrl(getSubmissionPrompt(locale))}
        role="menuitem"
      >
        <CodexIcon className="size-7" />
        <span>
          <span className="block font-medium">{t("aiSubmission")}</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">{t("aiSubmissionDesc")}</span>
        </span>
      </a>
      <a
        className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm text-text transition-colors hover:bg-surface"
        href={manualSubmissionUrl}
        target="_blank"
        rel="noreferrer"
        role="menuitem"
      >
        <svg className="mt-0.5 size-5 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>
          <span className="block font-medium">{t("manualSubmission")}</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">{t("manualSubmissionDesc")}</span>
        </span>
      </a>
      <div className="my-1 border-t border-border" />
      <Link
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-text"
        href="/guide"
        role="menuitem"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18.25a8.967 8.967 0 016 2.292m0-14.5a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25a8.987 8.987 0 00-3-.512 8.966 8.966 0 00-6 2.292m0-14.5v14.5" />
        </svg>
        {t("submissionGuide")}
      </Link>
    </ActionDropdown>
  );
}
