import api from "./api";
import type { ApiResponse } from "@/types";

export interface PublicOpportunity {
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
  benefits: string[];
  featured: boolean;
  status: "Open" | "Closed";
  visible: boolean;
  views: number;
  applicants?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export const publicOpportunityService = {
  getAll: (params?: { page?: number; limit?: number; type?: string; category?: string; featured?: boolean }) => {
    return api.get<ApiResponse<{ opportunities: PublicOpportunity[]; total: number; page: number; limit: number; totalPages: number }>>("/opportunities/public", { params }).then((res) => res.data);
  },

  getBySlug: (slug: string) => {
    return api.get<ApiResponse<{ opportunity: PublicOpportunity }>>(`/opportunities/slug/${slug}`).then((res) => res.data);
  },

  getFeatured: (limit = 3) => {
    return api.get<ApiResponse<PublicOpportunity[]>>("/opportunities/featured", { params: { limit } }).then((res) => res.data);
  },

  getByCategory: (category: string) => {
    return api.get<ApiResponse<PublicOpportunity[]>>(`/opportunities/category/${category}`).then((res) => res.data);
  },
};
