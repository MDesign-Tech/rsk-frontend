"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { AdminShell } from "@/components/admin/admin-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, initialized, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) checkAuth();
  }, [initialized, checkAuth]);

  useEffect(() => {
    if (initialized && !isAuthenticated) router.replace("/admin/login");
  }, [initialized, isAuthenticated, router]);

  return <AdminShell>{children}</AdminShell>;
}
