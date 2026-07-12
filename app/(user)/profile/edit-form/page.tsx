"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";

// Shape of the data collected across all onboarding steps.
// Extend this as steps 3-5 are built out.
interface OnboardingFormData {
  firstName?: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE";
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  country?: string;
  city?: string;
  description?: string;
  photos?: File[];
  dreamAmount?: number;
  isDreamAngel?: boolean;
}

const EditForm = () => {
  const user = useUserStore((state) => state.user);

  // Tracks which step is currently shown. This is what actually
  // drives navigation between steps.
  const [step, setStep] = useState(1);

  // Accumulates data from every step so it's all available when
  // you're ready to submit (and so each step can be re-opened with
  // its previous values via `initialValues`).
  const [formData, setFormData] = useState<OnboardingFormData>({
    email: user?.email, // e.g. prefilled/read-only in step 2
  });

  const handleStep1Next = (data: {
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2); // <-- this is what moves you from step 1 to step 2
  };

  const handleStep2Next = (data: {
    email?: string;
    phoneNumber: string;
    birthDate: string;
    country: string;
    city: string;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3); // <-- this is what moves you from step 2 to step 3
  };

  const handleStep2Back = () => {
    setStep(1);
  };

  const handleStep3Next = (data: { description: string; photos: File[] }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(4);
  };

  const handleStep3Back = () => {
    setStep(2);
  };

  const handleStep4Next = (data: {
    description: string;
    photos: File[];
    dreamAmount?: number;
    isDreamAngel: boolean;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(5);
  };

  const handleStep4Back = () => {
    setStep(3);
  };

  // Future: Determine starting step based on user.onboardingStatus
  const onboardingStatus = user?.onboardingStatus || null;

  if (onboardingStatus === "COMPLETED") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <p className="text-green-600">Onboarding completed!</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <OnboardingStep1 initialValues={formData} onNext={handleStep1Next} />
    );
  }

  if (step === 2) {
    return (
      <OnboardingStep2
        initialValues={formData}
        onNext={handleStep2Next}
        onBack={handleStep2Back}
      />
    );
  }

  if (step === 3) {
    return (
      <OnboardingStep3
        initialValues={formData}
        onNext={handleStep3Next}
        onBack={handleStep3Back}
      />
    );
  }

  if (step === 4) {
    return (
      <OnboardingStep4
        initialValues={formData}
        onNext={handleStep4Next}
        onBack={handleStep4Back}
      />
    );
  }

  // Step 5 isn't built yet — placeholder so navigation doesn't
  // silently dead-end once step 4 is submitted.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Step {step}</h1>
      <p className="text-muted-foreground">
        This step hasn&apos;t been built yet.
      </p>
    </div>
  );
};

export default EditForm;
