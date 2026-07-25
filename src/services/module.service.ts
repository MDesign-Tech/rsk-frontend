import api from "./api";
import type { ApiResponse, Module } from "@/types";

export const moduleService = {
  getAll: () =>
    api.get<ApiResponse<{ modules: Module[] }>>("/modules").then((res) => res.data),

  getOne: (id: string) =>
    api.get<ApiResponse<{ module: Module }>>(`/modules/${id}`).then((res) => res.data),

  create: (data: Partial<Module>) =>
    api.post<ApiResponse<{ module: Module }>>("/modules", data).then((res) => res.data),

  update: (id: string, data: Partial<Module>) =>
    api.put<ApiResponse<{ module: Module }>>(`/modules/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/modules/${id}`).then((res) => res.data),
};
