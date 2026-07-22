import api from "@/services/api";
import type { NewsArticle, ContentBlock } from "@/types";

// ---------------------------------------------------------------------------
// News API service layer
//
// All news-related operations communicate with the backend through the BFF
// proxy (/api -> backend). The backend is responsible for:
//   - automatically generating a unique slug from the title
//   - handling the featured image upload (multipart/form-data)
//   - validating that the author references an existing team member
//   - all CRUD operations
//
// The client never sends `slug` or `seo` fields, and only ever uploads a
// single featured image.
// ---------------------------------------------------------------------------

export interface NewsListParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}

export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Payload sent to the backend when creating/updating an article.
// `image` is a File when a new image is being uploaded, or undefined to keep
// the existing image (on update). The backend stores the resulting path/url.
// All fields except `image` are optional for partial updates (e.g. toggle status).
export interface UpsertNewsPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string; // team member id
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  readingTime?: number;
  image?: File;
}

// Payload that accepts block-based content (used by the editor).
export interface UpsertNewsWithBlocksPayload {
  title?: string;
  excerpt?: string;
  content?: ContentBlock[];
  category?: string;
  author?: string;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  readingTime?: number;
  image?: File;
}

// Convert block-based content to HTML string for backend storage.
export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
        case "paragraph":
          return `<p>${escapeHtml(block.content)}</p>`;
        case "image":
          return `<figure style="text-align:${block.alignment}"><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" style="border-radius:${block.borderRadius}px;width:${block.width}%" /><figcaption>${escapeHtml(block.caption)}</figcaption></figure>`;
        case "gallery":
          const imagesHtml = block.images
            .map(
              (img) =>
                `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption)}" />`
            )
            .join("");
          return `<div class="gallery" data-layout="${block.layout}">${imagesHtml}</div>`;
        case "quote":
          return `<blockquote><p>${escapeHtml(block.text)}</p><cite>${escapeHtml(block.author)}${block.position ? ` — ${escapeHtml(block.position)}` : ""}</cite></blockquote>`;
        case "bulletList":
          return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
        case "numberedList":
          return `<ol>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
        case "checklist":
          return `<ul class="checklist">${block.items.map((item) => `<li><input type="checkbox" ${item.checked ? "checked" : ""} /> ${escapeHtml(item.text)}</li>`).join("")}</ul>`;
        case "divider":
          return `<hr />`;
        case "callout":
          return `<div class="callout callout-${block.variant}">${escapeHtml(block.message)}</div>`;
        case "button":
          return `<a href="${escapeHtml(block.url)}" class="btn btn-${block.variant}">${escapeHtml(block.label)}</a>`;
        case "spacer":
          return `<div style="height:${block.height}px"></div>`;
        default:
          return "";
      }
    })
    .join("\n");
}

function escapeHtml(text: string): string {
  const amp = String.fromCharCode(38);
  return text
    .replace(/&/g, amp + "amp;")
    .replace(/</g, amp + "lt;")
    .replace(/>/g, amp + "gt;")
    .replace(/"/g, amp + "quot;")
    .replace(/'/g, amp + "#039;");
}

function buildFormData(payload: UpsertNewsPayload): FormData {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.excerpt !== undefined) formData.append("excerpt", payload.excerpt);
  if (payload.content !== undefined) formData.append("content", payload.content);
  if (payload.category !== undefined) formData.append("category", payload.category);
  if (payload.author !== undefined) formData.append("author", payload.author);
  if (payload.status !== undefined) formData.append("status", payload.status);
  if (payload.featured !== undefined) formData.append("featured", String(payload.featured));
  if (payload.readingTime !== undefined) formData.append("readingTime", String(payload.readingTime));
  if (payload.image) {
    formData.append("image", payload.image);
  }
  return formData;
}

export const newsService = {
  // List articles (admin). Supports filtering/pagination.
  async list(params: NewsListParams = {}): Promise<NewsListResponse> {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.category) search.set("category", params.category);
    if (params.status) search.set("status", params.status);
    if (params.search) search.set("search", params.search);
    if (typeof params.featured === "boolean")
      search.set("featured", String(params.featured));
    if (params.sort) search.set("sort", params.sort);

    const res = await api.get("/news", { params: search });
    const data = res.data?.data ?? res.data;
    // Normalize both paginated and plain-array responses.
    if (Array.isArray(data)) {
      return { articles: data, total: data.length, page: 1, limit: data.length, totalPages: 1 };
    }
    return {
      articles: data.articles ?? [],
      total: data.total ?? data.articles?.length ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? data.articles?.length ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  },

  // Public list of published articles.
  async listPublic(params: NewsListParams = {}): Promise<NewsListResponse> {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.category) search.set("category", params.category);
    if (params.search) search.set("search", params.search);
    if (typeof params.featured === "boolean")
      search.set("featured", String(params.featured));
    if (params.sort) search.set("sort", params.sort);

    const res = await api.get("/news/public", { params: search });
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) {
      return { articles: data, total: data.length, page: 1, limit: data.length, totalPages: 1 };
    }
    return {
      articles: data.articles ?? [],
      total: data.total ?? data.articles?.length ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? data.articles?.length ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  },

  // Get a single article by id (admin).
  async getById(id: string): Promise<NewsArticle> {
    const res = await api.get(`/news/${id}`);
    return res.data?.data ?? res.data;
  },

  // Get a single published article by slug (public).
  async getBySlug(slug: string): Promise<NewsArticle> {
    const res = await api.get(`/news/public/${slug}`);
    return res.data?.data ?? res.data;
  },

  // Featured articles (public homepage / sidebar).
  async featured(limit = 3): Promise<NewsArticle[]> {
    const res = await api.get("/news/featured", { params: { limit } });
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : data.articles ?? [];
  },

  // Create a new article (multipart/form-data for image upload).
  async create(payload: UpsertNewsWithBlocksPayload): Promise<NewsArticle> {
    const contentHtml = Array.isArray(payload.content) ? blocksToHtml(payload.content) : payload.content;
    const formData = buildFormData({ ...payload, content: contentHtml });
    const res = await api.post("/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  // Update an existing article (multipart/form-data for image upload).
  async update(id: string, payload: UpsertNewsWithBlocksPayload): Promise<NewsArticle> {
    const contentHtml = Array.isArray(payload.content) ? blocksToHtml(payload.content) : payload.content;
    const formData = buildFormData({ ...payload, content: contentHtml });
    const res = await api.put(`/news/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  // Delete an article.
  async remove(id: string): Promise<void> {
    await api.delete(`/news/${id}`);
  },

  // Toggle publish status (published <-> draft).
  async toggleStatus(
    id: string,
    status: "draft" | "published" | "archived"
  ): Promise<NewsArticle> {
    const res = await api.patch(`/news/${id}/status`, { status });
    return res.data?.data ?? res.data;
  },
};

export default newsService;
