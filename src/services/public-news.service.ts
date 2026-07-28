import api from "./api";
import type { ApiResponse, EditorImage } from "@/types";

export interface PublicNewsArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  category: string | { _id: string; name: string };
  author: {
    _id: string;
    name: string;
    avatar: string | null;
    role: string | null;
  };
  status: "draft" | "published";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  editorImages: EditorImage[];
}

export const publicNewsService = {
  getAll: async (params?: { page?: number; limit?: number; category?: string }) => {
    const res = await api.get<ApiResponse<{ articles: PublicNewsArticle[]; total: number; page: number; limit: number; totalPages: number }>>("/news/public", { params });
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<{ article: PublicNewsArticle }>>(`/news/public/${slug}`);
    return res.data;
  },

  getByCategory: async (categoryId: string) => {
    const res = await api.get<ApiResponse<PublicNewsArticle[]>>(`/news/category/${categoryId}`);
    return res.data;
  },
};
