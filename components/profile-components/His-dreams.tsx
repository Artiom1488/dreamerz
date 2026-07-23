"use client";

import { useState, useMemo } from "react";
import { Bookmark, Heart, Pencil, Send, Share2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  PhotoCarousel,
  type PhotoItem,
} from "@/components/reusable/PhotoCarousel";

import { cn } from "@/lib/utils";
import {
  useUploadDreamImages,
  useDeleteDreamImage,
  useLikeDream,
} from "@/api/queries";
import { useUserStore } from "@/stores/user-store";

import type { DreamDto } from "@/api/request-types";
import Comments from "@/components/core/Comments";

interface HisDreamProps {
  dream: DreamDto;
  currentUserAvatarUrl?: string | null;
  isOwnProfile?: boolean;
  onEditPhotos?: () => void;
  onAddPhoto?: () => void;
  onEditDetails?: () => void;
  onToggleLike?: () => void;
  onToggleSave?: () => void;
  onShare?: () => void;
  onSend?: () => void;
  onRefresh?: () => void;
}

export default function HisDream({
  dream,
  currentUserAvatarUrl,
  isOwnProfile,
  onEditPhotos,
  onAddPhoto,
  onEditDetails,
  onToggleSave,
  onShare,
  onSend,
  onRefresh,
}: HisDreamProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const currentUser = useUserStore((state) => state.user);

  const uploadDreamImagesMutation = useUploadDreamImages();
  const deleteDreamImageMutation = useDeleteDreamImage();
  const likeDreamMutation = useLikeDream();

  const images = dream.images ?? [];
  const likesCount = dream.likedDreamsByUsers?.length ?? 0;
  const sentCount = dream.sharedCount ?? 0;
  const savedCount = dream.savedCount ?? 0;
  const progressValue = dream.progress ?? 0;

  const isLiked = useMemo(
    () =>
      dream.likedDreamsByUsers?.some((u: any) => u.id === currentUser?.id) ||
      false,
    [dream.likedDreamsByUsers, currentUser?.id],
  );
  const isSaved = dream.isSaved || false;

  const handleUploadPhotos = async (files: File[]) => {
    try {
      await uploadDreamImagesMutation.mutateAsync({
        dreamId: dream.id,
        images: files,
      });
      // PhotoCarousel calls onUploadSuccess (onRefresh) itself right after
      // this resolves, so we don't refresh here too - avoids a duplicate,
      // overlapping refresh on every upload.
    } catch (error) {
      console.error("Error uploading dream photos:", error);
      throw error;
    }
  };

  const handleDeleteDreamPhoto = async (imageId: string) => {
    if (!dream.id) return;
    try {
      await deleteDreamImageMutation.mutateAsync({
        dreamId: dream.id,
        imageId,
      });
      // PhotoCarousel calls onUploadSuccess (onRefresh) itself right after
      // this resolves - no need to duplicate it here.
    } catch (error) {
      console.error("Error deleting dream photo:", error);
    }
  };

  const handleLike = () => {
    if (dream.id) {
      likeDreamMutation.mutate(dream.id);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {/* Dream Photos */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <h2 className="text-base font-semibold">Dream Photos</h2>
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 gap-1.5 rounded-full text-xs font-medium"
              onClick={onEditPhotos}
            >
              <Pencil className="h-3.5 w-3.5" />
              edit
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <PhotoCarousel
            images={images as PhotoItem[]}
            title={dream.title}
            onAddPhoto={isOwnProfile ? onAddPhoto : undefined}
            onEditPhotos={isOwnProfile ? onEditPhotos : undefined}
            uploadPhoto={isOwnProfile ? handleUploadPhotos : undefined}
            deletePhoto={isOwnProfile ? handleDeleteDreamPhoto : undefined}
            onUploadSuccess={onRefresh}
            showViewAllButton={false}
          />
        </CardContent>
      </Card>

      {/* Dream Details */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <h2 className="text-base font-semibold">Dream Details</h2>
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 gap-1.5 rounded-full text-xs font-medium"
              onClick={onEditDetails}
            >
              <Pencil className="h-3.5 w-3.5" />
              edit
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Progress value={progressValue} className="h-2 flex-1" />
            <span className="text-sm font-medium text-muted-foreground">
              {progressValue}%
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>
              Scope{" "}
              <strong className="font-semibold">{dream.amount ?? 0}$</strong>
            </span>
            <span>
              Received{" "}
              <strong className="font-semibold">
                {dream.amountReceived ?? 0}
              </strong>
            </span>
          </div>

          <p className="text-sm font-medium text-amber-800">{dream.title}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                onClick={handleLike}
                disabled={likeDreamMutation.isPending}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={onSend}
              >
                <Send className="h-5 w-5" />
                <span>{sentCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={onShare}
              >
                <Share2 className="h-5 w-5" />
                <span>0</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-col gap-1 h-auto py-2 px-3 ${isSaved ? "text-blue-500" : ""}`}
              onClick={onToggleSave}
            >
              <Bookmark
                className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
              />
              <span className="text-xs">{savedCount}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Comments
        dreamId={dream.id}
        currentUserAvatarUrl={currentUserAvatarUrl}
      />
    </div>
  );
}
