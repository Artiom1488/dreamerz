"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLastDonations } from "@/api/queries";

export function LastFulfilled() {
  const { data: donations, isLoading } = useLastDonations();

  return (
    <div className="flex h-full min-w-0 flex-col">
      <h2 className="mb-4 text-sm font-medium text-gray-400">Last fulfilled</h2>

      <ScrollArea className="min-h-0 w-full flex-1">
        <div className="w-full min-w-0 space-y-4 pr-4 pb-4">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}

          {!isLoading &&
            donations?.map((donation) => {
              const owner = donation.dream.user;
              const ownerName =
                [owner?.firstName, owner?.lastName]
                  .filter(Boolean)
                  .join(" ")
                  .trim() || "Dreamer";

              const ownerAvatarUrl = owner?.mainImageUrl
                ? `${process.env.NEXT_PUBLIC_API_URL}${owner.mainImageUrl.startsWith("/") ? owner.mainImageUrl.slice(1) : owner.mainImageUrl}`
                : undefined;

              return (
                <div key={donation.id} className="flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-md" size="lg">
                      <AvatarImage
                        src={ownerAvatarUrl}
                        alt={ownerName}
                      />
                      <AvatarFallback className="rounded-md">
                        {ownerName.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {ownerName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {donation.dream.title}
                      </p>
                    </div>
                  </div>

                  <Link href={`/dreams/${donation.dream.id}`} className="w-full">
                    <Button variant="gradient_fill" className="w-full rounded-full">
                      Fulfill
                    </Button>
                  </Link>
                </div>
              );
            })}

          {!isLoading && (donations?.length ?? 0) === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              No donations yet.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}