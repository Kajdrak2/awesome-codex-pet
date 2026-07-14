"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";

import { useLocale } from "@/components/locale-provider";
import { translations, type TranslationKey } from "@/lib/i18n";
import type { Pet, PreviewAction } from "@/lib/pets";

export type PlaygroundAction = {
  action: PreviewAction;
  title: string;
  image: string;
};

type Position = { x: number; y: number };

const knownActionKeys = new Set(Object.keys(translations.en));

export function PetPlayground({
  pet,
  actions,
}: {
  pet: Pet;
  actions: PlaygroundAction[];
}) {
  const { t } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: Position;
  } | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selectedAction, setSelectedAction] = useState(
    actions[0]?.action ?? "idle",
  );

  const activeAction =
    actions.find((item) => item.action === selectedAction) ?? actions[0];
  const activeImage = activeAction?.image ?? pet.animatedPreviewImage;

  function actionLabel(item: PlaygroundAction) {
    return knownActionKeys.has(item.action)
      ? t(item.action as TranslationKey)
      : item.title;
  }

  function clampPosition(next: Position): Position {
    const stage = stageRef.current?.getBoundingClientRect();
    const petBounds = petRef.current?.getBoundingClientRect();
    if (!stage || !petBounds) return next;
    const maxX = Math.max(0, (stage.width - petBounds.width) / 2 - 18);
    const maxY = Math.max(0, (stage.height - petBounds.height) / 2 - 18);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }

  function startDrag(event: ReactPointerEvent<HTMLImageElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
    };
    setDragging(true);
  }

  function movePet(event: ReactPointerEvent<HTMLImageElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition(
      clampPosition({
        x: drag.origin.x + event.clientX - drag.startX,
        y: drag.origin.y + event.clientY - drag.startY,
      }),
    );
  }

  function stopDrag(event: ReactPointerEvent<HTMLImageElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function resetPosition() {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <div className="min-w-0">
      <div
        ref={stageRef}
        className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-secondary sm:min-h-[520px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(45deg,var(--color-bg-tertiary)_25%,transparent_25%),linear-gradient(-45deg,var(--color-bg-tertiary)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-bg-tertiary)_75%),linear-gradient(-45deg,transparent_75%,var(--color-bg-tertiary)_75%)] [background-position:0_0,0_8px,8px_-8px,-8px_0px] [background-size:16px_16px]"
        />
        <div className="absolute left-4 top-4 z-10 rounded-md border border-border bg-bg/85 px-2.5 py-1 text-xs font-medium text-text backdrop-blur">
          {activeAction ? actionLabel(activeAction) : t("interactivePreview")}
        </div>
        <button
          className="absolute right-4 top-4 z-20 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-bg/85 text-muted backdrop-blur transition-colors hover:bg-bg-elevated hover:text-text"
          type="button"
          title={t("resetPetPosition")}
          aria-label={t("resetPetPosition")}
          onClick={resetPosition}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 101.7-4.75M4.5 4.5v5h5" />
          </svg>
        </button>
        <img
          ref={petRef}
          className={`relative z-10 max-h-64 max-w-[72%] select-none object-contain [image-rendering:pixelated] sm:max-h-80 ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          src={activeImage}
          alt={`${pet.name} ${activeAction?.title ?? "preview"}`}
          draggable={false}
          style={{
            touchAction: "none",
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
          onDoubleClick={resetPosition}
          onPointerDown={startDrag}
          onPointerMove={movePet}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={() => {
            dragRef.current = null;
            setDragging(false);
          }}
        />
      </div>

      {actions.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {actions.map((item) => {
            const selected = item.action === activeAction?.action;
            return (
              <button
                className={`group flex w-28 shrink-0 cursor-pointer items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                  selected
                    ? "border-accent bg-accent-light"
                    : "border-border bg-bg-elevated hover:border-border-hover hover:bg-surface"
                }`}
                key={item.action}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedAction(item.action)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-bg-secondary">
                  <img
                    className="max-h-full max-w-full object-contain [image-rendering:pixelated]"
                    src={item.image}
                    alt=""
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0 truncate text-xs font-medium text-text">
                  {actionLabel(item)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
