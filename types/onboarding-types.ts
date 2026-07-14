// Onboarding Step 1
export interface OnboardingStep1Props {
  initialValues?: {
    firstName?: string;
    lastName?: string;
    gender?: "MALE" | "FEMALE";
  };
  onNext: (data: OnboardingStep1Data) => void;
}

export interface OnboardingStep1Data {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
}

// Onboarding Step 2
export interface OnboardingStep2Props {
  initialValues?: {
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    country?: string;
    city?: string;
  };
  onNext: (data: OnboardingStep2Data) => void;
  onBack: () => void;
}

export interface OnboardingStep2Data {
  email?: string;
  phoneNumber: string;
  birthDate: string;
  country: string;
  city: string;
}

// Onboarding Step 3
export interface OnboardingStep3Props {
  initialValues?: {
    description?: string;
    photos?: File[];
  };
  onNext: (data: OnboardingStep3Data) => void;
  onBack: () => void;
}

export interface OnboardingStep3Data {
  description: string;
  photos: File[];
}

export interface OnboardingStep3FormData {
  description: string;
}

// Onboarding Step 4
export interface OnboardingStep4Values {
  description?: string;
  photos?: File[];
  dreamAmount?: number;
  isDreamAngel?: boolean;
}

export interface OnboardingStep4Data {
  description: string;
  photos: File[];
  dreamAmount?: number;
  isDreamAngel: boolean;
}

export interface OnboardingStep4Props {
  initialValues?: OnboardingStep4Values;
  onNext: (data: OnboardingStep4Data) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Onboarding Step 5
export interface OnboardingStep5Props {
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  onSubscribe?: (planId: string) => void;
  onSkip?: () => void;
}
