import api from "./axios";
import {
  LoginPayload,
  RegisterPayload,
  User,
  UpdateProfilePayload,
  DreamDto,
  CreateDreamDto,
  UploadImagePayload,
  UploadImagesPayload,
  UploadUserImagesPayload,
} from "./request-types";

// POST

export const RegisterUser = (payload: RegisterPayload) =>
  api.post("/api/v1/auth/register", payload);

export const LoginUser = (payload: LoginPayload) =>
  api.post("/api/v1/auth/login", payload);

export const ForgotPassword = async (email: string) => {
  return await api.post("/api/v1/auth/profile/forgot-password", {
    email: email,
  });
};

export const CreateDream = (payload: CreateDreamDto) =>
  api.post<DreamDto>("/api/v1/dreams", payload);

// Real file uploads — built as FormData with actual File objects, not the
// DreamImageDto response shape (which is what you get back, not what you send).
// Field names CONFIRMED via Swagger: "image" (singular endpoint) and
// "images" as an array (plural endpoint).
export const UploadImage = ({ dreamId, image }: UploadImagePayload) => {
  const formData = new FormData();
  formData.append("image", image);
  return api.post(`/api/v1/dream/${dreamId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UploadImages = ({ dreamId, images }: UploadImagesPayload) => {
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  return api.post(`/api/v1/dream/${dreamId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Step 3 bio photos — profile images, not dream images, so this hits a
// fixed endpoint (no dreamId).
// CONFIRMED via Swagger: POST /api/v1/user/images takes an array field named
// "images" — same shape as the dream UploadImages call below. (A singular
// /api/v1/user/image endpoint also exists, but isn't used here since this
// call already handles 1-5 files in one request.)
export const UploadUserImages = ({ images }: UploadUserImagesPayload) => {
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  return api.post("/api/v1/user/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET

export const getRefreshToken = () => api.get("/api/v1/auth/refresh");
export const getUser = () => api.get<User>("/api/v1/auth/profile");

// PATCH
// Partial: each onboarding step only has a subset of profile fields.
export const updateUser = (payload: Partial<UpdateProfilePayload>) =>
  api.patch<User>("/api/v1/auth/profile", payload);

// DELETE
