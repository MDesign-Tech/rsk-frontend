import { create } from "zustand";
import type { NewsArticle } from "@/types";
import { newsService, type UpsertNewsWithBlocksPayload } from "@/services/news";

interface NewsStore {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  // Fetch all articles from the backend.
  fetchArticles: () => Promise<void>;
  // Create a new article via the backend (handles image upload + slug).
  addArticle: (payload: UpsertNewsWithBlocksPayload) => Promise<NewsArticle>;
  // Update an existing article via the backend.
  updateArticle: (id: string, payload: UpsertNewsWithBlocksPayload) => Promise<NewsArticle>;
  // Delete an article via the backend.
  removeArticle: (id: string) => Promise<void>;
  // Toggle publish status via the backend.
  toggleStatus: (
    id: string,
    status: "draft" | "published" | "archived"
  ) => Promise<void>;
}

export const useNewsStore = create<NewsStore>((set, get) => ({
  articles: [],
  loading: false,
  error: null,

  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const { articles } = await newsService.list();
      set({ articles, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load news",
      });
    }
  },

  addArticle: async (payload) => {
    const created = await newsService.create(payload);
    set((state) => ({ articles: [created, ...state.articles] }));
    return created;
  },

  updateArticle: async (id, payload) => {
    const updated = await newsService.update(id, payload);
    set((state) => ({
      articles: state.articles.map((a) => (a._id === id ? updated : a)),
    }));
    return updated;
  },

  removeArticle: async (id) => {
    await newsService.remove(id);
    set((state) => ({
      articles: state.articles.filter((a) => a._id !== id),
    }));
  },

  toggleStatus: async (id, status) => {
    const updated = await newsService.update(id, { status });
    set((state) => ({
      articles: state.articles.map((a) => (a._id === id ? updated : a)),
    }));
  },
}));
