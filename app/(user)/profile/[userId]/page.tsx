"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import {
  useUser,
  useUserById,
  useUserDreams,
  useUserDreamsByUserId,
  useUploadCoverImage,
  useDeleteCoverImage,
  useUpdateCoverImagePosition,
  useMyActivity,
  useUserActivityByUserId,
} from "@/api/queries";

import {
  User,
  DreamDto,
  PaginatedResponse,
  ActivityType,
} from "@/api/request-types";

import { Button } from "@/components/ui/button";
import HisDream from "@/components/profile-components/His-dreams";
import About from "@/components/profile-components/About";
import { ActivityItem } from "@/components/profile-components/ActivityItem";
import { PricingModal } from "@/components/reusable/PricingModal";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Asterisk, Pencil, Upload, Maximize2, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { getNavItems } from "@/data/mock-data/general-mock-data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";

import { useUserStore } from "@/stores/user-store";
import { useParams } from "next/navigation";
import { EditProfileModal } from "@/components/core/EditProfileModal";

const UserProfile = () => {
  const params = useParams();
  const userId = params.userId as string;
  const currentUser = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [draftPosition, setDraftPosition] = useState(0);
  const [savingPosition, setSavingPosition] = useState(false);
  const [minOffset, setMinOffset] = useState(0);
  const [positionPercentage, setPositionPercentage] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const coverImgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startY: number; startPosition: number } | null>(
    null,
  );

  const hasScrolledToTopOnce = useRef(false);

  const {
    data: user,
    isLoading: loading,
    error: userError,
  } = currentUser?.id === userId ? useUser() : useUserById(userId);

  // Determine if viewing own profile
  const isOwnProfile = currentUser?.id === userId;

  // Fetch dreams based on whether viewing own profile or another user's profile
  const ownDreamsQuery = useUserDreams(
    isOwnProfile && activeTab === "dream" ? { page: 1, take: 10 } : undefined,
  );
  const otherUserDreamsQuery = useUserDreamsByUserId(
    !isOwnProfile ? userId : "",
    activeTab === "dream" ? { page: 1, take: 10 } : undefined,
  );

  const dreamsData = isOwnProfile
    ? ownDreamsQuery.data
    : otherUserDreamsQuery.data;
  const dreamsLoading = isOwnProfile
    ? ownDreamsQuery.isLoading
    : otherUserDreamsQuery.isLoading;
  const dreams = dreamsData?.results || [];

  const hasLoadedDreamsOnce = useRef(false);
  if (dreams.length > 0) {
    hasLoadedDreamsOnce.current = true;
  }
  const showDreamsLoadingState = dreamsLoading && !hasLoadedDreamsOnce.current;

  // Fetch activity based on whether viewing own profile or another user's profile
  const myActivityQuery = useMyActivity(
    isOwnProfile && activeTab === "activity"
      ? { page: 1, take: 10 }
      : undefined,
  );
  const otherUserActivityQuery = useUserActivityByUserId(
    !isOwnProfile ? userId : "",
    activeTab === "activity"
      ? { type: "ALL" as ActivityType, page: 1, take: 10 }
      : { type: "ALL" as ActivityType },
  );

  const activityData = isOwnProfile
    ? myActivityQuery.data
    : otherUserActivityQuery.data;
  const activityLoading = isOwnProfile
    ? myActivityQuery.isLoading
    : otherUserActivityQuery.isLoading;
  const activities = activityData?.results || [];

  // Mutations
  const uploadCoverImageMutation = useUploadCoverImage();
  const deleteCoverImageMutation = useDeleteCoverImage();
  const updateCoverImagePositionMutation = useUpdateCoverImagePosition();

  const resolveAssetUrl = (path?: string | null | any) => {
    if (!path) return null;
    const urlString =
      typeof path === "object" ? path.url || path.avatarUrl : path;
    if (!urlString) return null;
    if (typeof urlString !== "string") return null;
    if (urlString.startsWith("http")) return urlString;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "";
    return `${base}${urlString.startsWith("/") ? urlString.slice(1) : urlString}`;
  };

  const recomputeMinOffset = useCallback(() => {
    const frame = frameRef.current;
    const img = coverImgRef.current;
    if (!frame || !img || !img.naturalWidth || !img.naturalHeight) return;
    const scale = frame.clientWidth / img.naturalWidth;
    const scaledHeight = img.naturalHeight * scale;
    setMinOffset(-Math.max(scaledHeight - frame.clientHeight, 0));
  }, []);

  const recomputePositionPercentage = useCallback(() => {
    const frame = frameRef.current;
    const img = coverImgRef.current;
    const coverImageObj =
      user?.coverImage && typeof user.coverImage !== "string"
        ? user.coverImage
        : null;
    if (
      !frame ||
      !img ||
      !img.naturalWidth ||
      !img.naturalHeight ||
      !coverImageObj
    )
      return;
    const savedPosition = -(coverImageObj.position ?? 0);
    const scale = frame.clientWidth / img.naturalWidth;
    const scaledHeight = img.naturalHeight * scale;
    const maxOffset = scaledHeight - frame.clientHeight;
    if (maxOffset <= 0) {
      setPositionPercentage(0);
      return;
    }
    const percentage = Math.abs(savedPosition) / maxOffset;
    setPositionPercentage(Math.min(1, Math.max(0, percentage)));
  }, [user?.coverImage]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    recomputeMinOffset();
    recomputePositionPercentage();
    const observer = new ResizeObserver(() => {
      recomputeMinOffset();
      recomputePositionPercentage();
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [recomputeMinOffset, recomputePositionPercentage]);

  const navItems = getNavItems(user?.gender, user?.role);

  const getPronoun = () => {
    if (!user?.gender) return "Her";
    return user.gender === "MALE" ? "His" : "Her";
  };

  const handleRefreshDreams = () => {};

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (!hasScrolledToTopOnce.current) {
      hasScrolledToTopOnce.current = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFulfillDream = () => {
    if (currentUser?.balance === 0) {
      setShowPricingModal(true);
      return;
    }
    // TODO: Implement fulfill functionality
    console.log("Fulfilling dream");
  };

  const handleUploadClick = () => {
    if (user?.coverImage) {
      toast.error(
        "You already have a cover image. Only one cover image is allowed.",
      );
      setIsPopoverOpen(false);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPopoverOpen(false);
    try {
      await uploadCoverImageMutation.mutateAsync(file);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image");
    }
  };

  const handleDelete = async () => {
    if (!user?.coverImage) {
      setIsPopoverOpen(false);
      return;
    }
    try {
      if (typeof user.coverImage === "string") return;
      const imageId = user.coverImage.id;
      await deleteCoverImageMutation.mutateAsync(imageId);
      toast.success("Cover image deleted successfully");
    } catch (error) {
      console.error("Error deleting cover image:", error);
      toast.error("Failed to delete cover image");
    } finally {
      setIsPopoverOpen(false);
    }
  };

  const handleResize = () => {
    if (!user?.coverImage || typeof user.coverImage === "string") {
      toast.error("Upload a cover image first.");
      setIsPopoverOpen(false);
      return;
    }
    setDraftPosition(-(user.coverImage.position ?? 0));
    setIsRepositioning(true);
    setIsPopoverOpen(false);
  };

  const handleCancelReposition = () => {
    setIsRepositioning(false);
  };

  const handleSavePosition = async () => {
    if (!user?.coverImage || typeof user.coverImage === "string") return;
    setSavingPosition(true);
    try {
      await updateCoverImagePositionMutation.mutateAsync({
        imageId: user.coverImage.id,
        position: Math.abs(Math.round(draftPosition)),
      });
      setIsRepositioning(false);
      toast.success("Cover position updated");
    } catch (err) {
      console.error("Error updating cover position:", err);
      toast.error("Failed to update cover position");
    } finally {
      setSavingPosition(false);
    }
  };

  const clampOffset = (n: number) => Math.min(0, Math.max(minOffset, n));

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isRepositioning) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startY: e.clientY, startPosition: draftPosition };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isRepositioning || !dragState.current) return;
    const deltaY = e.clientY - dragState.current.startY;
    setDraftPosition(clampOffset(dragState.current.startPosition + deltaY));
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  if (loading) return <ProfileSkeleton />;

  if (userError)
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Failed to load user data
      </div>
    );

  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        No user data found
      </div>
    );

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email || "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const avatarUrl =
    user.mainImageUrl || user.images?.[0]
      ? `${process.env.NEXT_PUBLIC_API_URL}${(user.mainImageUrl || user.images[0]).startsWith("/") ? (user.mainImageUrl || user.images[0]).slice(1) : user.mainImageUrl || user.images[0]}`
      : undefined;

  const coverUrl = user.coverImage
    ? typeof user.coverImage === "string"
      ? `${process.env.NEXT_PUBLIC_API_URL}${user.coverImage.startsWith("/") ? user.coverImage.slice(1) : user.coverImage}`
      : user.coverImage.url
        ? `${process.env.NEXT_PUBLIC_API_URL}${user.coverImage.url.startsWith("/") ? user.coverImage.url.slice(1) : user.coverImage.url}`
        : user.coverImage.name
          ? `/dreams-platform-bucket/${user.coverImage.name}`
          : "/hero-background.webp"
    : "/hero-background.webp";

  const fulfilledCount = 0;
  const receivedCount = 0;
  const coverImageObj =
    user.coverImage && typeof user.coverImage !== "string"
      ? user.coverImage
      : null;
  const savedPosition = -(coverImageObj?.position ?? 0);
  const displayPosition = isRepositioning ? draftPosition : savedPosition;
  const clampedPosition = Math.min(0, Math.max(minOffset, displayPosition));

  const frame = frameRef.current;
  const img = coverImgRef.current;
  let responsivePosition = clampedPosition;
  if (
    !isRepositioning &&
    frame &&
    img &&
    img.naturalWidth &&
    img.naturalHeight
  ) {
    const scale = frame.clientWidth / img.naturalWidth;
    const scaledHeight = img.naturalHeight * scale;
    const maxOffset = scaledHeight - frame.clientHeight;
    if (maxOffset > 0) {
      responsivePosition = -(positionPercentage * maxOffset);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {isPopoverOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" />
      )}
      <div className="relative">
        <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
          <div
            ref={frameRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={cn(
              "relative h-[220px] w-full overflow-hidden rounded-2xl sm:h-[300px] lg:h-[400px]",
              user?.role === "ANGEL" &&
                "p-[2px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)]",
              isRepositioning && "touch-none select-none cursor-move",
            )}
          >
            <div
              className={cn(
                "relative h-full w-full overflow-hidden rounded-2xl",
                user?.role === "ANGEL" && "bg-background",
              )}
            >
              <img
                ref={coverImgRef}
                src={coverUrl}
                alt="Cover"
                draggable={false}
                onLoad={recomputeMinOffset}
                className="pointer-events-none h-full w-full object-cover"
                style={{ objectPosition: `50% ${responsivePosition}px` }}
              />
            </div>

            {isRepositioning && (
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white">
                  Drag to reposition
                </span>
              </div>
            )}

            {isRepositioning ? (
              <div className="absolute bottom-3 right-3 z-10 flex gap-2">
                <Button
                  variant="gradient_outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleCancelReposition}
                  disabled={savingPosition}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient_fill"
                  size="sm"
                  className="rounded-full"
                  onClick={handleSavePosition}
                  disabled={savingPosition}
                >
                  {savingPosition ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : isOwnProfile ? (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-40 p-1">
                  <button
                    onClick={handleUploadClick}
                    disabled={uploadCoverImageMutation.isPending}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadCoverImageMutation.isPending
                      ? "Uploading..."
                      : "Upload"}
                  </button>
                  <button
                    onClick={handleResize}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Resize
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </PopoverContent>
              </Popover>
            ) : null}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 items-center justify-center">
          {user?.role !== "ANGEL" && (
            <div className="mr-4 hidden translate-y-6 items-center gap-1.5 text-sm text-muted-foreground sm:flex md:mr-8 md:translate-y-8">
              <Asterisk className="h-4 w-4" />
              <span>Received</span>
              <span className="font-semibold text-foreground">
                {receivedCount}
              </span>
            </div>
          )}

          {user?.role === "ANGEL" ? (
            <div className="rounded-full bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-1 shadow-sm">
              <Avatar className="h-28 w-28 border-4 border-background md:h-32 md:w-32">
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <Avatar className="h-28 w-28 border-4 border-background shadow-sm md:h-32 md:w-32">
              <AvatarImage
                src={avatarUrl}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}

          {user?.role !== "ANGEL" && (
            <div className="ml-4 hidden translate-y-6 items-center gap-1.5 text-sm text-muted-foreground sm:flex md:ml-8 md:translate-y-8">
              <Asterisk className="h-4 w-4" />
              <span>Fulfilled</span>
              <span className="font-semibold text-foreground">
                {fulfilledCount}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center px-4 pt-16 sm:pt-20">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {user?.role === "ANGEL" && (
            <div className="bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
              Dream Angel
            </div>
          )}
          <h1 className="text-xl font-bold sm:text-2xl">{displayName}</h1>
          {user?.role === "ANGEL" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Asterisk className="h-3.5 w-3.5" />
              <span>
                Fulfilled{" "}
                <span className="font-semibold text-foreground">
                  {fulfilledCount}
                </span>
              </span>
            </div>
          )}
        </div>

        {user?.role !== "ANGEL" && (
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground sm:hidden">
            <Asterisk className="h-3.5 w-3.5" />
            <span>
              Received{" "}
              <span className="font-semibold text-foreground">
                {receivedCount}
              </span>
            </span>
            <Asterisk className="h-3.5 w-3.5" />
            <span>
              Fulfilled{" "}
              <span className="font-semibold text-foreground">
                {fulfilledCount}
              </span>
            </span>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {isOwnProfile ? (
            <Button
              variant="gradient_fill"
              size="lg"
              className="rounded-full px-8"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Profile
            </Button>
          ) : user?.role !== "ANGEL" ? (
            <>
              <Button
                variant="gradient_fill"
                size="lg"
                className="rounded-full px-8"
                onClick={handleFulfillDream}
              >
                Fulfill {getPronoun()} Dream
              </Button>
              <Button
                variant="gradient_outline"
                size="lg"
                className="rounded-full px-8"
              >
                Message
              </Button>
            </>
          ) : (
            <Button
              variant="gradient_outline"
              size="lg"
              className="rounded-full px-8"
            >
              Message
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 border-b border-border">
        <div className="flex justify-start gap-1 overflow-x-auto px-2 sm:justify-center sm:gap-2 sm:px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-gradient-to-r from-pink-100 via-amber-100 to-sky-100 font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dream" ? (
        <div className="min-h-[50vh] px-4 py-8 sm:px-6 lg:px-8">
          {showDreamsLoadingState ? (
            <div className="text-center text-muted-foreground">
              Loading dreams...
            </div>
          ) : dreams.length > 0 ? (
            dreams.map((dream) => (
              <HisDream
                key={dream.id}
                dream={dream}
                currentUserAvatarUrl={
                  resolveAssetUrl(currentUser?.mainImageUrl) ||
                  resolveAssetUrl(currentUser?.images?.[0])
                }
                isOwnProfile={currentUser?.id === userId}
                onRefresh={handleRefreshDreams}
                onEditPhotos={() => setEditModalOpen(true)}
                onEditDetails={() => setEditModalOpen(true)}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No dreams yet
            </div>
          )}
        </div>
      ) : activeTab === "activity" ? (
        <div className="min-h-[50vh] px-4 py-8 sm:px-6 lg:px-8">
          {activityLoading ? (
            <div className="text-center text-muted-foreground">
              Loading activity...
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {isOwnProfile
                ? "You don't have any activity yet"
                : "This user doesn't have any activity"}
            </div>
          )}
        </div>
      ) : activeTab === "about" ? (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {user ? (
            <About
              user={user}
              isOwnProfile={isOwnProfile}
              onRefresh={handleRefreshDreams}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              Loading user info...
            </div>
          )}
        </div>
      ) : activeTab ? (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>
              {navItems.find((n) => n.id === activeTab)?.label} content will be
              implemented here
            </p>
          </div>
        </div>
      ) : null}
      <EditProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onDreamsRefresh={handleRefreshDreams}
      />
      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
      />
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-background">
    <div className="relative">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="h-[220px] w-full rounded-2xl bg-muted sm:h-[300px] lg:h-[400px]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
        <div className="h-28 w-28 rounded-full border-4 border-background bg-muted shadow-sm md:h-32 md:w-32" />
      </div>
    </div>

    <div className="flex flex-col items-center px-4 pt-16 sm:pt-20">
      <div className="h-7 w-48 rounded bg-muted" />
      <div className="mt-4 flex gap-3">
        <div className="h-11 w-40 rounded-full bg-muted" />
      </div>
    </div>

    <div className="mt-8 border-b border-border">
      <div className="flex justify-center gap-2 px-4">
        <div className="h-10 w-20 rounded-t-lg bg-muted" />
        <div className="h-10 w-20 rounded-t-lg bg-muted" />
        <div className="h-10 w-20 rounded-t-lg bg-muted" />
      </div>
    </div>

    <div className="min-h-[50vh] px-4 py-8 sm:px-6 lg:px-8" />
  </div>
);

export default UserProfile;
