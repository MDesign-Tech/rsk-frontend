import { useAuthStore } from "@/stores/auth.store";
import type { Permission } from "@/types";

/**
 * Check if the current user has a specific permission for a module.
 */
export function hasPermission(
  moduleName: string,
  action: "create" | "read" | "update" | "delete"
): boolean {
  return useAuthStore.getState().hasPermission(moduleName, action);
}

/**
 * Check if the current user can read (view) a module.
 * Used for sidebar visibility.
 */
export function canReadModule(moduleName: string): boolean {
  return hasPermission(moduleName, "read");
}

/**
 * Check if the current user can create in a module.
 */
export function canCreate(moduleName: string): boolean {
  return hasPermission(moduleName, "create");
}

/**
 * Check if the current user can update in a module.
 */
export function canUpdate(moduleName: string): boolean {
  return hasPermission(moduleName, "update");
}

/**
 * Check if the current user can delete in a module.
 */
export function canDelete(moduleName: string): boolean {
  return hasPermission(moduleName, "delete");
}

/**
 * Get all permissions for the current user.
 */
export function getUserPermissions(): Permission[] {
  return useAuthStore.getState().user?.permissions ?? [];
}

/**
 * Check if the current user is an admin.
 */
export function isAdmin(): boolean {
  return useAuthStore.getState().user?.role === "admin";
}
