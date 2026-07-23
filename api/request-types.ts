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
  coverImage: string | CoverImageDto | null;
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

// UpdateDreamDto - input for updating a dream.
export interface UpdateDreamDto {
  title?: string;
  amount?: number;
}

// CoverImageDto - the *response* shape for a cover image, returned from the
// upload endpoint and nested on `User.coverImage`. `position` is a
// vertical pixel offset used as the CSS `object-position` Y value, saved via
// PATCH /api/v1/user/cover/image/{imageId}.
export interface CoverImageDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  avatarName: string;
  name: string;
  url?: string;
  avatarUrl: string;
  isMain?: boolean;
  position?: number;
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

// --- Pagination (GET /api/v1/auth/profile/dreams and similar list endpoints) ---

export interface PaginatedMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  meta: PaginatedMeta;
}

export interface GetUserDreamsParams {
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
  dreamStatus?: DreamDto["status"];
}

export interface GetUserDreamsByUserIdParams {
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
  dreamStatus?: DreamDto["status"];
}

// CharityImageDto - similar to DreamImageDto but for charity images
export interface CharityImageDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  avatarName: string;
  name: string;
  url?: string;
  avatarUrl: string;
  isMain?: boolean;
  charityId: string;
}

// SummaryUserDto - the compact user shape embedded throughout feed/charity
// responses (as `user`, `contributor`, likers, etc.) — not the full User DTO.
export interface SummaryUserDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  gender: "MALE" | "FEMALE" | null;
  role: string;
  mainImageUrl: string | null;
  coverImage?: CoverImageDto;
  activeAt: string | null;
  socketId: string | null;
}

// CharityDto - charity dream response shape
export interface CharityDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  description: string;
  amount: number;
  amountReceived: number;
  images: CharityImageDto[];
  user: SummaryUserDto;
  deletedAt: string | null;
  likedCharitiesByUsers: SummaryUserDto[];
  savedCount: number | null;
  sharedCount: number | null;
  isSaved: boolean;
}

// --- News feed (GET /api/v1/news-feeds) ---

// NewsFeedDreamDto - the embedded dream summary on a news feed item.
// Same shape as DreamDto, but `donations` here is a plain count, not the
// array shape seen on DreamDto elsewhere.
export interface NewsFeedDreamDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  likedDreamsByUsers: SummaryUserDto[];
  amount: number;
  amountReceived: number;
  progress: number;
  images: DreamImageDto[];
  donations: number;
  savedCount: number | null;
  sharedCount: number | null;
}

// DreamAngelDto - donor/"angel" attribution attached to DREAM-type feed items.
export interface DreamAngelDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  donationCount: string;
  userId: string;
  user: SummaryUserDto;
}

export type NewsFeedItemType =
  | "DREAM"
  | "FULFILL_DONATION"
  | "SAINT_DREAMER"
  | "CHARITY"
  | "WING_DONATION";

// NewsFeedItemDto - a single entry in the news feed. Several fields are only
// populated depending on `type` (e.g. `contributor`/`contributorId` for
// FULFILL_DONATION/SAINT_DREAMER, `dreamAngel` for DREAM, `wingDonation` for
// WING_DONATION) — left optional/nullable rather than modeled as a union
// since the API returns all keys regardless of type.
export interface NewsFeedItemDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: NewsFeedItemType;
  user: SummaryUserDto;
  newsFeedDream: NewsFeedDreamDto | null;
  dreamId: string | null;
  contributor?: SummaryUserDto | null;
  contributorId: string | null;
  charityId: string | null;
  dreamAngel?: DreamAngelDto | null;
  dreamAngelId: string | null;
  wingDonation?: unknown | null;
  wingDonationId: string | null;
  title: string | null;
  savedCount: number | null;
  sharedCount: number | null;
  isSaved: boolean;
}

export interface GetNewsFeedsParams {
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
}

// --- User search (GET /api/v1/users) ---
// Matches Swagger by name, email, or birthDay. Not paginated — returns a
// plain User[], unlike dreams/charities/news-feeds.
export interface SearchUsersParams {
  name?: string;
  email?: string;
  birthDay?: boolean;
}

export type ActivityType = "LIKE" | "COMMENT" | "DONATION" | "ALL";

export interface GetMyActivityParams {
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
}

export interface GetUserActivityParams {
  type: ActivityType;
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
}

// --- Dream comments (GET/POST /api/v1/dreams/comments) ---

// CommentDto - a single comment, possibly threaded via `parentId`/`children`.
// `children` is recursive (replies can themselves have replies).
export interface CommentDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  dreamId: string;
  user: SummaryUserDto;
  replyUserId: string | null;
  replyUser: SummaryUserDto | null;
  parentId: string | null;
  children: CommentDto[];
  repliesCount: number;
}

// Comment list responses include `commentCount` (total comment count for the
// dream) alongside the usual pagination fields, so extend PaginatedMeta
// rather than reuse it as-is.
export interface CommentsPaginatedMeta extends PaginatedMeta {
  commentCount: number;
}

export interface CommentsPaginatedResponse {
  results: CommentDto[];
  meta: CommentsPaginatedMeta;
}

export interface GetDreamCommentsParams {
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
}

// CreateCommentDto - input for posting a top-level comment or a reply.
// For a reply, set `parentId` to the root comment's id and `replyUserId` to
// the id of the user being replied to; both are null for a top-level comment.
export interface CreateCommentDto {
  message: string;
  dreamId: string;
  replyUserId: string | null;
  parentId: string | null;
}
