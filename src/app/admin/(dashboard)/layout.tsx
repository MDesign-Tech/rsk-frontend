"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useWebsiteStore } from "@/stores/website.store";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminError } from "@/providers/AdminError";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, initialized, checkAuth } = useAuthStore();
  const router = useRouter();
  const websiteError = useWebsiteStore((state) => state.error);

  useEffect(() => {
    if (!initialized) checkAuth();
  }, [initialized, checkAuth]);

  useEffect(() => {
    if (initialized && !isAuthenticated) router.replace("/admin/login");
  }, [initialized, isAuthenticated, router]);

  if (websiteError) {
    return <AdminError />;
  }

  return <AdminShell>{children}</AdminShell>;
}
