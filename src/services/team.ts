import api from "@/services/api";
import type { TeamMember } from "@/types";

// ---------------------------------------------------------------------------
// Team API service layer
//
// Used by the news author selector. Only existing team members can be chosen
// as the author of a news article. The backend validates the referenced team
// member on create/update.
// ---------------------------------------------------------------------------

export const teamService = {
  // List all team members (admin). Used to populate the author dropdown.
  async list(): Promise<TeamMember[]> {
    const res = await api.get("/team");
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.members)) return data.members;
    if (Array.isArray(data?.team)) return data.team;
    return [];
  },

  // Public list of team members grouped by section.
  async listPublic(): Promise<TeamMember[]> {
    const res = await api.get("/team/public");
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) {
      // Could be a flat array or an array of { section, members }.
      if (data.length > 0 && "members" in (data[0] as object)) {
        return (data as { members: TeamMember[] }[]).flatMap((g) => g.members);
      }
      return data as TeamMember[];
    }
    if (Array.isArray(data?.groups)) {
      return (data.groups as { members: TeamMember[] }[]).flatMap((g) => g.members);
    }
    if (Array.isArray(data?.members)) return data.members;
    if (Array.isArray(data?.team)) return data.team;
    return [];
  },
};

export default teamService;
