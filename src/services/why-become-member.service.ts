import api from "./api";
import type { ApiResponse, WhyBecomeMember } from "@/types";
import type { WhyBecomeMemberInput } from "@/schemas";

export const whyBecomeMemberService = {
  get: () =>
    api.get<ApiResponse<{ whyBecomeMember: WhyBecomeMember }>>("/why-become-member").then((res) => res.data),

  update: (data: WhyBecomeMemberInput) =>
    api
      .put<ApiResponse<{ whyBecomeMember: WhyBecomeMember }>>("/why-become-member", data)
      .then((res) => res.data),

  toggleVisibility: (visible: boolean) =>
    api
      .patch<ApiResponse<{ whyBecomeMember: WhyBecomeMember }>>("/why-become-member/visibility", { visible })
      .then((res) => res.data),
};
