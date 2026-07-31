"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PetInstallMenu } from "@/components/pet-install-menu";
import { useLocale } from "@/components/locale-provider";
import { getLocalizedPetName } from "@/lib/codex-links";
import { drawGachaPets } from "@/lib/gacha";
import { getLocalizedCategoryLabel } from "@/lib/pet-localization";
import type { GalleryPet } from "@/lib/pets";

type GachaDialogProps = {
  pets: GalleryPet[];
};

type DrawCount = 1 | 3;

function DiceIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.9}
    >
      <rect height="15" rx="2.5" width="15" x="4.5" y="4.5" />
      <circle cx="8.5" cy="8.5" fill="currentColor" r="1" stroke="none" />
      <circle cx="15.5" cy="15.5" fill="currentColor" r="1" stroke="none" />
      <circle cx="15.5" cy="8.5" fill="currentColor" r="1" stroke="none" />
      <circle cx="8.5" cy="15.5" fill="currentColor" r="1" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function GachaMachine({
  pets,
  isDrawing,
}: {
  pets: GalleryPet[];
  isDrawing: boolean;
}) {
  const samples = useMemo(() => pets.slice(0, 6), [pets]);
  return (
    <div
      className={`relative mx-auto flex h-52 w-64 items-end justify-center sm:h-60 sm:w-72 ${isDrawing ? "gacha-machine--drawing" : ""}`}
      aria-hidden="true"
    >
      <div className="absolute bottom-8 h-40 w-52 overflow-hidden rounded-[50%] border-2 border-border bg-bg/80 shadow-inner sm:h-48 sm:w-60">
        <div className="absolute inset-x-5 top-4 grid grid-cols-3 gap-2 opacity-90">
          {samples.map((pet, index) => (
            <span
              className="flex aspect-square items-center justify-center rounded-full border border-border bg-bg-secondary/90"
              key={`${pet.slug}-${index}`}
            >
              <img
                alt=""
                className="size-10 object-contain [image-rendering:pixelated] sm:size-12"
                src={pet.previewImage}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 h-16 w-60 rounded-b-2xl rounded-t-md border border-border bg-accent shadow-lg sm:w-[17rem]">
        <div className="absolute left-1/2 top-2 size-7 -translate-x-1/2 rounded-full border border-white/50 bg-bg-elevated/90" />
        <div className="absolute -right-8 bottom-0 h-24 w-2 rounded-full bg-accent-hover">
          <span className="absolute -top-2 left-1/2 size-6 -translate-x-1/2 rounded-full border-2 border-accent-hover bg-accent" />
        </div>
      </div>
    </div>
  );
}

function ResultCard({ pet }: { pet: GalleryPet }) {
  const { locale, t } = useLocale();
  const name = getLocalizedPetName(pet, locale);
  return (
    <article className="flex min-w-0 flex-1 flex-col rounded-lg border border-border bg-bg-secondary p-3">
      <Link
        aria-label={`${t("view")} ${name}`}
        className="flex h-32 items-center justify-center rounded-md bg-bg-elevated sm:h-36"
        href={`/pets/${pet.slug}`}
      >
        <img
          alt={`${name} preview`}
          className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
          src={pet.previewImage}
        />
      </Link>
      <div className="mt-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            className="truncate text-sm font-semibold text-text hover:text-accent"
            href={`/pets/${pet.slug}`}
          >
            {name}
          </Link>
          <span className="shrink-0 text-[10px] text-muted">
            {getLocalizedCategoryLabel(pet.categoryLabel, locale)}
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-muted">
          {t("by")} {pet.author_handle ?? pet.author}
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          className="inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-md border border-border bg-bg-elevated px-2 text-xs font-medium text-text hover:bg-surface"
          href={`/pets/${pet.slug}`}
        >
          {t("view")}
        </Link>
        <PetInstallMenu pet={pet} />
      </div>
    </article>
  );
}

export function GachaDialog({ pets }: GachaDialogProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [drawCount, setDrawCount] = useState<DrawCount>(1);
  const [results, setResults] = useState<GalleryPet[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const hasAvailablePets = useMemo(
    () => pets.some((pet) => pet.previewImage && pet.animatedPreviewImage),
    [pets],
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);
  const previousSlugs = useRef<string[]>([]);
  const wasOpenRef = useRef(false);

  const close = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
    setIsDrawing(false);
  }, []);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) triggerRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [close, open]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [],
  );

  function draw() {
    if (isDrawing || !hasAvailablePets) return;
    setIsDrawing(true);
    setResults([]);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const delay = reducedMotion ? 0 : 520;
    timerRef.current = window.setTimeout(() => {
      const nextResults = drawGachaPets(
        pets,
        drawCount,
        previousSlugs.current,
      );
      previousSlugs.current = nextResults.map((pet) => pet.slug);
      setResults(nextResults);
      setIsDrawing(false);
      timerRef.current = null;
    }, delay);
  }

  function openDialog() {
    previousSlugs.current = [];
    setResults([]);
    setOpen(true);
  }

  return (
    <>
      <button
        ref={triggerRef}
        aria-label={t("gachaOpen")}
        className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent-light px-3 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={openDialog}
        title={t("gachaOpen")}
        type="button"
      >
        <DiceIcon />
        <span className="hidden sm:inline">{t("gachaOpen")}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/20 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          role="presentation"
        >
          <div
            aria-describedby="gacha-description"
            aria-labelledby="gacha-title"
            className="max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto rounded-t-lg border border-border bg-bg-elevated p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-lg sm:p-7"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text" id="gacha-title">
                  {t("gachaTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted" id="gacha-description">
                  {t("gachaDescription")}
                </p>
              </div>
              <button
                ref={closeRef}
                aria-label={t("gachaClose")}
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
                onClick={close}
                title={t("gachaClose")}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {!results.length ? (
              <>
                <GachaMachine pets={pets} isDrawing={isDrawing} />
                <div className="mx-auto flex max-w-sm rounded-lg border border-border bg-bg-secondary p-1">
                  {([1, 3] as const).map((value) => (
                    <button
                      aria-pressed={drawCount === value}
                      className={`h-10 flex-1 cursor-pointer rounded-md px-3 text-sm font-medium transition-colors ${
                        drawCount === value
                          ? "bg-bg-elevated text-text shadow-sm"
                          : "text-muted hover:text-text"
                      }`}
                      key={value}
                      onClick={() => setDrawCount(value)}
                      type="button"
                    >
                      {t(value === 1 ? "gachaSingle" : "gachaTriple")}
                    </button>
                  ))}
                </div>
                <button
                  aria-live="polite"
                  className="mx-auto mt-4 flex h-11 w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDrawing || !hasAvailablePets}
                  onClick={draw}
                  type="button"
                >
                  <DiceIcon />
                  {isDrawing ? t("gachaDrawing") : t("gachaStart")}
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  {t("gachaFreeNote")}
                </p>
              </>
            ) : (
              <>
                <div
                  aria-live="polite"
                  className="my-5 flex items-center justify-center gap-2 text-sm font-medium text-accent"
                >
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent text-white">
                    ✓
                  </span>
                  {t("gachaComplete", { count: results.length })}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {results.map((pet) => (
                    <ResultCard key={pet.slug} pet={pet} />
                  ))}
                </div>
                <button
                  className="mx-auto mt-5 flex h-10 w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-lg border border-accent/50 bg-accent-light px-5 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/10"
                  onClick={() => {
                    setResults([]);
                    setDrawCount(results.length === 3 ? 3 : 1);
                  }}
                  type="button"
                >
                  <DiceIcon />
                  {t("gachaDrawAgain")}
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
