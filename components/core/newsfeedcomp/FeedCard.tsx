"use client";

import { useEffect, useRef } from "react";
import { useNewsFeeds } from "@/api/queries";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DreamPost } from "./DreamPost";
import { CharityPost } from "./CharityPost";
import type { NewsFeedItemDto } from "@/api/request-types";

export function FeedCard() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useNewsFeeds({ take: 5, order: "DESC" });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load newsfeed. Please try again later.
      </div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.results) || [];

  if (allPosts.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No posts yet. Be the first to share your dream!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allPosts.map((post) => (
        <PostRenderer key={post.id} post={post} />
      ))}

      <div ref={observerTarget} className="h-4" />

      {isFetchingNextPage && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PostRenderer({ post }: { post: NewsFeedItemDto }) {
  switch (post.type) {
    case "DREAM":
    case "FULFILL_DONATION":
    case "SAINT_DREAMER":
      return <DreamPost post={post} />;
    case "CHARITY":
    case "WING_DONATION":
      return <CharityPost post={post} />;
    default:
      return null;
  }
}
