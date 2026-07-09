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
};
