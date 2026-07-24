"use client";

import { useState } from "react";
import { useAllDreams } from "@/api/queries";
import type { DreamDto } from "@/api/request-types";

export type DreamsTab = "popular" | "less-popular";

export function useDreamsGrid() {
  const [tab, setTab] = useState<DreamsTab>("popular");

  const { data, isLoading } = useAllDreams({
    take: 20,
    isPopular: tab === "popular" ? true : undefined,
  });

  const dreams = data?.results ?? [];

  const handleFulfill = (dream: DreamDto) => {
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
