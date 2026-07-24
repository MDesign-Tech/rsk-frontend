import api from "./api";
import type { ApiResponse } from "@/types";
import type { Opportunity, OpportunityType } from "@/types";

export interface CreateOpportunityInput {
  type: string;
  title: string;
  org: string;
  description?: string;
  category?: string;
  location?: string;
  date: string;
  image?: string | null;
  imagePublicId?: string | null;
  status?: "Open" | "Closed";
  visible?: boolean;
}

export interface UpdateOpportunityInput {
  type?: string;
  title?: string;
  org?: string;
  description?: string;
  category?: string;
  location?: string;
  date?: string;
  image?: string | null;
  imagePublicId?: string | null;
  status?: "Open" | "Closed";
  visible?: boolean;
}

export const opportunityService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<{ opportunities: Opportunity[]; total: number; page: number; limit: number; totalPages: number }>>("/opportunities", { params }).then((res) => res.data),

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

  toggleStatus: (id: string, status: "Open" | "Closed") =>
    api
      .patch<ApiResponse<{ opportunity: Opportunity }>>(`/opportunities/${id}/status`, { status })
      .then((res) => res.data),

  getTypes: () =>
    api.get<ApiResponse<{ types: OpportunityType[] }>>("/opportunity-types").then((res) => res.data),

  createType: (name: string) =>
    api
      .post<ApiResponse<{ opportunityType: OpportunityType }>>("/opportunity-types", { name })
      .then((res) => res.data),

  updateType: (id: string, name: string) =>
    api
      .put<ApiResponse<{ opportunityType: OpportunityType }>>(`/opportunity-types/${id}`, { name })
      .then((res) => res.data),

  deleteType: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/opportunity-types/${id}`).then((res) => res.data),

  deleteByType: (typeId: string) =>
    api.delete<ApiResponse<{ deletedCount: number }>>(`/opportunities/type/${typeId}`).then((res) => res.data),
};
