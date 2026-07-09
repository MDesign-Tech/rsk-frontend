import api from "./api";
import type { ApiResponse, Service } from "@/types";

export const serviceService = {
  getAll: () =>
    api.get<ApiResponse<{ services: Service[] }>>("/services").then((res) => res.data),

  get: (id: string) =>
    api.get<ApiResponse<{ service: Service }>>(`/services/${id}`).then((res) => res.data),

  create: (data: { title: string; description: string }) =>
    api
      .post<ApiResponse<{ service: Service }>>("/services", data)
      .then((res) => res.data),

  update: (id: string, data: { title: string; description: string }) =>
    api
      .put<ApiResponse<{ service: Service }>>(`/services/${id}`, data)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/services/${id}`).then((res) => res.data),
};
