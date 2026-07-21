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
import { Input } from "@/components/ui/input";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Smile,
} from "lucide-react";
import type { NewsFeedItemDto } from "@/api/request-types";
import { useUserStore } from "@/stores/user-store";

const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveAssetUrl = (path?: string | null | any) => {
  if (!path) return null;
  const urlString =
    typeof path === "object" ? path.url || path.avatarUrl : path;
  if (!urlString) return null;
  if (typeof urlString !== "string") return null;
  if (urlString.startsWith("http")) return urlString;
  const cleanPath = urlString.startsWith("/") ? urlString.slice(1) : urlString;
  return `${ASSET_BASE_URL}${cleanPath}`;
};

interface CharityPostProps {
  post: NewsFeedItemDto;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}

export function CharityPost({ post }: CharityPostProps) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(post.isSaved);
  const [comment, setComment] = useState("");

  const user = post.user;
  const title = post.title || "Charity Campaign";

  // Charity posts have similar structure to dream posts
  // Using the same fields from newsFeedDream for now
  const dream = post.newsFeedDream;
  if (!dream) return null;

  const progress = dream.progress || 0;
  const fulfilled = dream.amountReceived || 0;
  const received = dream.donations || 0;
  const likes = dream.likedDreamsByUsers?.length || 0;
  const comments = 0;
  const sent = 0;
  const savedCount = dream.savedCount || 0;

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleComment = () => {
    if (comment.trim()) {
      console.log("Submitting comment:", comment);
      setComment("");
    }
  };

  const handleShare = () => {
    console.log("Sharing post");
  };

  const handleDonate = () => {
    console.log("Donating to charity");
  };

  return (
    <Card className="overflow-hidden">
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
            <div
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => handleUserClick(user.id)}
            >
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {getTimeAgo(dream.createdAt)}
            </div>
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
            onClick={handleDonate}
          >
            Donate
          </Button>
        </div>
      </div>

      {/* Image Carousel */}
      {dream.images && dream.images.length > 0 && (
        <div className="p-4">
          <Carousel className="w-full">
            <CarouselContent>
              {dream.images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="aspect-video w-full overflow-hidden bg-muted rounded-lg">
                    <img
                      src={resolveAssetUrl(image.url || image.avatarUrl) || ""}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {dream.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Raised {fulfilled}</span>
            <span>Donations {received}</span>
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
            <Button variant="ghost" size="sm" className="gap-2">
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
            className={`gap-2 ${saved ? "text-blue-500" : ""}`}
            onClick={handleSave}
          >
            <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
            <span>{savedCount}</span>
          </Button>
        </div>

        {/* Comment Section */}
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={resolveAssetUrl(currentUser?.mainImageUrl) || undefined}
            />
            <AvatarFallback>
              {currentUser?.firstName?.[0]}
              {currentUser?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Input
              placeholder="Leave a comment.."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleComment}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
