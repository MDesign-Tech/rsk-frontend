import api from "./api";
import type { ApiResponse, HeroContent, HeroServiceItem, HeroImage } from "@/types";

export const heroService = {
  get: () =>
    api.get<ApiResponse<{ hero: HeroContent }>>("/hero").then((res) => res.data),

  update: (data: {
    title: string;
    services: HeroServiceItem[];
    images: HeroImage[];
  }) =>
    api
      .put<ApiResponse<{ hero: HeroContent }>>("/hero", data)
      .then((res) => res.data),
};
