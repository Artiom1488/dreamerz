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

export interface DreamDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  likedDreamsByUsers?: unknown[];
  amount?: number;
  savedCount?: number | null;
  sharedCount?: number | null;
  amountReceived?: number;
  progress?: number;
  images?: DreamImageDto[];
  user?: User;
  deletedAt?: string;
  donations?: any[][];
  isSaved: boolean;
}

// CreateDreamDto - input for creating a dream.
// NOTE: backend only accepts `title` + `amount`. Step 4's form collects a
// free-form `description`, not a title, so the orchestrator derives a title
// from the first ~60 characters of the description before calling CreateDream.
export interface CreateDreamDto {
  title: string;
  amount: number;
}

// DreamImageDto - this is the *response* shape for a dream image (what you
// get back after upload), not what you send. Kept for typing API responses.
export interface DreamImageDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  avatarName: string;
  name: string;
  url?: string;
  avatarUrl: string;
  isMain?: boolean;
}

// What actually gets sent when uploading dream images (real Files via
// FormData) — distinct from DreamImageDto, which is a response shape.
export interface UploadImagePayload {
  dreamId: string;
  image: File;
}

export interface UploadImagesPayload {
  dreamId: string;
  images: File[];
}

// Step 3 bio photos — profile images, not dream images, so there's no
// dreamId involved.
export interface UploadUserImagesPayload {
  images: File[];
}

export interface ErrorResponseShape {
  exception?: { message?: string } | string;
}

export type OnboardingStatus =
  | "WELCOME"
  | "USER_PROFILE"
  | "CREATE_DREAM"
  | "COMPLETED";

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  description: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE";
  birthday: string;
  city: string;
  country: string;
  onboardingStatus: OnboardingStatus;
}
