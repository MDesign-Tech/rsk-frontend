import api from "./api";
import type { ApiResponse, User, AvailableMember } from "@/types";

export const userService = {
  getAll: () =>
    api.get<ApiResponse<{ users: User[] }>>("/users").then((res) => res.data),

  get: (id: string) =>
    api.get<ApiResponse<{ user: User }>>(`/users/${id}`).then((res) => res.data),

  getAvailableMembers: () =>
    api.get<ApiResponse<{ members: AvailableMember[] }>>("/users/available-members").then((res) => res.data),

  create: (data: {
    email: string;
    password: string;
    phone?: string;
    memberId?: string | null;
  }) => api.post<ApiResponse<{ user: User }>>("/users", data).then((res) => res.data),

  update: (
    id: string,
    data: {
      email: string;
      phone?: string;
      memberId?: string | null;
      password?: string;
    }
  ) => api.put<ApiResponse<{ user: User }>>(`/users/${id}`, data).then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/users/${id}`).then((res) => res.data),
};
