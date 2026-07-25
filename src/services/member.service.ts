import api from "./api";
import type { ApiResponse, TeamMember } from "@/types";

export const memberService = {
  getAll: () =>
    api.get<ApiResponse<{ members: TeamMember[] }>>("/members").then((res) => res.data),

  getOne: (id: string) =>
    api.get<ApiResponse<{ member: TeamMember }>>(`/members/${id}`).then((res) => res.data),

  create: (data: Partial<TeamMember>) =>
    api.post<ApiResponse<{ member: TeamMember }>>("/members", data).then((res) => res.data),

  update: (id: string, data: Partial<TeamMember>) =>
    api.put<ApiResponse<{ member: TeamMember }>>(`/members/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/members/${id}`).then((res) => res.data),

  linkUser: (userId: string, memberId: string) =>
    api.post<ApiResponse<Record<string, never>>>(`/members/link/${userId}`, { memberId }).then((res) => res.data),

  unlinkUser: (userId: string) =>
    api.post<ApiResponse<Record<string, never>>>(`/members/unlink/${userId}`).then((res) => res.data),
};
