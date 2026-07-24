"use client";

import { useState } from "react";
import { useAllDreams } from "@/api/queries";
import type { DreamDto } from "@/api/request-types";

export type DreamsTab = "popular" | "less-popular";

export function useDreamsGrid() {
  const [tab, setTab] = useState<DreamsTab>("popular");

  // NOTE: the API only exposes `isPopular` (get popular dreams) — there's no
  // "least popular first" sort on the backend, so "Less popular" here just
  // means "the regular, unfiltered list". Swap this out if the backend ever
  // adds a dedicated sort for it.
  const { data, isLoading } = useAllDreams({
    take: 20,
    isPopular: tab === "popular" ? true : undefined,
  });

  const dreams = data?.results ?? [];

  const handleFulfill = (dream: DreamDto) => {
    // TODO: wire this up to your actual fulfill/donation flow
    console.log("Fulfill:", dream.id);
  };

  const handleRandomFulfill = () => {
    if (dreams.length === 0) return;
    const random = dreams[Math.floor(Math.random() * dreams.length)];
    handleFulfill(random);
  };

  return {
    tab,
    setTab,
    dreams,
    isLoading,
    handleFulfill,
    handleRandomFulfill,
  };
}
