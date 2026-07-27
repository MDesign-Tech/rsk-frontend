"use client";

import { PageHeader } from "@/components/admin/page-header";
import { FaqsManager } from "@/features/faqs/faqs-manager";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function FaqsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage the frequently asked questions shown to visitors."
      />
      <PermissionGuard moduleName="FAQ" action="read">
        <FaqsManager />
      </PermissionGuard>
    </div>
  );
}
