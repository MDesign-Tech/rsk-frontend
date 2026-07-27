"use client";

import { PageHeader } from "@/components/admin/page-header";
import { ServicesManager } from "@/features/services/services-manager";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage the services offered by your business."
      />
      <PermissionGuard moduleName="Service" action="read">
        <ServicesManager />
      </PermissionGuard>
    </div>
  );
}
