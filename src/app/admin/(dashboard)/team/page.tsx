"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { TeamManager } from "@/features/team/team-manager";
import { useAuthStore } from "@/stores/auth.store";

export default function TeamPage() {
  const router = useRouter();
  const { initialized, isAuthenticated, hasPermission } = useAuthStore();

  const canReadTeam = hasPermission("Team Member", "read");

  useEffect(() => {
    if (initialized && isAuthenticated && !canReadTeam) {
      router.replace("/admin");
    }
  }, [initialized, isAuthenticated, canReadTeam, router]);

  if (!initialized || !isAuthenticated || !canReadTeam) {
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
