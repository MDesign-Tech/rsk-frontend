"use client";

import { PageHeader } from "@/components/admin/page-header";
import { HeroForm } from "@/features/hero/hero-form";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function HeroPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hero" description="Manage the homepage hero section." />
      <PermissionGuard moduleName="Hero" action="read">
        <HeroForm />
      </PermissionGuard>
    </div>
  );
}
