import api from "./api";
import type { ApiResponse, MediaLibraryImage, MediaLibraryPagination } from "@/types";

export interface MediaLibraryQueryParams {
  filter?: "all" | "used" | "unused";
  search?: string;
  page?: number;
  limit?: number;
}

export interface MediaLibraryData {
  images: MediaLibraryImage[];
  pagination: MediaLibraryPagination;
}

export const mediaLibraryService = {
  get: (params: MediaLibraryQueryParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.filter) searchParams.set("filter", params.filter);
    if (params.search) searchParams.set("search", params.search);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    return api
      .get<ApiResponse<MediaLibraryData>>(`/media-library${query ? `?${query}` : ""}`)
      .then((res) => res.data);
  },

  delete: (publicId: string) =>
    api
      .delete<ApiResponse<{ publicId: string }>>(`/media-library/${encodeURIComponent(publicId)}`)
      .then((res) => res.data),
};
