"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

interface PermissionGuardProps {
  children: React.ReactNode;
  moduleName: string;
  action?: "create" | "read" | "update" | "delete";
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  moduleName,
  action = "read",
  fallback,
}: PermissionGuardProps) {
  const router = useRouter();
  const { initialized, isAuthenticated, hasPermission } = useAuthStore();

  const hasAccess = hasPermission(moduleName, action);

  useEffect(() => {
    if (initialized && isAuthenticated && !hasAccess) {
      toast.error(
        `You do not have permission to ${action} ${moduleName}. Contact an administrator for access.`
      );
      router.replace("/admin/unauthorized");
    }
  }, [initialized, isAuthenticated, hasAccess, moduleName, action, router]);

  if (!initialized || !isAuthenticated || !hasAccess) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
