"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import {
  useUpdateUser,
  useUserDreams,
  useUploadDreamImages,
  useDeleteDreamImage,
} from "@/api/queries";
import { Separator } from "@/components/ui/separator";
import {
  PhotoCarousel,
  type PhotoItem,
} from "@/components/reusable/PhotoCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, CITIES_BY_COUNTRY } from "@/data/mock-data/onboarding";
import type { DreamDto } from "@/api/request-types";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDreamsRefresh?: () => void;
}

export function EditProfileModal({
  open,
  onOpenChange,
  onDreamsRefresh,
}: EditProfileModalProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // React Query hooks
  const updateUserMutation = useUpdateUser();
  const { data: dreamsData } = useUserDreams(
    open ? { page: 1, take: 10 } : undefined,
  );
  const uploadDreamImagesMutation = useUploadDreamImages();
  const deleteDreamImageMutation = useDeleteDreamImage();

  const dreams = dreamsData?.results || [];

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [about, setAbout] = useState(user?.description || "");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    about?: string;
  }>({});
  const [dreamDescription, setDreamDescription] = useState("");
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);

  const cityOptions = country ? CITIES_BY_COUNTRY[country] || [] : [];

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const avatarUrl =
    user?.mainImageUrl || user?.images?.[0]
      ? `${process.env.NEXT_PUBLIC_API_URL}${(user?.mainImageUrl || user?.images?.[0]).startsWith("/") ? (user?.mainImageUrl || user?.images?.[0]).slice(1) : user?.mainImageUrl || user?.images?.[0]}`
      : undefined;

  const handleSave = async () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      about?: string;
    } = {};

    if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (about.length < 10) {
      newErrors.about = "About me must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await updateUserMutation.mutateAsync({
        firstName,
        lastName,
        country,
        city,
        description: about,
      });
      setUser(data);

      // Refresh dreams before closing for smoother experience
      if (onDreamsRefresh) {
        await onDreamsRefresh();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity("");
  };

  const handleUploadDreamPhotos = async (files: File[]) => {
    if (!selectedDreamId) return;
    try {
      await uploadDreamImagesMutation.mutateAsync({
        dreamId: selectedDreamId,
        images: files,
      });
    } catch (error) {
      console.error("Error uploading dream photos:", error);
      throw error;
    }
  };

  const handleDeleteDreamPhoto = async (imageId: string) => {
    if (!selectedDreamId) return;
    try {
      await deleteDreamImageMutation.mutateAsync({
        dreamId: selectedDreamId,
        imageId,
      });
    } catch (error) {
      console.error("Error deleting dream photo:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (open && dreams.length > 0) {
      setSelectedDreamId(dreams[0].id);
      setDreamDescription(dreams[0].title || "");
    }
  }, [open, dreams]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full min-h-0">
          <DialogHeader className="px-6 py-4 border-b text-center">
            <DialogTitle className="text-lg font-semibold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="text-2xl font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Click to change avatar
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors((prev) => ({ ...prev, firstName: undefined }));
                    }}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors((prev) => ({ ...prev, lastName: undefined }));
                    }}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Select
                    value={city}
                    onValueChange={setCity}
                    disabled={!country}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          country
                            ? "Select your city"
                            : "Select a country first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cityOptions.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">About Me</label>
                <Textarea
                  value={about}
                  onChange={(e) => {
                    setAbout(e.target.value);
                    setErrors((prev) => ({ ...prev, about: undefined }));
                  }}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="resize-none"
                />
                {errors.about && (
                  <p className="text-sm text-destructive">{errors.about}</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Dream Details</h3>
                {dreams.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Dream Description
                      </label>
                      <Input
                        value={dreamDescription}
                        onChange={(e) => setDreamDescription(e.target.value)}
                        placeholder="Dream description..."
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Dream Photos
                      </label>
                      {selectedDreamId && (
                        <PhotoCarousel
                          images={
                            (dreams.find((d) => d.id === selectedDreamId)
                              ?.images as PhotoItem[]) || []
                          }
                          title="Dream Photos"
                          uploadPhoto={handleUploadDreamPhotos}
                          deletePhoto={handleDeleteDreamPhoto}
                          showAddButton={true}
                          showViewAllButton={false}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No dreams found
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t gap-2 flex justify-center items-center shrink-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="gradient_fill"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
