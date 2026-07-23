import api from "./api";
import type { ApiResponse } from "@/types";

export interface PublicNewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  author: {
    _id: string;
    name: string;
    avatar: string | null;
    role: string | null;
  };
  featured: boolean;
  status: "draft" | "published" | "archived";
  publishedAt: string;
  readingTime: number;
  likes: number;
  shares: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export const publicNewsService = {
  getAll: async (params?: { page?: number; limit?: number; category?: string; featured?: boolean }) => {
    const res = await api.get<ApiResponse<{ articles: PublicNewsArticle[]; total: number; page: number; limit: number; totalPages: number }>>("/news/public", { params });
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<{ article: PublicNewsArticle }>>(`/news/public/${slug}`);
    return res.data;
  },

  getFeatured: async (limit = 3) => {
    const res = await api.get<ApiResponse<PublicNewsArticle[]>>("/news/featured", { params: { limit } });
    return res.data;
  },

  getByCategory: async (category: string) => {
    const res = await api.get<ApiResponse<PublicNewsArticle[]>>(`/news/category/${category}`);
    return res.data;
  },
};
