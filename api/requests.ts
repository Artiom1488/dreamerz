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
import { useAuthStore } from "@/stores/auth-store";

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

// Real file uploads
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

// Step 3 bio photos
export const UploadUserImages = ({ images }: UploadUserImagesPayload) => {
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  return api.post("/api/v1/user/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UploadCoverImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/api/v1/user/cover/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET

export const getRefreshToken = () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  return api.get("/api/v1/auth/refresh", {
    headers: {
      Authorization: "Bearer " + refreshToken,
    },
  });
};
export const getUser = () => api.get<User>("/api/v1/auth/profile");

export const getUserById = (userId: string) =>
  api.get<User>(`/api/v1/users/${userId}`);

// PATCH
export const updateUser = (payload: Partial<UpdateProfilePayload>) =>
  api.patch<User>("/api/v1/auth/profile", payload);

export const UpdateCoverImagePosition = (imageId: string, position: number) =>
  api.patch(`/api/v1/user/cover/image/${imageId}`, {
    coverImagePosition: position,
  });

// DELETE

export const DeleteCoverImage = (imageId: string) => {
  return api.delete(`/api/v1/user/cover/image/${imageId}`);
};
