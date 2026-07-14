"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingStep3Schema } from "@/constants/zod-schemas";
import type {
  OnboardingStep3Props,
  OnboardingStep3Data,
  OnboardingStep3FormData,
} from "@/types/onboarding-types";
import { ArrowLeft, User as UserIcon, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LogoIconBlack } from "@/constants/social-icons";

const MAX_PHOTOS = 5;

type FormValues = OnboardingStep3FormData;

export function OnboardingStep3({
  initialValues,
  onNext,
  onBack,
}: OnboardingStep3Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photos, setPhotos] = useState<File[]>(initialValues?.photos || []);
  const [previews, setPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      description: initialValues?.description || "",
    },
  });

  const description = form.watch("description");
  const isValid = photos.length > 0 && description.trim().length > 0;

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);
    setPhotos((prev) => [...prev, ...incoming].slice(0, MAX_PHOTOS));
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: OnboardingStep3FormData) => {
    if (photos.length === 0) {
      setPhotoError("Add at least one picture");
      return;
    }
    onNext({ description: data.description, photos });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[#efeef2] px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full min-w-0 max-w-md space-y-4 overflow-hidden rounded-3xl bg-white p-4 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:space-y-5 sm:p-7 md:p-8">
        {/* Back + step indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap text-[10px] text-muted-foreground sm:text-xs">
            step 3 of 5
          </span>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <LogoIconBlack className="h-6 w-auto dark:invert sm:h-7" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-center font-heading text-lg italic font-semibold leading-snug text-slate-900 sm:text-xl md:text-2xl">
                Add some pictures and describe yourself in few words
              </h2>

              <p className="text-center text-[11px] leading-snug text-muted-foreground sm:text-xs md:text-sm">
                <span className="font-semibold text-slate-600">Pro Tip:</span>{" "}
                Including 3+ high-quality photos with you and adding a
                description about yourself will fasten your journey towards
                achieving your dream
              </p>

              {/* Photo slots */}
              <div className="flex justify-center gap-1.5 sm:gap-2 sm:gap-3">
                {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
                  const preview = previews[index];
                  return (
                    <div
                      key={index}
                      className="relative h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-teal-200 via-fuchsia-200 to-amber-200 p-[2px] sm:h-14 sm:w-14 md:h-16 md:w-16"
                    >
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-50">
                        {preview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt={`Photo ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-700 text-white sm:h-4 sm:w-4 md:h-5 md:w-5"
                            >
                              <X className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                            </button>
                          </>
                        ) : (
                          <UserIcon className="h-5 w-5 text-slate-300 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload button */}
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-teal-200 via-fuchsia-200 to-amber-200 p-[1.5px]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photos.length >= MAX_PHOTOS}
                    className="rounded-[7px] bg-white px-5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-2 sm:text-sm md:px-8 md:py-2.5"
                  >
                    Upload
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  *at least one picture
                </span>
                {photoError && (
                  <span className="text-xs text-destructive">{photoError}</span>
                )}
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Description*
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a bit about yourself..."
                        rows={3}
                        maxLength={256}
                        className="resize-none break-words rounded-xl border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-3 sm:py-2.5 sm:text-xs sm:rows-4 md:px-4 md:py-3 md:text-sm md:rows-5"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage />
                      <span className="ml-auto text-xs text-muted-foreground">
                        {field.value.length}/256
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="gradient_fill"
              className="w-full"
              size="lg"
              disabled={!isValid}
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
