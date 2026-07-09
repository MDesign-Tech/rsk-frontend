import { PageHeader } from "@/components/admin/page-header";
import { ServicesManager } from "@/features/services/services-manager";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage the services offered by your business."
      />
      <ServicesManager />
    </div>
  );
}
