"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/stores/auth.store";
import { permissionService } from "@/services/permission.service";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Shield } from "lucide-react";
import type { Permission, Module } from "@/types";

export default function UserPermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const { initialized, isAuthenticated, hasPermission, user: currentUser } = useAuthStore();
  const email = decodeURIComponent(params.email as string);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [user, setUser] = useState<{ _id: string; name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Related modules: when one is toggled, the related one is also toggled
  const relatedModules: Record<string, string[]> = {
    "Opportunity": ["Opportunity Type"],
    "Category": [],
  };

  const canManagePermissions = hasPermission("Permission", "update");
  const isEditingOwnPermissions = user?._id === currentUser?._id;
  const isAdminUser = user?.role === "admin";

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (initialized && isAuthenticated && !hasPermission("Permission", "read")) {
      toast.error("You do not have permission to view permissions.");
      router.replace("/admin/unauthorized");
      return;
    }

    if (initialized && isAuthenticated) {
      fetchPermissions();
      fetchModules();
    }
  }, [initialized, isAuthenticated, email, router, hasPermission]);

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      const res = await permissionService.getUserPermissionsByEmail(email);
      setUser(res.data.user);
      setPermissions(res.data.permissions);
      setHasChanges(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetch("/api/modules");
      const data = await res.json();
      if (data.success) {
        setModules(data.data.modules);
      }
    } catch {
      // Modules fetch failed; continue with empty list
    }
  };

  const togglePermission = useCallback((moduleName: string, field: keyof Pick<Permission, "canCreate" | "canRead" | "canUpdate" | "canDelete">) => {
    setPermissions((prev) => {
      const existing = prev.find((p) => p.module && typeof p.module === "object" && "name" in p.module && p.module.name === moduleName);
      if (existing) {
        return prev.map((perm) =>
          perm._id === existing._id ? { ...perm, [field]: !perm[field] } : perm
        );
      }
      // No existing permission - create a new one with the toggled field
      const newPerm: Permission = {
          _id: `new-${moduleName}`,
          module: { _id: "", name: moduleName, description: "", icon: "" },
          canCreate: field === "canCreate",
          canRead: field === "canRead",
          canUpdate: field === "canUpdate",
          canDelete: field === "canDelete",
      };
      return [...prev, newPerm];
    });
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatePromises = permissions.map((perm) => {
        if (perm._id.startsWith("new-")) {
          const mod = modules.find((m) => m.name === perm.module.name);
          return permissionService.create({
            user: user?._id || "",
            module: mod?._id || "",
            canCreate: perm.canCreate,
            canRead: perm.canRead,
            canUpdate: perm.canUpdate,
            canDelete: perm.canDelete,
          });
        }
        return permissionService.update(perm._id, {
          canCreate: perm.canCreate,
          canRead: perm.canRead,
          canUpdate: perm.canUpdate,
          canDelete: perm.canDelete,
        });
      });
      await Promise.all(updatePromises);
      setHasChanges(false);
      toast.success("Permissions saved successfully");
      await fetchPermissions();
      await fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save permissions");
    } finally {
      setIsSaving(false);
    }
  };

  if (!initialized || !isAuthenticated) {
    return null;
  }

  const permissionMap = new Map<string, Permission>();
  permissions.forEach((perm) => {
    if (perm.module && typeof perm.module === "object" && "name" in perm.module) {
      permissionMap.set(perm.module.name as string, perm);
    }
  });

  const isEditingDisabled = isEditingOwnPermissions || isAdminUser;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="h-10 px-4">
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        {canManagePermissions && !isEditingDisabled && (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="h-10 px-6"
          >
            <Save className="size-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <PageHeader
        title={`Permissions: ${email}`}
        description={`Manage module permissions for ${user?.name || email}.`}
      />

      {isAdminUser && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Admin users have permanent full access to all modules. Their permissions cannot be modified.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px] hidden sm:table-cell">Description</TableHead>
                <TableHead className="text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="size-3" />
                    Create
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="size-3" />
                    Read
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="size-3" />
                    Update
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="size-3" />
                    Delete
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((mod) => {
                const perm = permissionMap.get(mod.name);
                return (
                  <TableRow key={mod._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {mod.description || "No description"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perm?.canCreate ?? false}
                        onCheckedChange={() => togglePermission(mod.name, "canCreate")}
                        disabled={!canManagePermissions || isEditingDisabled}
                        className="size-5 border-border hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perm?.canRead ?? false}
                        onCheckedChange={() => togglePermission(mod.name, "canRead")}
                        disabled={!canManagePermissions || isEditingDisabled}
                        className="size-5 border-border hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perm?.canUpdate ?? false}
                        onCheckedChange={() => togglePermission(mod.name, "canUpdate")}
                        disabled={!canManagePermissions || isEditingDisabled}
                        className="size-5 border-border hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perm?.canDelete ?? false}
                        onCheckedChange={() => togglePermission(mod.name, "canDelete")}
                        disabled={!canManagePermissions || isEditingDisabled}
                        className="size-5 border-border hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {modules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No modules found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
