"use client";

import { useState } from "react";
import { Calendar, Globe, MapPin, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PhotoCarousel,
  type PhotoItem,
} from "@/components/reusable/PhotoCarousel";

import { useUploadUserImages, useDeleteUserImage } from "@/api/queries";
import { COUNTRIES } from "@/data/mock-data/onboarding";
import type { User } from "@/api/request-types";

const PHOTO_SLOTS = 4;

// Mirrors the same URL-building logic already used for the avatar in
// EditProfileModal.tsx: NEXT_PUBLIC_API_URL + the path with its leading slash stripped.
const resolveAssetUrl = (path?: string | null | any) => {
  if (!path) return null;
  // Handle if path is an object with url/avatarUrl property
  const urlString =
    typeof path === "object" ? path.url || path.avatarUrl : path;
  if (!urlString) return null;
  if (typeof urlString !== "string") return null;
  if (urlString.startsWith("http")) return urlString;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}${urlString.startsWith("/") ? urlString.slice(1) : urlString}`;
};

// Normalizes a raw image entry (string URL, or object with id/url/avatarUrl)
// into a consistent { id, url } shape. Returns null if there's nothing usable.
const normalizePhoto = (img: unknown): { id: string; url: string } | null => {
  if (!img) return null;
  if (typeof img === "string") {
    return { id: img, url: img };
  }
  if (typeof img === "object") {
    const obj = img as any;
    const url = obj.url || obj.avatarUrl;
    if (!url) return null;
    return { id: obj.id || url, url };
  }
  return null;
};

const formatBirthday = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatGender = (value?: string | null) => {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const formatCountry = (code?: string | null) => {
  if (!code) return "—";
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
};

interface AboutProps {
  user: User;
  onAddPhoto?: () => void;
  onViewAllPhotos?: () => void;
  onRefresh?: () => void;
}

export default function About({
  user,
  onAddPhoto,
  onViewAllPhotos,
  onRefresh,
}: AboutProps) {
  const uploadUserImagesMutation = useUploadUserImages();
  const deleteUserImageMutation = useDeleteUserImage();
  const [uploading, setUploading] = useState(false);

  // Normalize and dedupe profile images
  const rawPhotos = (user.images ?? [])
    .map(normalizePhoto)
    .filter((p): p is { id: string; url: string } => p !== null);

  const seenUrls = new Set<string>();
  const photos = rawPhotos.filter(({ url }) => {
    const resolved = resolveAssetUrl(url) ?? url;
    if (seenUrls.has(resolved)) return false;
    seenUrls.add(resolved);
    return true;
  });

  const handleUploadPhotos = async (files: File[]) => {
    setUploading(true);
    try {
      await uploadUserImagesMutation.mutateAsync({ images: files });
      // PhotoCarousel calls onUploadSuccess (onRefresh) itself right after
      // this resolves, so we don't refresh here too - avoids a duplicate,
      // overlapping refresh on every upload.
    } catch (error) {
      console.error("Error uploading user photos:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (imageId: string) => {
    try {
      await deleteUserImageMutation.mutateAsync(imageId);
      // PhotoCarousel calls onUploadSuccess (onRefresh) itself right after
      // this resolves - no need to duplicate it here.
    } catch (error) {
      console.error("Error deleting user photo:", error);
    }
  };

  const stats = [
    { icon: UserRound, label: "Gender:", value: formatGender(user.gender) },
    {
      icon: Calendar,
      label: "Birthday:",
      value: formatBirthday(user.birthday),
    },
    { icon: Globe, label: "Country:", value: formatCountry(user.country) },
    { icon: MapPin, label: "City:", value: user.city || "—" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {/* Biography */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <h2 className="text-base font-semibold">Biography</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-center">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Icon className="h-5 w-5 text-violet-300" />
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Pictures */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <h2 className="text-base font-semibold">Profile Pictures</h2>
        </CardHeader>
        <CardContent>
          <PhotoCarousel
            images={photos}
            title="Profile Photos"
            onAddPhoto={onAddPhoto}
            onEditPhotos={onViewAllPhotos}
            showViewAllButton={!!onViewAllPhotos}
            uploadPhoto={handleUploadPhotos}
            deletePhoto={handleDeletePhoto}
            onUploadSuccess={onRefresh}
          />
        </CardContent>
      </Card>

      {/* About Me */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <h2 className="text-base font-semibold">About Me</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {user.description?.trim() ? user.description : "No bio yet."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
