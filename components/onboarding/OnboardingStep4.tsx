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

export interface OnboardingStep4Values {
  description?: string;
  photos?: File[];
  dreamAmount?: number;
  isDreamAngel?: boolean;
}

/** Fields this step hands back via onNext. */
export interface OnboardingStep4Data {
  description: string;
  photos: File[];
  dreamAmount?: number;
  isDreamAngel: boolean;
}

export interface OnboardingStep4Props {
  /** Previously entered values, if the user is revisiting this step. */
  initialValues?: OnboardingStep4Values;
  /** Called once with the step's data — either a full dream, or just the isDreamAngel flag. */
  onNext: (data: OnboardingStep4Data) => void;
  /** Called when the person taps "back". */
  onBack: () => void;
  /** Used for the "step X of Y" label and progress marker. */
  currentStep?: number;
  totalSteps?: number;
}

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
  // Load the marker-style display font used for the headline, so this
  // component renders correctly even without extra font setup.
  useEffect(() => {
    const id = "dreamerz-permanent-marker-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap";
    document.head.appendChild(link);
  }, []);

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
    // Clean up object URLs on unmount to avoid leaking memory.
    return () => images.forEach((img) => URL.revokeObjectURL(img.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="flex min-h-screen items-center justify-center bg-[#efefef] p-6">
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-8 shadow-sm sm:p-10">
        {/* Top bar: back button, progress line, step counter */}
        <div className="mb-9 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            back
          </button>

          <div className="relative h-px flex-1 bg-gray-200">
            <IconSparkle
              className="absolute -top-[7px] h-3.5 w-3.5 -translate-x-1/2 text-gray-800"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="shrink-0 text-sm text-gray-400">
            step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <svg
            width="88"
            height="22"
            viewBox="0 0 88 22"
            fill="none"
            className="text-gray-900"
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
          <div className="mt-1 text-[13px] font-bold tracking-[0.35em] text-gray-900">
            DREAMERZ
          </div>
        </div>

        {/* Headline */}
        <h1
          className="mt-5 text-center text-[42px] leading-none text-gray-900"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          Create Your Dream
        </h1>

        {/* Pro tip */}
        <p className="mx-auto mt-6 max-w-[420px] text-center text-[15px] leading-relaxed text-gray-500">
          <span className="font-semibold text-gray-700">Pro Tip:</span> Upload
          3+ high-quality pictures that capture your dream to help others
          empathize and connect with your vision. Pairing them with an inspiring
          description will boost your chances of fulfilling your dream.
        </p>

        {/* Category icon strip — doubles as photo slots. Each box shows the
            uploaded picture at that index once you've added it, otherwise the
            gradient + icon placeholder. */}
        <div className="mt-8 flex justify-center gap-1">
          {DREAM_CATEGORY_ICONS.map((Icon, i) => {
            const img = images[i];
            return (
              <div
                key={i}
                className="group relative h-20 w-20 overflow-hidden rounded-2xl"
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
                      <Icon className="h-9 w-9" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Upload */}
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="gradient_outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
            className="rounded-full px-10 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
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
        <p className="mt-3 text-center text-sm text-gray-400">
          *at least one picture
        </p>
        {errors.images && (
          <p className="mt-1 text-center text-sm text-red-400">
            {errors.images}
          </p>
        )}

        {/* Dream description */}
        <div className="mt-8">
          <label className="mb-2 block text-[15px] font-medium text-gray-800">
            Dream Description<span className="text-gray-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            rows={6}
            placeholder="Tell your story..."
            className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-[15px] text-gray-800 placeholder:text-gray-300 focus:border-gray-300 focus:outline-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Dream amount */}
        <div className="mt-6">
          <label className="mb-2 block text-[15px] font-medium text-gray-800">
            Dream Amount<span className="text-gray-400">*</span>
          </label>
          <div className="flex items-center rounded-2xl border border-gray-200 px-4 py-3.5">
            <span className="mr-2 text-[15px] text-gray-400">$</span>
            <input
              type="number"
              min={MIN_AMOUNT}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="1500"
              className="w-full text-[15px] text-gray-800 placeholder:text-gray-300 focus:outline-none"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
          )}

          <div className="mt-2.5 space-y-1.5">
            <p className="flex items-center gap-1.5 text-[13px] text-gray-400">
              <IconInfo className="h-3.5 w-3.5 shrink-0" />
              You cannot change it later
            </p>
            <p className="flex items-center gap-1.5 text-[13px] text-gray-400">
              <IconInfo className="h-3.5 w-3.5 shrink-0" />
              At least {MIN_AMOUNT}$
            </p>
          </div>
        </div>

        {/* Create Dream */}
        <Button
          type="button"
          variant="gradient_fill"
          onClick={handleCreateDream}
          className="mt-6 w-full rounded-full py-3.5"
        >
          Create Dream
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Continue as a Dream Angel */}
        <Button
          variant="gradient_outline"
          onClick={handleContinueAsDreamAngel}
          className="w-full rounded-full py-3.5"
        >
          Continue as a Dream Angel
        </Button>

        <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-gray-400">
          <IconInfo className="mt-0.5 h-4 w-4 shrink-0" />
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