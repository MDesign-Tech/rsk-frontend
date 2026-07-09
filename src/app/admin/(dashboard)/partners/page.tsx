import { PageHeader } from "@/components/admin/page-header";
import { PartnersManager } from "@/features/partners/partners-manager";

export default function PartnersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partners"
        description="Manage the partners featured on your website."
      />
      <PartnersManager />
    </div>
  );
}
