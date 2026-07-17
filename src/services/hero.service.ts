import api from "./api";
import type { ApiResponse, HeroContent } from "@/types";

export const heroService = {
  get: () =>
    api.get<ApiResponse<{ hero: HeroContent }>>("/hero").then((res) => res.data),

  update: (formData: FormData) =>
    api
      .put<ApiResponse<{ hero: HeroContent }>>("/hero", formData)
      .then((res) => res.data),
};
