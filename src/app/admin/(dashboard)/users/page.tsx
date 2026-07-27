"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { UsersManager } from "@/features/users/users-manager";
import { useAuthStore } from "@/stores/auth.store";

export default function UsersPage() {
  const router = useRouter();
  const { initialized, isAuthenticated, hasPermission } = useAuthStore();

  const canReadUsers = hasPermission("User", "read");

  useEffect(() => {
    if (initialized && isAuthenticated && !canReadUsers) {
      router.replace("/admin");
    }
  }, [initialized, isAuthenticated, canReadUsers, router]);

  if (!initialized || !isAuthenticated || !canReadUsers) {
    return null;
  }

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
