"use client";

import { ActionDropdown } from "@/components/action-dropdown";
import { ChatGPTIcon } from "@/components/chatgpt-icon";
import { useLocale } from "@/components/locale-provider";
import {
  buildChatGPTUrl,
  getPetRequestPrompt,
  getPetSubmissionPrompt,
} from "@/lib/codex-links";

export function SubmissionMenu() {
  const { locale, t } = useLocale();

  return (
    <ActionDropdown
      label={t("submitPet")}
      menuWidth={248}
      triggerClassName="ml-1 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
      trigger={
        <>
          {t("submitPet")}
          <svg
            className="size-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.25}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </>
      }
    >
      <a
        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-text transition-colors hover:bg-surface"
        href={buildChatGPTUrl(getPetRequestPrompt(locale))}
        target="_blank"
        rel="noreferrer"
        role="menuitem"
      >
        <ChatGPTIcon className="size-7" />
        <span className="font-medium">{t("requestPetWithAI")}</span>
      </a>
      <a
        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-text transition-colors hover:bg-surface"
        href={buildChatGPTUrl(getPetSubmissionPrompt(locale))}
        target="_blank"
        rel="noreferrer"
        role="menuitem"
      >
        <ChatGPTIcon className="size-7" />
        <span className="font-medium">{t("submitPetWithAI")}</span>
      </a>
      <div className="my-1 border-t border-border" role="separator" />
      <a
        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-text transition-colors hover:bg-surface"
        href="https://github.com/legeling/awesome-codex-pet/compare"
        target="_blank"
        rel="noreferrer"
        role="menuitem"
      >
        <svg
          className="size-5 shrink-0 text-muted"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.19.69.8.57A12 12 0 0 0 12 0Z" />
        </svg>
        <span className="font-medium">{t("advancedPullRequest")}</span>
      </a>
      <a
        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-text transition-colors hover:bg-surface"
        href="/guide"
        role="menuitem"
      >
        <svg
          className="size-5 shrink-0 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4V5.5Zm16 0A2.5 2.5 0 0 0 17.5 3H13v18a3 3 0 0 1 3-3h4V5.5Z"
          />
        </svg>
        <span className="font-medium">{t("submissionGuide")}</span>
      </a>
    </ActionDropdown>
  );
}
