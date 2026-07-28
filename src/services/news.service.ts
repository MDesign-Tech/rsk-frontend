import api from "./api";
import type { EditorImage } from "@/types";

export interface NewsArticle {
  _id: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  coverImagePublicId: string | null;
  gallery: string[];
  category: string | { _id: string; name: string };
  author: {
    _id: string;
    name: string;
    role: string | null;
    avatar: string | null;
  };
  status: "draft" | "published";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  editorImages: EditorImage[];
}

export interface CreateNewsInput {
  title: string;
  content: string;
  coverImage: string | null;
  coverImagePublicId: string | null;
  category: string;
   authorId: string | null;
  isRsk?: boolean;
  status?: "draft" | "published";
  editorImages?: EditorImage[];
}

export interface UpdateNewsInput {
  title?: string;
  content?: string;
  coverImage?: string | null;
  coverImagePublicId?: string | null;
  category?: string;
   authorId?: string | null;
  isRsk?: boolean;
  status?: "draft" | "published";
  editorImages?: EditorImage[];
}

export const newsService = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const res = await api.get("/news", { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/news/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get(`/news/public/${slug}`);
    return res.data;
  },

  getByCategory: async (category: string) => {
    const res = await api.get(`/news/category/${category}`);
    return res.data;
  },

  create: async (data: CreateNewsInput) => {
    const res = await api.post("/news", data);
    return res.data;
  },

  update: async (id: string, data: UpdateNewsInput) => {
    const res = await api.put(`/news/${id}`, data);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete(`/news/${id}`);
    return res.data;
  },

  toggleStatus: async (id: string, status: "draft" | "published") => {
    const res = await api.patch(`/news/${id}/status`, { status });
    return res.data;
  },
};
