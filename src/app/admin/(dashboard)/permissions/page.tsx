import { PageHeader } from "@/components/admin/page-header";
import { PermissionsManager } from "@/features/permissions/permissions-manager";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Permissions" description=" Select a user to manage their module permissions. Admin users have full access to all modules." />
      <PermissionsManager />
    </div>
  );
}
