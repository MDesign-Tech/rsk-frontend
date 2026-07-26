"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { UsersManager } from "@/features/users/users-manager";
import { useAuthStore } from "@/stores/auth.store";

export default function UsersPage() {
  const router = useRouter();
  const { initialized, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (initialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/admin");
    }
  }, [initialized, isAuthenticated, user, router]);

  if (!initialized || !isAuthenticated || user?.role !== "admin") {
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
