"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const formSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(256, "Description must be 256 characters or less"),
});

type FormValues = z.infer<typeof formSchema>;

interface OnboardingStep3Props {
  initialValues?: {
    description?: string;
    photos?: File[];
  };
  onNext: (data: { description: string; photos: File[] }) => void;
  onBack: () => void;
}

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
    resolver: zodResolver(formSchema),
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

  const onSubmit = (data: FormValues) => {
    if (photos.length === 0) {
      setPhotoError("Add at least one picture");
      return;
    }
    onNext({ description: data.description, photos });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#efeef2] p-6">
      <div className="w-full min-w-0 max-w-md space-y-5 overflow-hidden rounded-3xl bg-white p-7 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:p-8">
        {/* Back + step indicator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            step 3 of 5
          </span>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <LogoIconBlack className="h-7 w-auto dark:invert" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-center font-heading text-2xl italic font-semibold leading-snug text-slate-900">
                Add some pictures and describe yourself in few words
              </h2>

              <p className="text-center text-sm leading-snug text-muted-foreground">
                <span className="font-semibold text-slate-600">Pro Tip:</span>{" "}
                Including 3+ high-quality photos with you and adding a
                description about yourself will fasten your journey towards
                achieving your dream
              </p>

              {/* Photo slots */}
              <div className="flex justify-center gap-3">
                {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
                  const preview = previews[index];
                  return (
                    <div
                      key={index}
                      className="relative h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-teal-200 via-fuchsia-200 to-amber-200 p-[2px]"
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
                              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <UserIcon className="h-7 w-7 text-slate-300" />
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
                    className="rounded-[7px] bg-white px-8 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                <span className="text-xs text-muted-foreground">
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
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a bit about yourself..."
                        rows={5}
                        maxLength={256}
                        className="resize-none break-words rounded-xl border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
