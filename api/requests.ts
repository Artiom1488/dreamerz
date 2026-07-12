import api from "./axios";
import {
  LoginPayload,
  RegisterPayload,
  User,
  UpdateProfilePayload,
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

// GET

export const getRefreshToken = () => api.get("/api/v1/auth/refresh");
export const getUser = () => api.get<User>("/api/v1/auth/profile");

//PATCH
export const updateUser = (payload: UpdateProfilePayload) =>
  api.patch("/api/v1/auth/profile", payload);

//DELETE
