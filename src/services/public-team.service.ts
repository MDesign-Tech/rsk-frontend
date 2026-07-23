import api from "./api";
import type { ApiResponse } from "@/types";

export interface TeamSection {
  _id: string;
  name: string;
  description?: string;
  order: number;
  visible: boolean;
}

export interface TeamMember {
  _id: string;
  name: string;
  image: string | null;
  imagePublicId: string | null;
  title: string;
  bio: string;
  section: TeamSection;
  socialMedia: {
    facebook: { href: string | null; visible: boolean };
    instagram: { href: string | null; visible: boolean };
    whatsapp: { href: string | null; visible: boolean };
    x: { href: string | null; visible: boolean };
    linkedin: { href: string | null; visible: boolean };
    youtube: { href: string | null; visible: boolean };
  };
  visible: boolean;
  order: number;
}

export interface TeamGroup {
  section: TeamSection;
  members: TeamMember[];
}

export const publicTeamService = {
  getTeam: async () => {
    const res = await api.get<ApiResponse<{ team: TeamGroup[] }>>("/team/public");
    return res.data;
  },
};
