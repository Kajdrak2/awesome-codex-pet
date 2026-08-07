"use client";

import { useEffect, useState } from "react";

const categoryStyle: Record<string, string> = {
  animal: "bg-[#f2e8dc] text-[#76543d]",
  anime: "bg-[#e8edf8] text-[#445b8b]",
  game: "bg-[#e7f2ec] text-[#356650]",
  mascot: "bg-[#f5e9ef] text-[#7c4862]",
  other: "bg-bg-tertiary text-muted",
};

const categoryPlaceholder: Record<string, string> = {
  animal: "animal",
  anime: "anime",
  game: "game",
  mascot: "other",
  meme: "other",
  object: "other",
  original: "other",
  other: "other",
  robot: "other",
};

export function RequestVisual({
  name,
  category,
  image,
  className = "",
}: {
  name: string;
  category: string;
  image?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [placeholderFailed, setPlaceholderFailed] = useState(false);
  const placeholder = `/assets/request-placeholders/${
    categoryPlaceholder[category] ?? "other"
  }.webp`;
  const showReference = Boolean(image) && !failed;

  useEffect(() => {
    setFailed(false);
    setPlaceholderFailed(false);
  }, [image]);

  return (
    <div
      className={`relative flex min-h-0 items-center justify-center overflow-hidden ${categoryStyle[category] ?? categoryStyle.other} ${className}`}
    >
      {!placeholderFailed ? (
        <img
          alt={showReference ? `${name} reference` : ""}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={() => {
            if (showReference) setFailed(true);
            else setPlaceholderFailed(true);
          }}
          src={showReference ? image : placeholder}
        />
      ) : (
        <>
          <span
            className="absolute inset-0 opacity-30 [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:18px_18px]"
            aria-hidden="true"
          />
          <span className="relative text-4xl font-semibold uppercase">
            {name.trim().slice(0, 1) || "?"}
          </span>
        </>
      )}
    </div>
  );
}
