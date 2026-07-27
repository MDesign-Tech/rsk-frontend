import api from "./api";
import type { ApiResponse, HeroContent, HeroServiceItem } from "@/types";

export const heroService = {
  get: () =>
    api.get<ApiResponse<{ hero: HeroContent }>>("/hero").then((res) => res.data),

  update: (data: {
    title: string;
    services: HeroServiceItem[];
    image?: string | null;
    imagePublicId?: string | null;
  }) =>
    api
      .put<ApiResponse<{ hero: HeroContent }>>("/hero", data)
      .then((res) => res.data),
};
