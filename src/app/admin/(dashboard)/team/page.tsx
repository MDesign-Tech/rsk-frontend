"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { TeamManager } from "@/features/team/team-manager";
import { useAuthStore } from "@/stores/auth.store";

export default function TeamPage() {
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
        title="Team Members"
        description="Manage the people featured on your team page."
      />
      <TeamManager />
    </div>
  );
}
