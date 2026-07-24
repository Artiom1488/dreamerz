"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DreamCard } from "./DreamCard";
import type { DreamDto } from "@/api/request-types";

interface DreamsGridProps {
  dreams: DreamDto[];
  isLoading: boolean;
  onFulfill: (dream: DreamDto) => void;
}

export function DreamsGrid({ dreams, isLoading, onFulfill }: DreamsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-2xl" />
        ))}

      {!isLoading &&
        dreams.map((dream) => (
          <DreamCard key={dream.id} dream={dream} onFulfill={onFulfill} />
        ))}

      {!isLoading && dreams.length === 0 && (
        <p className="col-span-full py-12 text-center text-sm text-gray-400">
          No dreams to show yet.
        </p>
      )}
    </div>
  );
}