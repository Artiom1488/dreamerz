import api from "./axios";
import {
  LoginPayload,
  RegisterPayload,
  User,
  UpdateProfilePayload,
  DreamDto,
  CreateDreamDto,
  DreamImageDto,
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
  api.post("/api/v1/dreams", payload);

export const UploadImage = (payload: DreamImageDto) =>
  api.post("/api/v1/dream/{dreamId}/image", payload);

export const UploadImages = (payload: DreamImageDto[]) =>
  api.post("/api/v1/dream/{dreamId}/images", payload);

// GET

export const getRefreshToken = () => api.get("/api/v1/auth/refresh");
export const getUser = () => api.get<User>("/api/v1/auth/profile");

//PATCH
export const updateUser = (payload: UpdateProfilePayload) =>
  api.patch("/api/v1/auth/profile", payload);

//DELETE
