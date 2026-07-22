"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { HoverUser } from "@/components/reusable/HoverUser";
import { resolveAssetUrl } from "@/components/core/newsfeedcomp/postUtils";
import { useTimeAgo } from "@/hooks/useTimeAgo";

interface ActivityItemProps {
  activity: any;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const router = useRouter();
  const timeAgo = useTimeAgo(activity.createdAt);

  const getActivityIcon = () => {
    switch (activity.type) {
      case "LIKE":
        return <Heart className="h-5 w-5 text-red-500 fill-current" />;
      case "COMMENT":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "DONATION":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getActivityBadgeColor = () => {
    switch (activity.type) {
      case "LIKE":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "COMMENT":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "DONATION":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case "LIKE":
        return "liked a dream";
      case "COMMENT":
        return "commented on a dream";
      case "DONATION":
        return "donated to a dream";
      default:
        return "performed an action";
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleDreamClick = (dreamId: string) => {
    router.push(`/dream/${dreamId}`);
  };

  const user = activity.user || activity.actor;
  const targetDream = activity.dream || activity.targetDream;

  if (!user) return null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Activity Icon */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-100 via-amber-100 to-sky-100 dark:from-pink-900/20 dark:via-amber-900/20 dark:to-sky-900/20 flex items-center justify-center">
            {getActivityIcon()}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Avatar
              className="h-8 w-8 cursor-pointer"
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
            <div className="flex-1 min-w-0">
              <HoverUser user={user}>
                <div className="flex items-center gap-2">
                  <span
                    className="font-semibold text-sm cursor-pointer hover:underline truncate"
                    onClick={() => handleUserClick(user.id)}
                  >
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getActivityText()}
                  </span>
                </div>
              </HoverUser>
              {targetDream && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">on</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm font-semibold"
                    onClick={() => handleDreamClick(targetDream.id)}
                  >
                    {targetDream.title}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time and Type Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className={getActivityBadgeColor()} variant="secondary">
            {activity.type}
          </Badge>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
      </div>

      {/* Optional: Show dream preview if available */}
      {targetDream && targetDream.images && targetDream.images.length > 0 && (
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleDreamClick(targetDream.id)}
          >
            <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
              <img
                src={
                  resolveAssetUrl(
                    targetDream.images[0]?.url || targetDream.images[0]?.avatarUrl,
                  ) || ""
                }
                alt={targetDream.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{targetDream.title}</p>
              <p className="text-xs text-muted-foreground">
                {targetDream.amountReceived || 0} / {targetDream.amount || 0} raised
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      )}
    </Card>
  );
}
