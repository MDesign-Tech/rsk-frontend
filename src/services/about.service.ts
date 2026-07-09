import api from "./api";
import type { ApiResponse, AboutUs, AboutStat } from "@/types";

export const aboutService = {
  get: () =>
    api.get<ApiResponse<{ about: AboutUs }>>("/about").then((res) => res.data),

  update: (data: { title: string; description: string; stats: AboutStat[] }) =>
    api
      .put<ApiResponse<{ about: AboutUs }>>("/about", data)
      .then((res) => res.data),
};
