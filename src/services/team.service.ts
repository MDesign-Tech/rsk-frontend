import api from "./api";
import type { ApiResponse, TeamMember, TeamSection, TeamSectionGroup } from "@/types";

export const teamService = {
  // Admin endpoint returns grouped data: [{ section, members }].
  // Flatten into a single member list for the manager table.
  getAll: async (): Promise<ApiResponse<{ teamMembers: TeamMember[] }>> => {
    const res = await api.get<ApiResponse<TeamSectionGroup[]>>("/team");
    const body = res.data as unknown as Record<string, unknown>;
    const payload = body?.data;
    let groups: TeamSectionGroup[] = [];
    if (Array.isArray(payload)) {
      groups = payload as TeamSectionGroup[];
    } else if (payload && typeof payload === "object") {
      const p = payload as Record<string, unknown>;
      if (Array.isArray(p.groups)) groups = p.groups as TeamSectionGroup[];
      else if (Array.isArray(p.team)) groups = p.team as TeamSectionGroup[];
    }

    const teamMembers: TeamMember[] = [];
    for (const g of groups) {
      const sectionId = g?.section?._id ?? "";
      const members = Array.isArray(g?.members) ? g.members : [];
      for (const m of members) {
        teamMembers.push({
          ...m,
          section:
            typeof m.section === "string"
              ? m.section
              : (m.section as { _id: string })?._id ?? sectionId,
        });
      }
    }
    return {
      success: (body?.success as boolean) ?? true,
      message: (body?.message as string) ?? "",
      data: { teamMembers },
    };
  },

  get: (id: string) =>
    api.get<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}`).then((res) => res.data),

  create: (formData: FormData) =>
    api
      .post<ApiResponse<{ teamMember: TeamMember }>>("/team", formData)
      .then((res) => res.data),

  update: (id: string, formData: FormData) =>
    api
      .put<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}`, formData)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Record<string, never>>>(`/team/${id}`).then((res) => res.data),

  toggleVisibility: (id: string, visible: boolean) =>
    api
      .patch<ApiResponse<{ teamMember: TeamMember }>>(`/team/${id}/visibility`, {
        visible,
      })
      .then((res) => res.data),
};

export const teamSectionService = {
  getAll: async (): Promise<ApiResponse<TeamSection[]>> => {
    const res = await api.get<ApiResponse<TeamSection[]>>("/team-sections");
    const body = res.data as unknown as Record<string, unknown>;
    const payload = body?.data;
    let data: TeamSection[] = [];
    if (Array.isArray(payload)) {
      data = payload as TeamSection[];
    } else if (payload && typeof payload === "object") {
      const p = payload as Record<string, unknown>;
      if (Array.isArray(p.sections)) data = p.sections as TeamSection[];
      else if (Array.isArray(p.teamSections)) data = p.teamSections as TeamSection[];
    } else if (Array.isArray(body)) {
      data = body as TeamSection[];
    }
    return {
      success: (body?.success as boolean) ?? true,
      message: (body?.message as string) ?? "",
      data,
    };
  },

  create: (data: { name: string; description?: string; order?: number }) =>
    api
      .post<ApiResponse<{ teamSection: TeamSection }>>("/team-sections", data)
      .then((res) => res.data),

  update: (
    id: string,
    data: { name?: string; description?: string; order?: number; visible?: boolean }
  ) =>
    api
      .put<ApiResponse<{ teamSection: TeamSection }>>(`/team-sections/${id}`, data)
      .then((res) => res.data),

  remove: (id: string) =>
    api
      .delete<ApiResponse<Record<string, never>>>(`/team-sections/${id}`)
      .then((res) => res.data),

  toggleVisibility: (id: string, visible: boolean) =>
    api
      .patch<ApiResponse<{ teamSection: TeamSection }>>(
        `/team-sections/${id}/visibility`,
        { visible }
      )
      .then((res) => res.data),
};
