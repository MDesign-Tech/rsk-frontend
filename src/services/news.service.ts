import api from "./api";

export interface NewsArticle {
  _id: string;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  coverImage: string | null;
  galleryImages: string[];
  category: string;
  author: {
    _id: string;
    name: string;
    role: string | null;
    avatar: string | null;
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

export interface CreateNewsInput {
  title: string;
  excerpt: string;
  content: any[];
  coverImage: string;
  category: string;
  authorId: string;
  featured?: boolean;
  status?: "draft" | "published" | "archived";
  publishedAt?: string;
  readingTime?: number;
}

export interface UpdateNewsInput {
  title?: string;
  excerpt?: string;
  content?: any[];
  coverImage?: string;
  category?: string;
  authorId?: string;
  featured?: boolean;
  status?: "draft" | "published" | "archived";
  publishedAt?: string;
  readingTime?: number;
}

export const newsService = {
  getAll: async () => {
    const res = await api.get("/news");
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/news/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get(`/news/slug/${slug}`);
    return res.data;
  },

  getFeatured: async () => {
    const res = await api.get("/news/featured");
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

  toggleFeatured: async (id: string, featured: boolean) => {
    const res = await api.patch(`/news/${id}/featured`, { featured });
    return res.data;
  },
};
