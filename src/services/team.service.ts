import api from "./api";
import type { ApiResponse, TeamMember } from "@/types";

export const teamService = {
  getAll: () =>
    api.get<ApiResponse<{ teamMembers: TeamMember[] }>>("/team").then((res) => res.data),

  get: (id: string) =>
    api.get<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}`).then((res) => res.data),

  create: (formData: FormData) =>
    api
      .post<ApiResponse<{ teamMember: TeamMember }>>("/team", formData)
      .then((res) => res.data),

  update: (id: string, formData: FormData) =>
    api
      .put<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}`, formData)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/team/${id}`).then((res) => res.data),

  toggleVisibility: (id: string, visible: boolean) =>
    api
      .patch<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}/visibility`, {
        visible,
      })
      .then((res) => res.data),
};
