import { PageHeader } from "@/components/admin/page-header";
import { UsersManager } from "@/features/users/users-manager";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage admin users who can access this dashboard."
      />
      <UsersManager />
    </div>
  );
}
