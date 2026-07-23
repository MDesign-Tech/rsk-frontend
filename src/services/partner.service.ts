import api from "./api";
import type { ApiResponse, Partner } from "@/types";

export const partnerService = {
  getAll: () =>
    api.get<ApiResponse<{ partners: Partner[] }>>("/partners").then((res) => res.data),

  get: (id: string) =>
    api.get<ApiResponse<{ partner: Partner }>>(`/partners/${id}`).then((res) => res.data),

  create: (data: { name: string; image?: string | null; imagePublicId?: string | null; visible?: boolean }) =>
    api
      .post<ApiResponse<{ partner: Partner }>>("/partners", data)
      .then((res) => res.data),

  update: (id: string, data: { name: string; image?: string | null; imagePublicId?: string | null; visible?: boolean }) =>
    api
      .put<ApiResponse<{ partner: Partner }>>(`/partners/${id}`, data)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/partners/${id}`).then((res) => res.data),

  toggleVisibility: (id: string, visible: boolean) =>
    api
      .patch<ApiResponse<{ partner: Partner }>>(`/partners/${id}/visibility`, {
        visible,
      })
      .then((res) => res.data),
};
