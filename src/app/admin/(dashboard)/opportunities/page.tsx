import { PageHeader } from "@/components/admin/page-header";
import { OpportunityManager } from "@/features/opportunities/opportunity-manager";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="Manage tenders, jobs, and other opportunities."
      />
      <OpportunityManager />
    </div>
  );
}
