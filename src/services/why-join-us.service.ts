import api from "./api";
import type { ApiResponse, WhyJoinUs } from "@/types";
import type { WhyJoinUsInput } from "@/schemas";

export const whyJoinUsService = {
  get: () =>
    api.get<ApiResponse<{ whyJoinUs: WhyJoinUs }>>("/why-join-us").then((res) => res.data),

  update: (data: WhyJoinUsInput) =>
    api
      .put<ApiResponse<{ whyJoinUs: WhyJoinUs }>>("/why-join-us", data)
      .then((res) => res.data),

  toggleVisibility: (visible: boolean) =>
    api
      .patch<ApiResponse<{ whyJoinUs: WhyJoinUs }>>("/why-join-us/visibility", { visible })
      .then((res) => res.data),
};
