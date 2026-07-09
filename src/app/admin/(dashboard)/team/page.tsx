import { PageHeader } from "@/components/admin/page-header";
import { TeamManager } from "@/features/team/team-manager";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        description="Manage the people featured on your team page."
      />
      <TeamManager />
    </div>
  );
}
