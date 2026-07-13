import api from "./api";
import type { ApiResponse, AuthUser } from "@/types";

export const authService = {
  login: (data: { email: string; password: string }) =>
    api
      .post<ApiResponse<{ user: AuthUser }>>("/auth/login", data)
      .then((res) => res.data),

  logout: () =>
    api.post<ApiResponse<Record<string, never>>>("/auth/logout").then((res) => res.data),

  getMe: () =>
    api
      .get<ApiResponse<{ user: AuthUser }>>("/auth/me")
      .then((res) => res.data),

  // Request a password reset OTP for the given email.
  forgotPassword: (data: { email: string }) =>
    api
      .post<ApiResponse<Record<string, never>>>("/auth/forgot-password", data)
      .then((res) => res.data),

  // Verify the OTP sent to the user's email.
  verifyOTP: (data: { email: string; otp: string }) =>
    api
      .post<ApiResponse<Record<string, never>>>("/auth/verify-otp", data)
      .then((res) => res.data),

  // Resend a new OTP to the user's email.
  resendOTP: (data: { email: string }) =>
    api
      .post<ApiResponse<Record<string, never>>>("/auth/resend-otp", data)
      .then((res) => res.data),

  // Reset the password using the verified OTP.
  resetPassword: (data: { email: string; otp: string; password: string }) =>
    api
      .post<ApiResponse<Record<string, never>>>("/auth/reset-password", data)
      .then((res) => res.data),
};
