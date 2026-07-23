import api from "./api";
import type { ApiResponse } from "@/types";

export interface Opportunity {
  _id: string;
  type: string;
  title: string;
  slug: string;
  organization: {
    name: string;
    logo?: string | null;
    website?: string | null;
  };
  image?: string | null;
  imagePublicId?: string | null;
  shortDescription: string;
  description: string;
  category: string;
  location: string;
  employmentType?: string | null;
  salary?: string | null;
  budget?: string | null;
  deadline: string;
  publishedAt?: string;
  contact: {
    email: string;
    phone: string;
  };
  requirements: string[];
  documents: {
    name: string;
    url: string;
  }[];
  benefits: string[];
  featured: boolean;
  status: "Open" | "Closed";
  visible: boolean;
  views: number;
  applicants?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOpportunityInput {
  type: string;
  title: string;
  org: string;
  shortDescription: string;
  description: string;
  category: string;
  location: string;
  employmentType?: string;
  salary?: string;
  budget?: string;
  date: string;
  contactEmail: string;
  contactPhone: string;
  requirements?: string[];
  benefits?: string[];
  featured?: boolean;
  status?: "active" | "closed";
  visible?: boolean;
  image?: string | null;
}

export interface UpdateOpportunityInput {
  type?: string;
  title?: string;
  org?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  budget?: string;
  date?: string;
  contactEmail?: string;
  contactPhone?: string;
  requirements?: string[];
  benefits?: string[];
  featured?: boolean;
  status?: "active" | "closed";
  visible?: boolean;
  image?: string | null;
}

export const opportunityService = {
  getAll: () =>
    api.get<ApiResponse<{ opportunities: Opportunity[] }>>("/opportunities/admin").then((res) => res.data),

  getById: (id: string) =>
    api.get<ApiResponse<{ opportunity: Opportunity }>>(`/opportunities/${id}`).then((res) => res.data),

  create: (data: CreateOpportunityInput) =>
    api
      .post<ApiResponse<{ opportunity: Opportunity }>>("/opportunities", data)
      .then((res) => res.data),

  update: (id: string, data: UpdateOpportunityInput) =>
    api
      .put<ApiResponse<{ opportunity: Opportunity }>>(`/opportunities/${id}`, data)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/opportunities/${id}`).then((res) => res.data),

  toggleStatus: (id: string, status: "active" | "closed") =>
    api
      .patch<ApiResponse<{ opportunity: Opportunity }>>(`/opportunities/${id}/status`, { status })
      .then((res) => res.data),
};
