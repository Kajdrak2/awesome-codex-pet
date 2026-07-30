"use client";

import { useEffect, useState } from "react";

import { ActionDropdown } from "@/components/action-dropdown";
import { CodexIcon } from "@/components/codex-icon";
import { useLocale } from "@/components/locale-provider";
import {
  buildCodexUrl,
  getPetRequestCraftPrompt,
} from "@/lib/codex-links";
import type { PetRequest } from "@/lib/request-catalog";

const content = {
  en: {
    trigger: "I’ll make this",
    aiTitle: "Make it with Codex",
    aiDescription: "Send this request and its references to a new AI task.",
    manualTitle: "Submit a pull request",
    manualDescription: "Open GitHub and submit your finished pet for this request.",
    copy: "Copy prompt",
    copied: "Copied",
  },
  zh: {
    trigger: "我要制作",
    aiTitle: "交给 Codex 制作",
    aiDescription: "把当前请求和参考资料发送到新的 AI 任务。",
    manualTitle: "手动提交 PR",
    manualDescription: "已有成品或分支时，前往 GitHub 提交并关联此请求。",
    copy: "复制提示词",
    copied: "已复制",
  },
} as const;

export function RequestCraftMenu({ request }: { request: PetRequest }) {
  const { locale } = useLocale();
  const text = content[locale];
  const [copied, setCopied] = useState(false);
  const prompt = getPetRequestCraftPrompt(request, locale);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch (error) {
      console.error("Unable to copy the request craft prompt", error);
    }
  }

  return (
    <ActionDropdown
      label={text.trigger}
      menuWidth={348}
      triggerClassName="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-text px-4 text-sm font-medium text-bg transition-opacity hover:opacity-85"
      trigger={
        <>
          {text.trigger}
          <svg
            className="size-3.5"
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
      <div
        className="flex items-stretch rounded-md transition-colors hover:bg-surface"
        role="group"
      >
        <a
          className="flex min-w-0 flex-1 items-start gap-3 px-3 py-3 text-text"
          href={buildCodexUrl(prompt)}
          role="menuitem"
        >
          <CodexIcon className="mt-0.5 size-8" />
          <span className="min-w-0">
            <span className="block text-sm font-medium">{text.aiTitle}</span>
            <span className="mt-0.5 block text-xs leading-4 text-muted">
              {text.aiDescription}
            </span>
          </span>
        </a>
        <button
          className="my-2 mr-1.5 flex w-[78px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 border-l border-border px-2 text-[11px] leading-4 text-muted transition-colors hover:text-accent"
          type="button"
          role="menuitem"
          data-menu-keep-open
          title={text.copy}
          aria-label={text.copy}
          onClick={() => void copyPrompt()}
        >
          {copied ? (
            <svg
              className="size-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
              />
            </svg>
          )}
          <span aria-live="polite">{copied ? text.copied : text.copy}</span>
        </button>
      </div>

      <div className="my-1 border-t border-border" role="separator" />

      <a
        className="flex items-start gap-3 rounded-md px-3 py-3 text-text transition-colors hover:bg-surface"
        href="https://github.com/legeling/awesome-codex-pet/compare"
        target="_blank"
        rel="noreferrer"
        role="menuitem"
      >
        <svg
          className="mt-0.5 size-5 shrink-0 text-muted"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.19.69.8.57A12 12 0 0 0 12 0Z" />
        </svg>
        <span className="min-w-0">
          <span className="block text-sm font-medium">
            {text.manualTitle}
          </span>
          <span className="mt-0.5 block text-xs leading-4 text-muted">
            {text.manualDescription} #{request.number}
          </span>
        </span>
      </a>
    </ActionDropdown>
  );
}
