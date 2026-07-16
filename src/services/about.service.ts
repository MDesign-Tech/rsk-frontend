import api from "./api";
import type { ApiResponse, AboutUs } from "@/types";
import type { AboutInput } from "@/schemas";

export const aboutService = {
  get: () =>
    api.get<ApiResponse<{ about: AboutUs }>>("/about").then((res) => res.data),

  update: (data: AboutInput) =>
    api
      .put<ApiResponse<{ about: AboutUs }>>("/about", data)
      .then((res) => res.data),

  toggleVisibility: (visible: boolean) =>
    api
      .patch<ApiResponse<{ about: AboutUs }>>("/about/visibility", { visible })
      .then((res) => res.data),
};
