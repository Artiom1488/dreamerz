"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
 */

// ---------------------------------------------------------------------------
// Shared gradient tokens (sampled from the icon SVGs: mint -> lavender -> yellow)
// ---------------------------------------------------------------------------
const GRADIENT_STOPS = ["#84FAD5", "#EBBFFF", "#F6EC85"] as const;
const GRADIENT_CSS = `linear-gradient(90deg, ${GRADIENT_STOPS.join(", ")})`;

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
type IconProps = { className?: string; style?: React.CSSProperties };

function IconArrowLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSparkle({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconInfo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={1.4} />
      <path
        d="M12 11V16.2"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function IconShopper({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M49.4989 22.2932H16.1687C14.8446 22.2932 13.7147 23.2504 13.497 24.5564L8.98284 51.6415C8.70768 53.2925 9.98079 54.7953 11.6545 54.7953H54.0131C55.6868 54.7953 56.9599 53.2925 56.6847 51.6415L52.1706 24.5564C51.9529 23.2504 50.8229 22.2932 49.4989 22.2932Z"
        stroke="url(#shopper_a)"
        strokeWidth={4.02407}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22.2928C22 16.3093 26.8506 11.4587 32.834 11.4587C38.8175 11.4587 43.6681 16.3093 43.6681 22.2928"
        stroke="url(#shopper_b)"
        strokeWidth={4.02407}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="shopper_a"
          x1="19.18"
          y1="8.36"
          x2="54.98"
          y2="32.83"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="shopper_b"
          x1="26.64"
          y1="6.82"
          x2="39.42"
          y2="18.70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconPlanet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M33.1603 54.7949C45.1272 54.7949 54.8283 45.0938 54.8283 33.1268C54.8283 21.1599 45.1272 11.4587 33.1603 11.4587C21.1933 11.4587 11.4922 21.1599 11.4922 33.1268C11.4922 45.0938 21.1933 54.7949 33.1603 54.7949Z"
        stroke="url(#planet_a)"
        strokeWidth={4.02407}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.7033 15.792C52.1471 14.8985 56.2204 15.6058 57.6797 18.1334C60.6714 23.3153 51.5448 34.1855 37.2947 42.4128C23.0446 50.64 9.0674 53.1089 6.07567 47.927C4.36845 44.97 6.6074 40.1607 11.4927 35.0472"
        stroke="url(#planet_b)"
        strokeWidth={4.02407}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="planet_a"
          x1="20.77"
          y1="-7.11"
          x2="59.95"
          y2="11.10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="planet_b"
          x1="16.80"
          y1="0.33"
          x2="55.86"
          y2="27.52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M33.1578 54.7949C33.1578 54.7949 8.78125 41.2184 8.78125 24.9264C8.78125 8.63437 27.7408 7.27671 33.1578 20.0236C38.5749 7.27671 57.5344 8.63437 57.5344 24.9264C57.5344 41.2184 33.1578 54.7949 33.1578 54.7949Z"
        stroke="url(#heart_a)"
        strokeWidth={4.02407}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="heart_a"
          x1="19.22"
          y1="-7.11"
          x2="61.31"
          y2="14.90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconLeaf({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M19.1345 46.8429C7.65439 27.7095 22.9612 12.4027 51.6614 14.3161C53.5746 43.0161 38.2679 58.323 19.1345 46.8429Z"
        stroke="url(#leaf_a)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1836 51.7914L29.4904 36.4846"
        stroke="url(#leaf_b)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="leaf_a"
          x1="23.12"
          y1="-1.50"
          x2="56.14"
          y2="13.85"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="leaf_b"
          x1="17.46"
          y1="29.92"
          x2="31.30"
          y2="36.36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconRainbow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M57.4715 46.625V41.2133C57.4715 27.7635 46.5683 16.8604 33.1185 16.8604C19.6688 16.8604 8.76562 27.7635 8.76562 41.2133V46.625"
        stroke="url(#rainbow_a)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49.3573 46.6251V41.2133C49.3573 32.2468 42.0885 24.978 33.122 24.978C24.1555 24.978 16.8867 32.2468 16.8867 41.2133V46.6251"
        stroke="url(#rainbow_b)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.2392 46.6249V41.2131C41.2392 36.7299 37.6048 33.0955 33.1215 33.0955C28.6383 33.0955 25.0039 36.7299 25.0039 41.2131V46.6249"
        stroke="url(#rainbow_c)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="rainbow_a"
          x1="19.20"
          y1="4.10"
          x2="53.12"
          y2="29.91"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="rainbow_b"
          x1="23.84"
          y1="15.70"
          x2="47.86"
          y2="32.45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="rainbow_c"
          x1="28.48"
          y1="27.30"
          x2="42.09"
          y2="34.89"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const DREAM_CATEGORY_ICONS = [
  IconShopper,
  IconPlanet,
  IconHeart,
  IconLeaf,
  IconRainbow,
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

/** Pill button with a gradient border and white fill, e.g. "Upload" / "Continue as a Dream Angel" */
function GradientOutlineButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div
      className="rounded-full p-[1.5px]"
      style={{ backgroundImage: GRADIENT_CSS }}
    >
      <button
        {...rest}
        className={`w-full rounded-full bg-white text-[15px] font-medium text-gray-800 transition-colors hover:bg-gray-50 ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** Fields this step can prefill from, e.g. when re-opening a saved draft. */
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
    (initialValues?.photos ?? []).map((file) => ({
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
    setImages((prev) => [...prev, ...withUrls]);
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

        {/* Category icon strip */}
        <div className="mt-8 flex justify-center gap-1">
          {DREAM_CATEGORY_ICONS.map((Icon, i) => (
            <div
              key={i}
              className="relative h-20 w-20 overflow-hidden rounded-2xl"
            >
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
            </div>
          ))}
        </div>

        {/* Upload */}
        <div className="mt-8 flex justify-center">
          <div
            className="rounded-full p-[1.5px]"
            style={{ backgroundImage: GRADIENT_CSS }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-white px-10 py-2.5 text-[15px] font-medium text-gray-800 transition-colors hover:bg-gray-50"
            >
              Upload
            </button>
          </div>
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

        {/* Uploaded thumbnails */}
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {images.map((img, i) => (
              <div
                key={img.url}
                className="group relative h-16 w-16 overflow-hidden rounded-xl"
              >
                <img
                  src={img.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Remove picture"
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] leading-none text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
        <button
          type="button"
          onClick={handleCreateDream}
          className="mt-6 w-full rounded-full py-3.5 text-[15px] font-semibold text-gray-900 transition-opacity hover:opacity-90"
          style={{ backgroundImage: GRADIENT_CSS }}
        >
          Create Dream
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Continue as a Dream Angel */}
        <GradientOutlineButton
          onClick={handleContinueAsDreamAngel}
          className="py-3.5"
        >
          Continue as a Dream Angel
        </GradientOutlineButton>

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
