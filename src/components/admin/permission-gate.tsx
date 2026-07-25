"use client";

import type { ReactNode } from "react";
import { hasPermission, isAdmin } from "@/lib/permissions";

interface PermissionGateProps {
  module: string;
  action?: "create" | "read" | "update" | "delete";
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  module,
  action = "read",
  children,
  fallback = null,
}: PermissionGateProps) {
  // Admin always has access
  if (isAdmin()) {
    return <>{children}</>;
  }

  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
