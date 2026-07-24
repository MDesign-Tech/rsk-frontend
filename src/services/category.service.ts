import api from "./api";
import type { ApiResponse } from "@/types";

export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryService = {
  getAll: () =>
    api.get<ApiResponse<{ categories: Category[] }>>("/categories").then((res) => res.data),

  getById: (id: string) =>
    api.get<ApiResponse<{ category: Category }>>(`/categories/${id}`).then((res) => res.data),

  create: (name: string) =>
    api.post<ApiResponse<{ category: Category }>>("/categories", { name }).then((res) => res.data),

  update: (id: string, name: string) =>
    api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, { name }).then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/categories/${id}`).then((res) => res.data),
};
