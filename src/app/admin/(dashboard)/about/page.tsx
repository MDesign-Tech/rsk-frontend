"use client";

import { PageHeader } from "@/components/admin/page-header";
import { AboutForm } from "@/features/about/about-form";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="About Us" description="Manage the about section content." />
      <PermissionGuard moduleName="About Us" action="read">
        <AboutForm />
      </PermissionGuard>
    </div>
  );
}
