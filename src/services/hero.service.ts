import api from "./api";
import type { ApiResponse, HeroContent } from "@/types";

export const heroService = {
  get: () =>
    api.get<ApiResponse<{ hero: HeroContent }>>("/hero").then((res) => res.data),

  update: (data: { title: string; subtitle: string; trust: string }) =>
    api
      .put<ApiResponse<{ hero: HeroContent }>>("/hero", data)
      .then((res) => res.data),

  // Upload the hero background image (multipart/form-data).
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api
      .post<ApiResponse<{ hero: HeroContent }>>("/hero/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};
