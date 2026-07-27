"use client";

import { PageHeader } from "@/components/admin/page-header";
import { NewsManager } from "@/features/news/news-manager";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="News"
        description="Manage your blog news and updates."
      />
      <PermissionGuard moduleName="News" action="read">
        <NewsManager />
      </PermissionGuard>
    </div>
  );
}
