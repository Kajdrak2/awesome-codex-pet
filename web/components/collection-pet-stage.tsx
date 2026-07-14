import Link from "next/link";

import type { Pet } from "@/lib/pets";

type CollectionPetStageProps = {
  pets: Pet[];
  variant?: "card" | "hero";
};

const cardLayout = [
  { left: 0, bottom: 8, width: 26, scale: 0.82, zIndex: 10 },
  { left: 17, bottom: 24, width: 29, scale: 1, zIndex: 30 },
  { left: 39, bottom: 4, width: 27, scale: 0.88, zIndex: 20 },
  { left: 59, bottom: 30, width: 30, scale: 1.04, zIndex: 40 },
  { left: 79, bottom: 10, width: 23, scale: 0.8, zIndex: 10 },
] as const;

const heroLayout = [
  { left: 0, bottom: 4, width: 28, scale: 0.82, zIndex: 10 },
  { left: 17, bottom: 22, width: 31, scale: 1, zIndex: 30 },
  { left: 40, bottom: 0, width: 29, scale: 0.9, zIndex: 20 },
  { left: 60, bottom: 26, width: 32, scale: 1.05, zIndex: 40 },
  { left: 80, bottom: 7, width: 24, scale: 0.8, zIndex: 10 },
] as const;

export function CollectionPetStage({
  pets,
  variant = "card",
}: CollectionPetStageProps) {
  const layout = variant === "hero" ? heroLayout : cardLayout;

  return (
    <div className="relative h-full w-full overflow-hidden" aria-label="Collection characters">
      {pets.slice(0, layout.length).map((pet, index) => {
        const placement = layout[index];
        return (
          <Link
            className="group/pet absolute flex h-[82%] items-end justify-center transition-transform duration-200 hover:z-50 hover:-translate-y-1.5 focus-visible:z-50 focus-visible:-translate-y-1.5"
            href={`/pets/${pet.slug}`}
            key={pet.slug}
            aria-label={pet.name}
            style={{
              bottom: placement.bottom,
              left: `${placement.left}%`,
              width: `${placement.width}%`,
              zIndex: placement.zIndex,
            }}
          >
            <img
              className="max-h-full max-w-full object-contain [image-rendering:pixelated] transition-transform duration-200 group-hover/pet:scale-105"
              src={pet.animatedPreviewImage}
              alt={pet.name}
              loading={variant === "card" ? "lazy" : undefined}
              style={{ transform: `scale(${placement.scale})`, transformOrigin: "bottom center" }}
            />
          </Link>
        );
      })}
    </div>
  );
}
