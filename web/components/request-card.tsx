"use client";

import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { RequestActions } from "@/components/request-actions";
import { RequestVisual } from "@/components/request-visual";
import {
  formatRequestDate,
  getRequestCategoryLabel,
  getRequestStatusLabel,
  requestExcerpt,
} from "@/lib/request-display";
import type { PetRequest } from "@/lib/request-catalog";

export function RequestCard({
  request,
  onFollowChange,
  compact = false,
}: {
  request: PetRequest;
  onFollowChange?: (number: number, following: boolean) => void;
  compact?: boolean;
}) {
  const { locale } = useLocale();

  return (
    <article
      className={`group overflow-hidden rounded-lg border border-border bg-bg-elevated transition-colors hover:border-border-hover ${
        compact
          ? "grid min-w-[300px] grid-cols-[96px_minmax(0,1fr)]"
          : "flex h-full flex-col"
      }`}
    >
      <Link
        aria-label={request.character}
        className={compact ? "block h-full min-h-44" : "block aspect-[16/9]"}
        href={`/requests/${request.number}`}
      >
        <RequestVisual
          category={request.category}
          className="h-full w-full"
          image={request.referenceImages[0]}
          name={request.character}
        />
      </Link>
      <div className={`flex min-w-0 flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md bg-accent-light px-2 py-1 font-medium text-accent">
            {getRequestStatusLabel(request.status, locale)}
          </span>
          <span className="text-muted">
            {getRequestCategoryLabel(request.category, locale)}
          </span>
          {request.version ? (
            <span className="font-mono uppercase text-muted">
              {request.version}
            </span>
          ) : null}
        </div>
        <Link
          className="mt-3 block text-lg font-semibold leading-snug text-text transition-colors group-hover:text-accent"
          href={`/requests/${request.number}`}
        >
          {request.character}
        </Link>
        {request.franchise ? (
          <p className="mt-1 truncate text-sm text-muted">
            {request.franchise}
          </p>
        ) : null}
        {!compact && request.visualDirection ? (
          <p className="mt-3 flex-1 text-sm leading-6 text-text-secondary">
            {requestExcerpt(request.visualDirection)}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted">
          <span>#{request.number}</span>
          <span>
            {locale === "zh" ? "更新于 " : "Updated "}
            {formatRequestDate(request.updatedAt, locale)}
          </span>
        </div>
        <div className="mt-3">
          <RequestActions
            compact={compact}
            disabled={
              request.status === "completed" || request.status === "declined"
            }
            initialSupporters={request.reactions}
            number={request.number}
            onFollowChange={onFollowChange}
          />
        </div>
      </div>
    </article>
  );
}
