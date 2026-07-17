import api from "./api";
import type { ApiResponse, TeamMember } from "@/types";

export const teamService = {
  getAll: () =>
    api.get<ApiResponse<{ teamMembers: TeamMember[] }>>("/team").then((res) => res.data),

  get: (id: string) =>
    api.get<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}`).then((res) => res.data),

  create: (data: { name: string; title: string; bio?: string }) =>
    api
      .post<ApiResponse<{ teamMember: TeamMember }>>("/team", data)
      .then((res) => res.data),

  update: (id: string, data: { name: string; title: string; bio?: string }) =>
    api
      .put<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}`, data)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/team/${id}`).then((res) => res.data),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    // Let axios/browser set the multipart boundary automatically.
    return api
      .post<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}/upload`, formData)
      .then((res) => res.data);
  },

  toggleVisibility: (id: string, visible: boolean) =>
    api
      .patch<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}/visibility`, {
        visible,
      })
      .then((res) => res.data),
};
