"use client";

import { PageHeader } from "@/components/admin/page-header";
import { MediaLibraryManager } from "@/features/media-library/media-library-manager";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Manage your Cloudinary images. View usage status, search, and delete unused images."
      />
      <PermissionGuard moduleName="Media Library" action="read">
        <MediaLibraryManager />
      </PermissionGuard>
    </div>
  );
}
