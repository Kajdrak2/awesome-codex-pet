"use client";

import Link from "next/link";

import { CollectionPetStage } from "@/components/collection-pet-stage";
import { ShareMenu } from "@/components/share-menu";
import { useLocale } from "@/components/locale-provider";
import { getCollectionInstallPrompt } from "@/lib/codex-links";
import { getCollectionCoverPets, type PetCollection } from "@/lib/collections";
import { siteConfig } from "@/lib/site";

export function CollectionCard({ collection }: { collection: PetCollection }) {
  const { locale, t } = useLocale();
  const title = collection.title[locale];
  const coverPets = getCollectionCoverPets(collection);
  const href = `/collections/${collection.slug}`;

  return (
    <article className="group overflow-visible rounded-lg border border-border bg-bg-elevated transition-colors hover:border-border-hover">
      <div className="relative h-52 rounded-t-lg bg-bg-secondary px-5 pt-5">
        <CollectionPetStage pets={coverPets} />
        <div className="absolute right-3 top-3">
          <ShareMenu
            compact
            title={title}
            url={`${siteConfig.url}${href}`}
            codexPrompt={getCollectionInstallPrompt(
              title,
              collection.pets.map((pet) => pet.slug),
              locale,
            )}
          />
        </div>
      </div>

      <Link className="relative z-10 block bg-bg-elevated p-5" href={href}>
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-text">{title}</h3>
          <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted">
            {t("collectionPetCount", { count: collection.pets.length })}
          </span>
        </div>
        <p className="min-h-10 text-sm leading-relaxed text-muted">
          {collection.description[locale]}
        </p>
      </Link>
    </article>
  );
}
