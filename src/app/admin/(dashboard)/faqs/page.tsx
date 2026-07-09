import { PageHeader } from "@/components/admin/page-header";
import { FaqsManager } from "@/features/faqs/faqs-manager";

export default function FaqsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage the frequently asked questions shown to visitors."
      />
      <FaqsManager />
    </div>
  );
}
