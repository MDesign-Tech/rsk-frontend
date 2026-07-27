"use client";

import { PageHeader } from "@/components/admin/page-header";
import { WhyJoinUsForm } from "@/features/why-join-us/why-join-us-form";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function WhyJoinUsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Join Us"
        description="Manage the Why Join Us section content and points."
      />
      <PermissionGuard moduleName="Why Join Us" action="read">
        <WhyJoinUsForm />
      </PermissionGuard>
    </div>
  );
}
