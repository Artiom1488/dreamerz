"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IconShopper,
  IconPlanet,
  IconHeart,
  IconLeaf,
  IconRainbow,
  IconArrowLeft,
  IconSparkle,
  IconInfo,
} from "@/constants/social-icons";
import type {
  OnboardingStep4Props,
  OnboardingStep4Data,
  OnboardingStep4Values,
} from "@/types/onboarding-types";
/**
 * OnboardingStep4 — "Create Your Dream"
 *
 * Matches the OnboardingStep1-3 pattern used in app/.../page.tsx:
 * a named export taking `initialValues`, `onNext`, and `onBack`.
 *
 * Assumptions:
 * - Tailwind CSS is configured in the host project.
 * - The headline uses a marker/brush display face. This component loads the
 *   Google Font "Permanent Marker" itself via a <link> tag on mount, so it
 *   works standalone. If your app already manages fonts globally, feel free
 *   to delete the `useEffect` font-loader below and add the font your own way.
 * - Icons are inlined as SVGs using the exact paths from icon-shopper.svg,
 *   icon-planet.svg, icon-heart.svg, icon-leaf.svg and icon-rainbow.svg, so
 *   this file has no external asset dependencies.
 *
 * Photo uploads fill the 5 category-icon boxes directly (one image per box,
 * same "slot" pattern as OnboardingStep3's circular photo slots) — there is
 * no separate thumbnail row below the Upload button.
 */

// ---------------------------------------------------------------------------
// Shared gradient tokens (sampled from the icon SVGs: mint -> lavender -> yellow)
// ---------------------------------------------------------------------------
const GRADIENT_STOPS = ["#84FAD5", "#EBBFFF", "#F6EC85"] as const;
const GRADIENT_CSS = `linear-gradient(90deg, ${GRADIENT_STOPS.join(", ")})`;

const DREAM_CATEGORY_ICONS = [
  IconShopper,
  IconPlanet,
  IconHeart,
  IconLeaf,
  IconRainbow,
];

const MIN_AMOUNT = 150;
const MIN_IMAGES = 1;
// One slot per category icon — uploads fill these boxes directly.
const MAX_IMAGES = DREAM_CATEGORY_ICONS.length;

export function OnboardingStep4({
  initialValues,
  onNext,
  onBack,
  currentStep = 4,
  totalSteps = 5,
}: OnboardingStep4Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ file: File; url: string }[]>(() =>
    (initialValues?.photos ?? []).slice(0, MAX_IMAGES).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    })),
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [amount, setAmount] = useState(
    initialValues?.dreamAmount != null ? String(initialValues.dreamAmount) : "",
  );
  const [errors, setErrors] = useState<{
    images?: string;
    description?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    // Clean up object URLs when images change or on unmount
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const progressPercent = useMemo(
    () => Math.min(100, Math.max(0, (currentStep / totalSteps) * 100)),
    [currentStep, totalSteps],
  );

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const withUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...withUrls].slice(0, MAX_IMAGES));
    setErrors((prev) => ({ ...prev, images: undefined }));
    e.target.value = ""; // allow re-selecting the same file
  }

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function validate(): boolean {
    const nextErrors: typeof errors = {};
    if (images.length < MIN_IMAGES)
      nextErrors.images = "Add at least one picture.";
    if (!description.trim())
      nextErrors.description = "Tell us about your dream.";
    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount < MIN_AMOUNT) {
      nextErrors.amount = `Enter at least $${MIN_AMOUNT}.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleCreateDream() {
    if (!validate()) return;
    onNext({
      photos: images.map((i) => i.file),
      description,
      dreamAmount: Number(amount),
      isDreamAngel: false,
    });
  }

  function handleContinueAsDreamAngel() {
    // Dream Angels skip the dream fields entirely — no photos, description,
    // or amount required.
    onNext({
      photos: [],
      description: "",
      dreamAmount: undefined,
      isDreamAngel: true,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[#efefef] px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-4 shadow-sm sm:p-8 md:p-10">
        {/* Top bar: back button, progress line, step counter */}
        <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3 md:mb-9 md:gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2"
          >
            <IconArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            back
          </button>

          <div className="relative h-px flex-1 bg-gray-200">
            <IconSparkle
              className="absolute -top-[7px] h-3.5 w-3.5 -translate-x-1/2 text-gray-800"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="shrink-0 text-[10px] text-gray-400 sm:text-xs md:text-sm">
            step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <svg
            width="64"
            height="16"
            viewBox="0 0 88 22"
            fill="none"
            className="text-gray-900 sm:w-[72px] sm:h-[18px] md:w-[88px] md:h-[22px]"
          >
            <path
              d="M3 18C18 2 58 2 74 13"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
            <path
              d="M82 3L83.4 6.6L87 8L83.4 9.4L82 13L80.6 9.4L77 8L80.6 6.6L82 3Z"
              fill="currentColor"
            />
          </svg>
          <div className="mt-1 text-[10px] font-bold tracking-[0.35em] text-gray-900 sm:text-[11px] md:text-[13px]">
            DREAMERZ
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-3 text-center font-indie-flower text-[28px] leading-none text-gray-900 sm:mt-4 sm:text-[32px] md:mt-5 md:text-[42px]">
          Create Your Dream
        </h1>

        {/* Pro tip */}
        <p className="mx-auto mt-3 max-w-[420px] text-center text-[12px] leading-relaxed text-gray-500 sm:mt-4 sm:text-[13px] md:mt-6 md:text-[15px]">
          <span className="font-semibold text-gray-700">Pro Tip:</span> Upload
          3+ high-quality pictures that capture your dream to help others
          empathize and connect with your vision. Pairing them with an inspiring
          description will boost your chances of fulfilling your dream.
        </p>

        {/* Category icon strip — doubles as photo slots. Each box shows the
            uploaded picture at that index once you've added it, otherwise the
            gradient + icon placeholder. */}
        <div className="mt-4 flex justify-center gap-1 sm:mt-6 sm:gap-1 md:mt-8">
          {DREAM_CATEGORY_ICONS.map((Icon, i) => {
            const img = images[i];
            return (
              <div
                key={i}
                className="group relative h-14 w-14 overflow-hidden rounded-2xl sm:h-16 sm:w-16 md:h-20 md:w-20"
              >
                {img ? (
                  <>
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove picture"
                      className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs leading-none text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: GRADIENT_CSS,
                        backgroundSize: `${DREAM_CATEGORY_ICONS.length * 80}px 100%`,
                        backgroundPosition: `${-i * 80}px 0`,
                      }}
                    />
                    <div className="absolute inset-0 bg-white/55" />
                    <div className="relative flex h-full w-full items-center justify-center">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Upload */}
        <div className="mt-4 flex justify-center sm:mt-6 md:mt-8">
          <Button
            type="button"
            variant="gradient_outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
            className="rounded-full px-6 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-2 sm:text-sm md:px-10 md:py-2.5"
          >
            Upload
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />
        <p className="mt-1.5 text-center text-[10px] text-gray-400 sm:mt-2 sm:text-xs md:mt-3 md:text-sm">
          *at least one picture
        </p>
        {errors.images && (
          <p className="mt-1 text-center text-sm text-red-400">
            {errors.images}
          </p>
        )}

        {/* Dream description */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <label className="mb-2 block text-[12px] font-medium text-gray-800 sm:text-[13px] md:text-[15px]">
            Dream Description<span className="text-gray-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            rows={3}
            placeholder="Tell your story..."
            className="w-full resize-none rounded-2xl border border-gray-200 p-2.5 text-[12px] text-gray-800 placeholder:text-gray-300 focus:border-gray-300 focus:outline-none sm:rows-4 sm:p-3 sm:text-[13px] md:rows-6 md:p-4 md:text-[15px]"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Dream amount */}
        <div className="mt-3 sm:mt-4 md:mt-6">
          <label className="mb-2 block text-[12px] font-medium text-gray-800 sm:text-[13px] md:text-[15px]">
            Dream Amount<span className="text-gray-400">*</span>
          </label>
          <div className="flex items-center rounded-2xl border border-gray-200 px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3.5">
            <span className="mr-2 text-[12px] text-gray-400 sm:text-[13px] md:text-[15px]">
              $
            </span>
            <input
              type="number"
              min={MIN_AMOUNT}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="1500"
              className="w-full text-[12px] text-gray-800 placeholder:text-gray-300 focus:outline-none sm:text-[13px] md:text-[15px]"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
          )}

          <div className="mt-1.5 space-y-1 sm:mt-2 sm:space-y-1.5 md:mt-2.5 md:space-y-1.5">
            <p className="flex items-center gap-1.5 text-[10px] text-gray-400 sm:text-[11px] md:text-[13px]">
              <IconInfo className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              You cannot change it later
            </p>
            <p className="flex items-center gap-1.5 text-[10px] text-gray-400 sm:text-[11px] md:text-[13px]">
              <IconInfo className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              At least {MIN_AMOUNT}$
            </p>
          </div>
        </div>

        {/* Create Dream */}
        <Button
          type="button"
          variant="gradient_fill"
          onClick={handleCreateDream}
          className="mt-3 w-full rounded-full py-2.5 sm:mt-4 sm:py-3 md:mt-6 md:py-3.5"
        >
          Create Dream
        </Button>

        {/* Divider */}
        <div className="my-3 flex items-center gap-2 sm:my-4 sm:gap-3 md:my-6 md:gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[10px] text-gray-400 sm:text-xs md:text-sm">
            or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Continue as a Dream Angel */}
        <Button
          variant="gradient_outline"
          onClick={handleContinueAsDreamAngel}
          className="w-full rounded-full py-2.5 sm:py-3 md:py-3.5"
        >
          Continue as a Dream Angel
        </Button>

        <p className="mt-2.5 flex gap-2 text-[10px] leading-relaxed text-gray-400 sm:mt-3 sm:text-[11px] md:mt-4 md:text-[13px]">
          <IconInfo className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          <span>
            A Dream Angel is a person who has not set a dream [yet]. They only
            donate to others, but accumulate dream points for any future dream,
            as well as gratitude and admiration from thousands of people.
          </span>
        </p>
      </div>
    </div>
  );
}
