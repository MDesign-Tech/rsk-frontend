import api from "./api";
import type { ApiResponse, HeroContent } from "@/types";

export const heroService = {
  get: () =>
    api.get<ApiResponse<{ hero: HeroContent }>>("/hero").then((res) => res.data),

  update: (data: {
    title: string;
    subtitle: string;
    trust: string;
    subtitleVisible: boolean;
    trustVisible: boolean;
  }) =>
    api
      .put<ApiResponse<{ hero: HeroContent }>>("/hero", data)
      .then((res) => res.data),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    // Do NOT set an explicit Content-Type header here. When sending FormData,
    // axios/browser must set `multipart/form-data` WITH the generated boundary
    // (e.g. `multipart/form-data; boundary=----WebKit...`). Forcing
    // `multipart/form-data` without a boundary causes the backend to fail
    // parsing the body and return a 500.
    return api
      .post<ApiResponse<{ hero: HeroContent }>>("/hero/upload", formData)
      .then((res) => res.data);
  },
};
