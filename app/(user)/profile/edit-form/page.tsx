// page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import {
  updateUser,
  CreateDream,
  UploadImage,
  UploadImages,
  UploadUserImages,
} from "@/api/requests";
import type { UpdateProfilePayload } from "@/api/request-types";

// TODO: confirm the real newsfeed route name (plan flagged this as TBD)
const NEWSFEED_ROUTE = "/newsfeed";

// Shape of the data collected across all onboarding steps.
// Extend this as steps 3-5 are built out.
//
// NOTE: Step 3 ("about you" bio) and Step 4 ("your dream") both collect a
// description + photos, but they are NOT the same data — they go to
// different places on the backend. They're namespaced here (bio* vs dream*)
// so they never collide/leak into each other.
interface OnboardingFormData {
  firstName?: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE";
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  country?: string;
  city?: string;
  // Step 3 — bio
  bioDescription?: string;
  bioPhotos?: File[];
  // Step 4 — dream
  dreamDescription?: string;
  dreamPhotos?: File[];
  dreamAmount?: number;
  isDreamAngel?: boolean;
  // Step 5 — subscription plan
  planId?: string;
  customAmount?: number;
}

// CreateDreamDto only accepts `title`, but Step 4 collects a free-form
// `description`. Default resolution per the plan: derive a title from it.
function deriveDreamTitle(description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= 60) return trimmed;
  return trimmed.slice(0, 57).trimEnd() + "...";
}

const EditForm = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Tracks which step is currently shown. This is what actually
  // drives navigation between steps.
  //
  // Starting step is derived from the user's existing onboardingStatus so a
  // returning user resumes where they left off instead of restarting at
  // step 1 every time.
  // NOTE: the backend only tracks 4 coarse statuses across 5 steps —
  // "WELCOME" is set once after step 1 and doesn't change again until step 4,
  // so it can't distinguish "just finished step 1" from "also finished step
  // 2/3". A returning "WELCOME" user is resumed at step 2 as the best
  // available guess. Also note: this only picks the right *step* — it
  // doesn't pre-fill step 2/3 fields (phone, country, description, etc.)
  // from what's already saved server-side, so a user resuming mid-way will
  // see those fields blank even though the backend already has the data.
  const [step, setStep] = useState<number>(() => {
    switch (user?.onboardingStatus) {
      case "WELCOME":
        return 2;
      case "USER_PROFILE":
        return 4;
      case "CREATE_DREAM":
        return 5;
      // null/undefined (never started onboarding) and "COMPLETED" (handled
      // separately below, via redirect) both fall through to step 1 here.
      default:
        return 1;
    }
  });

  // If the user has already completed onboarding (status flips to this the
  // moment they finish step 5 — see finishOnboarding() below), send them
  // straight to the newsfeed instead of ever showing onboarding.
  useEffect(() => {
    if (user?.onboardingStatus === "COMPLETED") {
      router.replace(NEWSFEED_ROUTE);
    }
  }, [user, router]);

  // Accumulates data from every step so it's all available when
  // you're ready to submit (and so each step can be re-opened with
  // its previous values via `initialValues`).
  const [formData, setFormData] = useState<OnboardingFormData>({
    email: user?.email, // e.g. prefilled/read-only in step 2
  });

  // Surfaces PATCH/POST failures so the user isn't stuck on a silently
  // broken "Continue" button. Not tied to any one step's local state.
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // NOTE: this no longer owns `submitting`/`error` itself — callers wrap it
  // so the loading state stays true across an entire chain of calls (e.g.
  // step 3's patch + photo upload), not just the first request in the chain.
  //
  // Also syncs the Zustand user store with the fresh response on every call —
  // otherwise user.onboardingStatus goes stale client-side even though the
  // backend is up to date, which is what was causing the "Skip" button to
  // bounce back to onboarding instead of reaching /newsfeed.
  async function patchProfile(payload: Partial<UpdateProfilePayload>) {
    try {
      const { data } = await updateUser(payload);
      useUserStore.getState().setUser(data);
    } catch {
      setError("Something went wrong saving your info. Please try again.");
      throw new Error("patch-failed");
    }
  }

  const handleStep1Next = async (data: {
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setSubmitting(true);
    setError(null);
    try {
      await patchProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        onboardingStatus: "WELCOME",
      });
      setStep(2); // <-- this is what moves you from step 1 to step 2
    } catch {
      // stay on step 1, error already surfaced
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2Next = async (data: {
    email?: string;
    phoneNumber: string;
    birthDate: string;
    country: string;
    city: string;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setSubmitting(true);
    setError(null);
    try {
      await patchProfile({
        phoneNumber: data.phoneNumber,
        birthday: data.birthDate, // field rename: form uses birthDate, API expects birthday
        country: data.country,
        city: data.city,
      });
      setStep(3); // <-- this is what moves you from step 2 to step 3
    } catch {
      // stay on step 2
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2Back = () => {
    setStep(1);
  };

  const handleStep3Next = async (data: {
    description: string;
    photos: File[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      bioDescription: data.description,
      bioPhotos: data.photos,
    }));
    setSubmitting(true);
    setError(null);
    try {
      await patchProfile({ description: data.description });
      if (data.photos.length > 0) {
        await UploadUserImages({ images: data.photos });
      }
      setStep(4);
    } catch {
      // stay on step 3 — error already surfaced by patchProfile, or set
      // here if the upload itself is what failed
      setError(
        (prev) => prev ?? "Something went wrong uploading your pictures.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep3Back = () => {
    setStep(2);
  };

  const handleStep4Next = async (data: {
    description: string;
    photos: File[];
    dreamAmount?: number;
    isDreamAngel: boolean;
  }) => {
    setFormData((prev) => ({
      ...prev,
      dreamDescription: data.description,
      dreamPhotos: data.photos,
      dreamAmount: data.dreamAmount,
      isDreamAngel: data.isDreamAngel,
    }));

    setSubmitting(true);
    setError(null);
    try {
      const { data: userData } = await updateUser({
        onboardingStatus: "USER_PROFILE",
      });
      useUserStore.getState().setUser(userData);

      if (!data.isDreamAngel) {
        const { data: dream } = await CreateDream({
          title: deriveDreamTitle(data.description),
          amount: data.dreamAmount ?? 0,
        });

        if (data.photos.length === 1) {
          await UploadImage({ dreamId: dream.id, image: data.photos[0] });
        } else if (data.photos.length > 1) {
          await UploadImages({ dreamId: dream.id, images: data.photos });
        }
      }
      // "Continue as a Dream Angel" skips dream creation and image upload
      // entirely — data.photos will be [] and dreamAmount undefined in that
      // case (OnboardingStep4 already enforces this before calling onNext).

      setStep(5);
    } catch {
      setError("Something went wrong setting up your dream. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep4Back = () => {
    setStep(3);
  };

  // Step 5 has NO payment/billing logic at all. Entering the step only
  // marks onboardingStatus — it does not depend on which plan (if any)
  // gets clicked.
  useEffect(() => {
    if (step === 5) {
      updateUser({ onboardingStatus: "CREATE_DREAM" })
        .then(({ data }) => {
          useUserStore.getState().setUser(data);
        })
        .catch(() => {
          // Non-blocking — the user can still see the plan screen if this fails.
        });
    }
  }, [step]);

  async function finishOnboarding() {
    setSubmitting(true);
    try {
      const { data } = await updateUser({ onboardingStatus: "COMPLETED" });
      useUserStore.getState().setUser(data);
    } catch {
      // Don't block navigation — the user already made their choice.
    } finally {
      setSubmitting(false);
      router.push(NEWSFEED_ROUTE);
    }
  }

  const handleStep5Next = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      planId,
    }));
    // No billing exists yet (plan, Open Question 6): Subscribe is a
    // temporary no-op that behaves exactly like Skip until real payment
    // logic is built. Swap this out once that's ready.
    finishOnboarding();
  };

  const handleStep5Back = () => {
    setStep(4);
  };

  const handleStep5Skip = () => {
    // Skip subscription for 7 days
    finishOnboarding();
  };

  // Render nothing while the redirect effect above is in flight — avoids
  // flashing onboarding UI for a split second before navigating away.
  if (user?.onboardingStatus === "COMPLETED") {
    return null;
  }

  let content: React.ReactNode;

  if (step === 1) {
    content = (
      <OnboardingStep1
        initialValues={formData}
        onNext={handleStep1Next}
        loading={submitting}
      />
    );
  } else if (step === 2) {
    content = (
      <OnboardingStep2
        initialValues={formData}
        onNext={handleStep2Next}
        onBack={handleStep2Back}
        loading={submitting}
      />
    );
  } else if (step === 3) {
    content = (
      <OnboardingStep3
        initialValues={{
          description: formData.bioDescription,
          photos: formData.bioPhotos,
        }}
        onNext={handleStep3Next}
        onBack={handleStep3Back}
        loading={submitting}
      />
    );
  } else if (step === 4) {
    content = (
      <OnboardingStep4
        initialValues={{
          description: formData.dreamDescription,
          photos: formData.dreamPhotos,
          dreamAmount: formData.dreamAmount,
          isDreamAngel: formData.isDreamAngel,
        }}
        onNext={handleStep4Next}
        onBack={handleStep4Back}
        loading={submitting}
      />
    );
  } else if (step === 5) {
    content = (
      <OnboardingStep5
        onBack={handleStep5Back}
        onSubscribe={handleStep5Next}
        onSkip={handleStep5Skip}
        loading={submitting}
      />
    );
  } else {
    // Fallback for any unexpected step
    content = (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Step {step}</h1>
        <p className="text-muted-foreground">
          This step hasn&apos;t been built yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="fixed inset-x-0 top-0 z-50 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
          {error}
        </div>
      )}
      {content}
    </>
  );
};

export default EditForm;
