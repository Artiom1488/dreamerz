"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import type { NewsFeedItemDto } from "@/api/request-types";
import { useUserStore } from "@/stores/user-store";
import { PricingModal } from "@/components/reusable/PricingModal";
import { HoverUser } from "@/components/reusable/HoverUser";
import { resolveAssetUrl } from "./postUtils";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import Comments from "@/components/core/Comments";
import { NewsFeedModal } from "./NewsFeedModal";
import { useLikeDream, useDreamComments } from "@/api/queries";

interface DreamPostProps {
  post: NewsFeedItemDto;
}

export function DreamPost({ post }: DreamPostProps) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const [saved, setSaved] = useState(post.isSaved);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showNewsFeedModal, setShowNewsFeedModal] = useState(false);
  const likeDreamMutation = useLikeDream();

  const dream = post.newsFeedDream;
  const user = post.user;
  const contributor = post.contributor;

  const { data: commentsData } = useDreamComments(dream?.id ?? "", {
    order: "DESC",
    page: 1,
    take: 1,
  });
  const commentCount = commentsData?.meta.commentCount || 0;

  const [liked, setLiked] = useState(
    dream?.likedDreamsByUsers?.some((u) => u.id === currentUser?.id) || false,
  );
  const [likesCount, setLikesCount] = useState(
    dream?.likedDreamsByUsers?.length || 0,
  );

  const contributorTimeAgo = useTimeAgo(post.createdAt);
  const postTimeAgo = useTimeAgo(dream?.createdAt ?? "");

  if (!dream || !user) return null;

  const progress = dream.progress || 0;
  const fulfilled = dream.amountReceived || 0;
  const received = dream.donations || 0;
  const likes = likesCount;
  const comments = commentCount;
  const sent = 0; // API doesn't provide sent count
  const savedCount = dream.savedCount || 0;

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleLike = () => {
    if (dream?.id) {
      likeDreamMutation.mutate(dream.id, {
        onSuccess: (updatedDream) => {
          const isLiked =
            updatedDream.likedDreamsByUsers?.some(
              (u: any) => u.id === currentUser?.id,
            ) || false;
          setLiked(isLiked);
          setLikesCount(updatedDream.likedDreamsByUsers?.length || 0);
        },
      });
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Sharing post");
  };

  const handleFulfill = () => {
    // Check if user has balance, if not show pricing modal
    if (currentUser?.balance === 0) {
      setShowPricingModal(true);
      return;
    }
    // TODO: Implement fulfill functionality
    console.log("Fulfilling dream");
  };

  const isFulfilled = post.type === "FULFILL_DONATION";

  return (
    <>
      <Card className={`overflow-hidden ${isFulfilled ? "pt-0" : ""}`}>
        {/* FulfilledBy Header */}
        {isFulfilled && contributor && (
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b">
            <div className="flex items-center gap-2">
              <Avatar
                className="h-8 w-8 cursor-pointer"
                onClick={() => handleUserClick(contributor.id)}
              >
                <AvatarImage
                  src={resolveAssetUrl(contributor.mainImageUrl) || undefined}
                />
                <AvatarFallback>
                  {contributor.firstName?.[0]}
                  {contributor.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <HoverUser user={contributor}>
                  <span
                    className="font-semibold text-sm cursor-pointer hover:underline"
                    onClick={() => handleUserClick(contributor.id)}
                  >
                    {contributor.firstName} {contributor.lastName}
                  </span>
                </HoverUser>
                <span className="text-sm text-muted-foreground">
                  fulfilled this dream
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {contributorTimeAgo}
            </span>
          </div>
        )}

        {/* User Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar
              className="h-10 w-10 cursor-pointer"
              onClick={() => handleUserClick(user.id)}
            >
              <AvatarImage
                src={resolveAssetUrl(user.mainImageUrl) || undefined}
              />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <HoverUser user={user}>
                <div
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.firstName} {user.lastName}
                </div>
              </HoverUser>
              <div className="text-xs text-muted-foreground">{postTimeAgo}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="default" onClick={handleShare}>
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
            <Button
              variant="gradient_fill"
              size="lg"
              className="px-8"
              onClick={handleFulfill}
            >
              Fulfill
            </Button>
          </div>
        </div>

        {/* Image Carousel */}
        {dream.images && dream.images.length > 0 && (
          <div className="p-4">
            <Carousel
              className="w-full cursor-pointer"
              onClick={() => setShowNewsFeedModal(true)}
            >
              <CarouselContent>
                {dream.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="aspect-video w-full overflow-hidden bg-muted rounded-lg">
                      <img
                        src={
                          resolveAssetUrl(image.url || image.avatarUrl) || ""
                        }
                        alt={dream.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {dream.images.length > 1 && (
                <>
                  <CarouselPrevious
                    className="left-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <CarouselNext
                    className="right-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-3 space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{dream.title}</h3>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Fulfilled {fulfilled}</span>
              <span>Received {received}</span>
            </div>
          </div>

          {/* Social Interactions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${liked ? "text-red-500" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span>{likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowNewsFeedModal(true)}
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-5 w-5" />
                <span>{sent}</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-col gap-1 h-auto py-2 px-3 ${saved ? "text-blue-500" : ""}`}
              onClick={handleSave}
            >
              <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
              <span className="text-xs">{savedCount}</span>
            </Button>
          </div>

          {/* Comments Section */}
          <Comments
            dreamId={dream.id}
            currentUserAvatarUrl={resolveAssetUrl(currentUser?.mainImageUrl)}
            compact
            onOpenModal={() => setShowNewsFeedModal(true)}
          />
        </div>
      </Card>

      <NewsFeedModal
        post={post}
        open={showNewsFeedModal}
        onOpenChange={setShowNewsFeedModal}
      />

      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
      />
    </>
  );
}
