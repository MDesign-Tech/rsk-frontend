import api from "./api";
import type { ApiResponse, ContactMessage } from "@/types";

export const contactService = {
  create: (data: { name: string; email: string; message: string }) =>
    api
      .post<ApiResponse<{ message: ContactMessage }>>("/contact", data)
      .then((res) => res.data),

  getAll: () =>
    api.get<ApiResponse<{ messages: ContactMessage[] }>>("/contact").then((res) => res.data),

  get: (id: string) =>
    api
      .get<ApiResponse<{ message: ContactMessage }>>(`/contact/${id}`)
      .then((res) => res.data),

  remove: (id: string) =>
    api
      .delete<ApiResponse<Record<string, never>>>(`/contact/${id}`)
      .then((res) => res.data),
};
