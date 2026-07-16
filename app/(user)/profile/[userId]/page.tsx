"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import {
  getUser,
  getUserById,
  UploadCoverImage,
  DeleteCoverImage,
  UpdateCoverImagePosition,
} from "@/api/requests";

import { User } from "@/api/request-types";

import { Button } from "@/components/ui/button";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [draftPosition, setDraftPosition] = useState(0);
  const [savingPosition, setSavingPosition] = useState(false);
  const [minOffset, setMinOffset] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const coverImgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startY: number; startPosition: number } | null>(
    null,
  );

  const recomputeMinOffset = useCallback(() => {
    const frame = frameRef.current;
    const img = coverImgRef.current;
    if (!frame || !img || !img.naturalWidth || !img.naturalHeight) return;
    const scale = frame.clientWidth / img.naturalWidth;
    const scaledHeight = img.naturalHeight * scale;
    setMinOffset(-Math.max(scaledHeight - frame.clientHeight, 0));
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    recomputeMinOffset();
    const observer = new ResizeObserver(recomputeMinOffset);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [recomputeMinOffset]);

  const navItems = getNavItems(user?.gender);

  const getPronoun = () => {
    if (!user?.gender) return "Her";
    return user.gender === "MALE" ? "His" : "Her";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let response;
        // If viewing own profile, use getUser(), otherwise use getUserById
        if (currentUser?.id === userId) {
          response = await getUser();
        } else {
          response = await getUserById(userId);
        }
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId, currentUser]);

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
    setUploading(true);
    setIsPopoverOpen(false);
    try {
      await UploadCoverImage(file);
      const response = await getUser();
      setUser(response.data);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      setError("Failed to upload cover image");
    } finally {
      setUploading(false);
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
      await DeleteCoverImage(imageId);
      const response = await getUser();
      setUser(response.data);
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
      await UpdateCoverImagePosition(
        user.coverImage.id,
        Math.abs(Math.round(draftPosition)),
      );
      const response = await getUser();
      setUser(response.data);
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

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        {error}
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
  const isOwnProfile = currentUser?.id === userId;

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
              isRepositioning && "touch-none select-none cursor-move",
            )}
          >
            <img
              ref={coverImgRef}
              src={coverUrl}
              alt="Cover"
              draggable={false}
              onLoad={recomputeMinOffset}
              className="pointer-events-none h-full w-full object-cover"
              style={{ objectPosition: `50% ${clampedPosition}px` }}
            />

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
                    disabled={uploading}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload"}
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

        <div className="pointer-events-none absolute inset-x-0 top-full hidden justify-center px-6 pt-3 md:flex md:pt-4">
          <div className="flex w-full max-w-2xl items-center justify-between">
            <StatPill label="Fulfilled" value={fulfilledCount} />
            <div className="w-32 shrink-0 lg:w-36" aria-hidden />
            <StatPill label="Received" value={receivedCount} />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
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
        </div>
      </div>

      <div className="flex flex-col items-center px-4 pt-16 sm:pt-20">
        <h1 className="text-xl font-bold sm:text-2xl">{displayName}</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground md:hidden">
          <span>
            Fulfilled{" "}
            <span className="font-semibold text-foreground">
              {fulfilledCount}
            </span>
          </span>
          <Asterisk className="h-3.5 w-3.5" />
          <span>
            Received{" "}
            <span className="font-semibold text-foreground">
              {receivedCount}
            </span>
          </span>
        </div>

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
          ) : (
            <>
              <Button
                variant="gradient_fill"
                size="lg"
                className="rounded-full px-8"
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
          )}
        </div>
      </div>

      <div className="mt-8 border-b border-border">
        <div className="flex justify-start gap-1 overflow-x-auto px-2 sm:justify-center sm:gap-2 sm:px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

      {activeTab && (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>
              {navItems.find((n) => n.id === activeTab)?.label} content will be
              implemented here
            </p>
          </div>
        </div>
      )}
      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
};

const StatPill = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
    <Asterisk className="h-4 w-4" />
    <span>{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

export default UserProfile;
