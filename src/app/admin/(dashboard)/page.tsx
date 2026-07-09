import { PageHeader } from "@/components/admin/page-header";
import { DashboardView } from "@/features/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your website content." />
      <DashboardView />
    </div>
  );
}
