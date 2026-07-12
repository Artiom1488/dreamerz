export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  birthday: string | null;
  city: string | null;
  country: string | null;
  coverImage: string | null;
  createdAt: string;
  description: string | null;
  gender: string | null;
  images: string[];
  isEmailConfirmed: boolean;
  mainImageUrl: string | null;
  monthlySubscriptionId: string | null;
  monthlySubscriptionStatus: string | null;
  onboardingStatus: string | null;
  phoneNumber: string | null;
  role: string;
  stripeCustomerId: string | null;
  stripeProductId: string | null;
  updatedAt: string;
}

export interface ErrorResponseShape {
  exception?: { message?: string } | string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  description: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE";
  birthday: string;
  city: string;
  country: string;
  onboardingStatus: "WELCOME";
}
