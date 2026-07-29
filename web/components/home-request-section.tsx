"use client";

import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { RequestCard } from "@/components/request-card";
import type { PetRequest } from "@/lib/request-catalog";

export function HomeRequestSection({
  requests,
}: {
  requests: PetRequest[];
}) {
  const { locale } = useLocale();

  return (
    <section
      aria-labelledby="home-requests-title"
      className="mb-20 border-y border-border py-10"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {locale === "zh" ? "社区正在等待" : "Community wishlist"}
          </p>
          <h2
            className="mt-2 text-3xl font-semibold tracking-tight text-text"
            id="home-requests-title"
          >
            {locale === "zh"
              ? "这些小宠物还在等人制作"
              : "These pets are waiting to be made"}
          </h2>
        </div>
        <Link
          className="text-sm font-semibold text-accent hover:underline"
          href="/requests"
        >
          {locale === "zh" ? "进入需求广场" : "Open the request plaza"}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {requests.map((request) => (
          <div
            className="w-[min(88vw,430px)] shrink-0 snap-start"
            key={request.number}
          >
            <RequestCard compact request={request} />
          </div>
        ))}
      </div>
    </section>
  );
}
