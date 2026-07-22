import api from "@/services/api";
import type { Opportunity } from "@/types";

export interface OpportunityListParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}

export interface OpportunityListResponse {
  opportunities: Opportunity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOpportunityInput {
  type: string;
  title: string;
  org: string;
  date: string;
  image?: File;
  status?: string;
  visible?: boolean;
  shortDescription?: string;
  description?: string;
  category?: string;
  location?: string;
  employmentType?: string | null;
  salary?: string | null;
  budget?: string | null;
  contactEmail?: string;
  contactPhone?: string;
  requirements?: string[];
  benefits?: string[];
  featured?: boolean;
}

export interface UpdateOpportunityInput {
  type?: string;
  title?: string;
  org?: string;
  date?: string;
  image?: File;
  status?: string;
  visible?: boolean;
  shortDescription?: string;
  description?: string;
  category?: string;
  location?: string;
  employmentType?: string | null;
  salary?: string | null;
  budget?: string | null;
  contactEmail?: string;
  contactPhone?: string;
  requirements?: string[];
  benefits?: string[];
  featured?: boolean;
}

function buildFormData(payload: CreateOpportunityInput | UpdateOpportunityInput): FormData {
  const formData = new FormData();
  if (payload.type) formData.append("type", payload.type);
  if (payload.title) formData.append("title", payload.title);
  if (payload.org) formData.append("org", payload.org);
  if (payload.date) formData.append("date", payload.date);
  if (payload.status) formData.append("status", payload.status);
  if (payload.visible !== undefined) formData.append("visible", String(payload.visible));
  if (payload.shortDescription) formData.append("shortDescription", payload.shortDescription);
  if (payload.description) formData.append("description", payload.description);
  if (payload.category) formData.append("category", payload.category);
  if (payload.location) formData.append("location", payload.location);
  if (payload.employmentType !== undefined && payload.employmentType !== null) formData.append("employmentType", payload.employmentType);
  if (payload.salary) formData.append("salary", payload.salary);
  if (payload.budget) formData.append("budget", payload.budget);
  if (payload.contactEmail) formData.append("contactEmail", payload.contactEmail);
  if (payload.contactPhone) formData.append("contactPhone", payload.contactPhone);
  if (payload.requirements) formData.append("requirements", JSON.stringify(payload.requirements));
  if (payload.benefits) formData.append("benefits", JSON.stringify(payload.benefits));
  if (payload.featured !== undefined) formData.append("featured", String(payload.featured));
  if (payload.image) {
    formData.append("image", payload.image);
  }
  return formData;
}

export const opportunityService = {
  async listAdmin(params: OpportunityListParams = {}): Promise<OpportunityListResponse> {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.type) search.set("type", params.type);
    if (params.status) search.set("status", params.status);
    if (params.search) search.set("search", params.search);
    if (typeof params.featured === "boolean") search.set("featured", String(params.featured));
    if (params.sort) search.set("sort", params.sort);

    const res = await api.get("/opportunities/admin", { params: search });
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) {
      return { opportunities: data, total: data.length, page: 1, limit: data.length, totalPages: 1 };
    }
    return {
      opportunities: data.opportunities ?? [],
      total: data.total ?? data.opportunities?.length ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? data.opportunities?.length ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  },

  async list(params: OpportunityListParams = {}): Promise<OpportunityListResponse> {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.type) search.set("type", params.type);
    if (params.status) search.set("status", params.status);
    if (params.search) search.set("search", params.search);
    if (typeof params.featured === "boolean") search.set("featured", String(params.featured));
    if (params.sort) search.set("sort", params.sort);

    const res = await api.get("/opportunities", { params: search });
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) {
      return { opportunities: data, total: data.length, page: 1, limit: data.length, totalPages: 1 };
    }
    return {
      opportunities: data.opportunities ?? [],
      total: data.total ?? data.opportunities?.length ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? data.opportunities?.length ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  },

  async listPublic(params: OpportunityListParams = {}): Promise<OpportunityListResponse> {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.type) search.set("type", params.type);
    if (params.search) search.set("search", params.search);
    if (typeof params.featured === "boolean") search.set("featured", String(params.featured));
    if (params.sort) search.set("sort", params.sort);

    const res = await api.get("/opportunities/public", { params: search });
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) {
      return { opportunities: data, total: data.length, page: 1, limit: data.length, totalPages: 1 };
    }
    return {
      opportunities: data.opportunities ?? [],
      total: data.total ?? data.opportunities?.length ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? data.opportunities?.length ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  },

  async getById(id: string): Promise<Opportunity> {
    const res = await api.get(`/opportunities/${id}`);
    return res.data?.data ?? res.data;
  },

  async getBySlug(slug: string): Promise<Opportunity> {
    const res = await api.get(`/opportunities/slug/${slug}`);
    return res.data?.data ?? res.data;
  },

  async getFeatured(limit = 3): Promise<Opportunity[]> {
    const res = await api.get("/opportunities/featured", { params: { limit } });
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : data.opportunities ?? [];
  },

  async create(payload: CreateOpportunityInput, image?: File): Promise<Opportunity> {
    const formData = buildFormData({ ...payload, image });
    const res = await api.post("/opportunities", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  async update(id: string, payload: UpdateOpportunityInput, image?: File): Promise<Opportunity> {
    const formData = buildFormData({ ...payload, image });
    const res = await api.put(`/opportunities/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/opportunities/${id}`);
  },

  async toggleStatus(id: string, status: string): Promise<Opportunity> {
    const res = await api.patch(`/opportunities/${id}/status`, { status });
    return res.data?.data ?? res.data;
  },
};

export default opportunityService;
