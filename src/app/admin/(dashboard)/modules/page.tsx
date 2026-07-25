import { PageHeader } from "@/components/admin/page-header";
import { ModulesManager } from "@/features/modules/modules-manager";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Modules" description="Manage dashboard modules and their settings." />
      <ModulesManager />
    </div>
  );
}
