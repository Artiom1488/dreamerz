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

// CreateDreamDto - input for creating a dream
export interface CreateDreamDto {
  title: string;
  amount: number;
}

// DreamImageDto - image type used in dreams
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
