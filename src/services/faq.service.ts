import api from "./api";
import type { ApiResponse, FAQ } from "@/types";

export const faqService = {
  getAll: () =>
    api.get<ApiResponse<{ faqs: FAQ[] }>>("/faqs").then((res) => res.data),

  get: (id: string) =>
    api.get<ApiResponse<{ faq: FAQ }>>(`/faqs/${id}`).then((res) => res.data),

  create: (data: { question: string; answer: string }) =>
    api.post<ApiResponse<{ faq: FAQ }>>("/faqs", data).then((res) => res.data),

  update: (id: string, data: { question: string; answer: string }) =>
    api.put<ApiResponse<{ faq: FAQ }>>(`/faqs/${id}`, data).then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/faqs/${id}`).then((res) => res.data),
};
