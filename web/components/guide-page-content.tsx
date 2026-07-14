"use client";

import { useState } from "react";

import { CodexIcon } from "@/components/codex-icon";
import { useLocale } from "@/components/locale-provider";
import { buildCodexUrl, getSubmissionPrompt } from "@/lib/codex-links";
import type { CategoryDefinition } from "@/lib/categories";

type GuidePageContentProps = {
  categories: CategoryDefinition[];
};

export function GuidePageContent({ categories }: GuidePageContentProps) {
  const { t, locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const submissionPrompt = getSubmissionPrompt(locale);

  const fullGuideHref =
    locale === "zh"
      ? "https://github.com/legeling/awesome-codex-pet/blob/main/docs/zh-CN/submission-guide.md"
      : "https://github.com/legeling/awesome-codex-pet/blob/main/docs/en/submission-guide.md";

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(submissionPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (error: unknown) {
      console.warn(
        "Unable to copy AI submission prompt",
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  return (
    <main className="max-w-[960px] mx-auto px-6 pt-16 pb-24">
      <header className="mb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          {t("guidePageTitle")}
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
          {t("guidePageSubtitle")}
        </p>
      </header>

      <section className="mb-14 border-y border-border py-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
              {t("guideAIWorkflowEyebrow")}
            </p>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight">
              {t("guideAIWorkflowTitle")}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              {t("guideAIWorkflowDesc")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                href={buildCodexUrl(submissionPrompt)}
              >
                <CodexIcon className="size-6" />
                {t("startInCodex")}
              </a>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-medium text-text hover:bg-surface transition-colors cursor-pointer"
                type="button"
                onClick={() => void copyPrompt()}
              >
                {copied ? t("copied") : t("copyAIPrompt")}
              </button>
            </div>
          </div>
          <div className="min-w-0 rounded-lg border border-border bg-bg-secondary p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t("aiPromptPreview")}
              </span>
              <span className="text-xs text-accent">{t("repositorySkillLabel")}</span>
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-text-secondary">
              {submissionPrompt}
            </pre>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          {t("guideCategoriesTitle")}
        </h2>
        <p className="text-sm text-muted mb-5">
          {t("guideCategoriesDesc")}
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.name}
              className="px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-sm text-text"
            >
              {category.label[locale]}
            </span>
          ))}
        </div>
      </section>

      {/* Folder structure */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          {t("guideStructureTitle")}
        </h2>
        <p className="text-sm text-muted mb-5">
          {t("guideStructureDesc")}
        </p>
        <pre className="rounded-xl bg-bg-secondary border border-border p-5 text-xs sm:text-sm font-mono text-text-secondary overflow-x-auto">
{`pets/
└── pet-slug--author-slug/
    ├── submission.json
    ├── pet.json
    └── spritesheet.webp`}
        </pre>
        <p className="text-xs text-muted mt-3">{t("guideStructureNote")}</p>
      </section>

      <section className="mb-14">
        <h2 className="mb-2 text-xl font-semibold tracking-tight">
          {t("guideCollectionsTitle")}
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-muted">
          {t("guideCollectionsDesc")}
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-secondary p-5 font-mono text-xs text-text-secondary sm:text-sm">
{`{
  "collections": ["genshin-impact"]
}`}
        </pre>
      </section>

      {/* Runtime versions */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          {t("guideVersionsTitle")}
        </h2>
        <p className="text-sm text-muted mb-5">{t("guideVersionsDesc")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[t("guideVersionV1"), t("guideVersionV2")].map((version) => (
            <div
              key={version}
              className="border-l-2 border-accent bg-bg-secondary px-4 py-3 text-sm text-text-secondary"
            >
              {version}
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          {t("guideUpgradeTitle")}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {t("guideUpgradeDesc")}
        </p>
      </section>

      {/* Checklist */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-5">
          {t("guideChecklistTitle")}
        </h2>
        <ul className="space-y-3">
          {[
            t("guideChecklistItem1"),
            t("guideChecklistItem2"),
            t("guideChecklistItem3"),
            t("guideChecklistItem4"),
            t("guideChecklistItem5"),
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-text leading-relaxed"
            >
              <span className="mt-0.5 inline-flex shrink-0 size-5 items-center justify-center rounded-full bg-accent-light text-accent">
                <svg
                  className="size-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          href={buildCodexUrl(submissionPrompt)}
        >
          {t("startInCodex")}
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
        <a
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-text hover:bg-surface transition-colors"
          href="https://github.com/legeling/awesome-codex-pet/issues/new?template=pet-submission.yml"
          target="_blank"
          rel="noreferrer"
        >
          {t("guideOpenIssue")}
        </a>
        <a
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-text hover:bg-surface transition-colors"
          href={fullGuideHref}
          target="_blank"
          rel="noreferrer"
        >
          {t("guideReadFull")}
        </a>
      </div>
    </main>
  );
}
