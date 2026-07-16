"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { AdminShell } from "@/components/admin/admin-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { initialized, isAuthenticated, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    if (!initialized) checkAuth();
  }, [initialized, checkAuth]);


  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/admin/login?reason=unauthorized");
    }
  }, [initialized, isAuthenticated, router]);

 
  if (isLoading || !initialized || !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
