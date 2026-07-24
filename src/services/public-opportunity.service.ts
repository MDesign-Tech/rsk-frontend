import api from "./api";
import type { ApiResponse } from "@/types";
import type { Opportunity, OpportunityType } from "@/types";

export const publicOpportunityService = {
  getAll: (params?: { page?: number; limit?: number; type?: string; category?: string }) => {
    return api.get<ApiResponse<{ opportunities: Opportunity[]; total: number; page: number; limit: number; totalPages: number }>>("/opportunities/public", { params }).then((res) => res.data);
  },

  getBySlug: (slug: string) => {
    return api.get<ApiResponse<{ opportunity: Opportunity }>>(`/opportunities/public/${slug}`).then((res) => res.data);
  },

  getByCategory: (category: string) => {
    return api.get<ApiResponse<Opportunity[]>>(`/opportunities/category/${category}`).then((res) => res.data);
  },

  getByType: (typeId: string) => {
    return api.get<ApiResponse<Opportunity[]>>(`/opportunities/type/${typeId}`).then((res) => res.data);
  },

  getTypes: () => {
    return api.get<ApiResponse<{ types: OpportunityType[] }>>("/opportunities/types").then((res) => res.data);
  },
};
