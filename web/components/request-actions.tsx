"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/components/locale-provider";
import {
  fetchStats,
  isFollowingRequest,
  isSupportingRequest,
  setRequestFollowed,
  setRequestSupporting,
} from "@/lib/stats";

const copy = {
  en: {
    support: "I want this too",
    supported: "Supported",
    follow: "Follow progress",
    following: "Following",
    error: "Could not update. Try again.",
    supportTitle: "Add your support to help creators see community demand",
    followTitle: "Keep this request in your followed list on this device",
  },
  zh: {
    support: "我也想要",
    supported: "已支持",
    follow: "关注进度",
    following: "已关注",
    error: "更新失败，请重试。",
    supportTitle: "支持这个制作请求，让创作者看到社区需求",
    followTitle: "在这台设备上把该请求加入关注列表",
  },
} as const;

export function RequestActions({
  number,
  initialSupporters,
  disabled = false,
  onFollowChange,
  compact = false,
}: {
  number: number;
  initialSupporters: number;
  disabled?: boolean;
  onFollowChange?: (number: number, following: boolean) => void;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const text = copy[locale];
  const [supporters, setSupporters] = useState(initialSupporters);
  const [supporting, setSupporting] = useState(false);
  const [following, setFollowing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSupporting(isSupportingRequest(number));
    setFollowing(isFollowingRequest(number));
    const controller = new AbortController();
    void fetchStats(controller.signal)
      .then((payload) => {
        const snapshot = payload.requests[String(number)];
        if (snapshot) {
          setSupporters((current) => Math.max(current, snapshot.supporters));
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [number]);

  async function toggleSupport() {
    if (pending || disabled) return;
    const next = !supporting;
    const previousCount = supporters;
    setPending(true);
    setError("");
    setSupporting(next);
    setSupporters((current) => Math.max(0, current + (next ? 1 : -1)));

    try {
      const result = await setRequestSupporting(number, next);
      setSupporters(result.supporters);
      if (next && !following) {
        setFollowing(true);
        onFollowChange?.(number, true);
      }
    } catch {
      setSupporting(!next);
      setSupporters(previousCount);
      setError(text.error);
    } finally {
      setPending(false);
    }
  }

  function toggleFollow() {
    const next = !following;
    setFollowing(next);
    setRequestFollowed(number, next);
    onFollowChange?.(number, next);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          aria-pressed={supporting}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${
            supporting
              ? "border border-accent bg-accent-light text-accent"
              : "bg-accent text-white hover:bg-accent-hover"
          } ${compact ? "min-w-0" : "min-w-32"}`}
          disabled={pending || disabled}
          onClick={toggleSupport}
          title={text.supportTitle}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            fill={supporting ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{supporting ? text.supported : text.support}</span>
          <span className="font-mono text-xs tabular-nums opacity-75">
            {supporters}
          </span>
        </button>
        <button
          aria-pressed={following}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
            following
              ? "border-text bg-text text-bg"
              : "border-border bg-bg-elevated text-text hover:border-border-hover hover:bg-surface"
          }`}
          onClick={toggleFollow}
          title={text.followTitle}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            fill={following ? "currentColor" : "none"}
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 3h12v18l-6-4-6 4V3Z" />
          </svg>
          {following ? text.following : text.follow}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-[#b42318]" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
