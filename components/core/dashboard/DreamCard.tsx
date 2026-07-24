"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { DreamDto } from "@/api/request-types";

interface DreamCardProps {
  dream: DreamDto;
  onFulfill?: (dream: DreamDto) => void;
}

export function DreamCard({ dream, onFulfill }: DreamCardProps) {
  const coverImage =
    dream.images?.find((image) => image.isMain) ?? dream.images?.[0];
  const owner = dream.user;
  const ownerName =
    [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim() ||
    "Dreamer";
  const progress = Math.min(Math.max(dream.progress ?? 0, 0), 100);

  const ownerAvatarUrl = owner?.mainImageUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${owner.mainImageUrl.startsWith("/") ? owner.mainImageUrl.slice(1) : owner.mainImageUrl}`
    : undefined;

  const coverImageUrl = coverImage?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${coverImage.url.startsWith("/") ? coverImage.url.slice(1) : coverImage.url}`
    : undefined;

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-lg">
      {/* Cover Image */}
      <div className="relative h-32 w-full bg-gradient-to-br from-[#84FAD5] via-[#EBBFFF] to-[#F6EC85]">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={dream.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* Avatar */}
      <div className="relative">
        <Avatar className="absolute left-1/2 -top-12 -translate-x-1/2 !h-24 !w-24 rounded-full border-4 border-white bg-gray-200 shadow-md" size="lg">
          <AvatarImage src={ownerAvatarUrl} alt={ownerName} />
          <AvatarFallback>{ownerName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      {/* User Info */}
      <div className="mt-14 px-4 pb-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">{ownerName}</h2>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {dream.title}
        </p>

        {/* Scope Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Scope</span>
            <span className="font-semibold text-gray-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#84FAD5] via-[#EBBFFF] to-[#F6EC85] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="gradient_outline"
            className="flex-1 rounded-full"
            onClick={() => onFulfill?.(dream)}
          >
            Fulfill
          </Button>
          <Link href={`/dreams/${dream.id}#comments`} className="flex-1">
            <Button
              variant="outline"
              size="icon"
              className="w-full rounded-full"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}