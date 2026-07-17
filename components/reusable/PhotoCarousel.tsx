// PhotoCarousel.tsx
"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronRight, ImageIcon, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveAssetUrl = (path?: string | null | any) => {
  if (!path) return null;
  // Handle if path is an object with url/avatarUrl property
  const urlString =
    typeof path === "object" ? path.url || path.avatarUrl : path;
  if (!urlString) return null;
  if (typeof urlString !== "string") return null;
  if (urlString.startsWith("http")) return urlString;
  const cleanPath = urlString.startsWith("/") ? urlString.slice(1) : urlString;
  return `${ASSET_BASE_URL}${cleanPath}`;
};

export interface PhotoItem {
  id?: string;
  url?: string;
  avatarUrl?: string;
}

export interface PhotoCarouselProps {
  images: PhotoItem[];
  slots?: number;
  title?: string;
  onAddPhoto?: () => void;
  onEditPhotos?: () => void;
  onImageClick?: (index: number) => void;
  showAddButton?: boolean;
  showViewAllButton?: boolean;
  uploadPhoto?: (files: File[]) => Promise<void>;
  onUploadSuccess?: () => void;
  deletePhoto?: (imageId: string) => Promise<void>;
}

export function PhotoCarousel({
  images,
  slots = 4,
  title = "Photos",
  onAddPhoto,
  onEditPhotos,
  onImageClick,
  showAddButton = true,
  showViewAllButton = true,
  uploadPhoto,
  onUploadSuccess,
  deletePhoto,
}: PhotoCarouselProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Unique per-instance id for the hidden file input. Using useId() instead
  // of `title` avoids collisions when multiple carousels share the same
  // title (e.g. two dreams with the same name rendered in a .map()).
  const reactId = useId();
  const inputId = `photo-upload-${reactId}`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !uploadPhoto) return;

    setUploading(true);
    try {
      await uploadPhoto(files);
      await onUploadSuccess?.();
    } catch (error) {
      console.error("Error uploading photos:", error);
    } finally {
      setUploading(false);
      // allow re-selecting the same file(s) again later
      e.target.value = "";
    }
  };

  const handleDelete = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    if (!deletePhoto || !imageId) return;
    try {
      await deletePhoto(imageId);
      onUploadSuccess?.();
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleImageClick = (index: number, imageUrl: string | null) => {
    if (imageUrl) {
      if (onImageClick) {
        onImageClick(index);
      } else {
        setPreviewIndex(index);
      }
    } else if (onAddPhoto) {
      onAddPhoto();
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        ref={(el) => {
          if (el && uploadPhoto) {
            el.id = inputId;
          }
        }}
      />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: slots }).map((_, index) => {
          const image = images[index];
          const imageUrl = resolveAssetUrl(image?.avatarUrl ?? image?.url);
          const isLastSlot = index === slots - 1;

          return (
            <button
              key={image?.id ?? imageUrl ?? index}
              type="button"
              onClick={() => handleImageClick(index, imageUrl)}
              className={cn(
                "relative aspect-square w-full overflow-hidden rounded-xl group",
                !imageUrl &&
                  "bg-gradient-to-br from-violet-100 via-pink-100 to-amber-100",
              )}
            >
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  {deletePhoto && image?.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span
                        role="button"
                        aria-label="Delete photo"
                        onClick={(e) => handleDelete(e, image.id!)}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <ImageIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/70" />
              )}

              {!imageUrl && showAddButton && uploadPhoto && (
                <span
                  role="button"
                  aria-label="Add photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(inputId)?.click();
                  }}
                  className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-sm"
                >
                  {uploading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </span>
              )}

              {isLastSlot && showViewAllButton && onEditPhotos && (
                <span
                  role="button"
                  aria-label="View all photos"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPhotos();
                  }}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox for browsing uploaded photos */}
      {images.length > 0 && (
        <Dialog
          open={previewIndex !== null}
          onOpenChange={(open) => !open && setPreviewIndex(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <Carousel opts={{ startIndex: previewIndex ?? 0 }}>
              <CarouselContent>
                {images.map((img, idx) => {
                  const src = resolveAssetUrl(img.avatarUrl ?? img.url);
                  return (
                    <CarouselItem key={img.id ?? src ?? idx}>
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        {src && (
                          <Image
                            src={src}
                            alt={title}
                            fill
                            sizes="512px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
