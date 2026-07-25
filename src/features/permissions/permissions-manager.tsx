"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, UserCog, Info } from "lucide-react";
import { userService } from "@/services/user.service";
import { moduleService } from "@/services/module.service";
import { permissionService } from "@/services/permission.service";
import type { User, Module, Permission } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { toast } from "sonner";

interface PermissionEntry {
  module: string;
  moduleName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function PermissionsManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string>("");
  const [permissionEntries, setPermissionEntries] = useState<PermissionEntry[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, modulesRes] = await Promise.all([
        userService.getAll(),
        moduleService.getAll(),
      ]);
      setUsers(usersRes.data.users);
      setModules(modulesRes.data.modules);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserChange = async (userId: string) => {
    if (!userId) {
      setSelectedUserId("");
      setPermissionEntries([]);
      setPermissions([]);
      return;
    }

    const user = users.find((u) => u._id === userId);
    if (user && user.role === "admin") {
      setSelectedUserId(userId);
      setPermissionEntries([]);
      setPermissions([]);
      return;
    }

    setPendingUserId(userId);
    setShowInfoDialog(true);
  };

  const confirmUserSelection = async () => {
    const userId = pendingUserId;
    setShowInfoDialog(false);
    setSelectedUserId(userId);

    if (!userId) return;

    try {
      const res = await permissionService.getUserPermissions(userId);
      setPermissions(res.data.permissions);

      const entries: PermissionEntry[] = modules.map((mod) => {
        const existing = res.data.permissions.find((p) => p.module === mod._id);
        return {
          module: mod._id,
          moduleName: mod.name,
          canCreate: existing?.canCreate ?? false,
          canRead: existing?.canRead ?? false,
          canUpdate: existing?.canUpdate ?? false,
          canDelete: existing?.canDelete ?? false,
        };
      });

      setPermissionEntries(entries);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load permissions");
    }
  };

  const updatePermission = useCallback((moduleId: string, field: keyof Omit<PermissionEntry, "module" | "moduleName">, value: boolean) => {
    setPermissionEntries((prev) =>
      prev.map((entry) =>
        entry.module === moduleId ? { ...entry, [field]: value } : entry
      )
    );
  }, []);

  const onSubmit = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    const selectedUser = users.find((u) => u._id === selectedUserId);
    if (selectedUser?.role === "admin") {
      toast.error("Admin users have full access to all modules by default");
      return;
    }

    setIsSaving(true);
    try {
      await permissionService.bulkCreate({
        userId: selectedUserId,
        permissions: permissionEntries.map(({ module, canCreate, canRead, canUpdate, canDelete }) => ({
          module,
          canCreate,
          canRead,
          canUpdate,
          canDelete,
        })),
      });
      toast.success("Permissions saved successfully");

      const res = await permissionService.getUserPermissions(selectedUserId);
      setPermissions(res.data.permissions);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save permissions");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedUser = users.find((u) => u._id === selectedUserId);

  if (isLoading) {
    return <LoadingSpinner label="Loading permissions..." />;
  }

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold">Select User</label>
          <Select
            value={selectedUserId}
            onValueChange={handleUserChange}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a user to manage permissions" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser && selectedUser.role !== "admin" && (
          <div className="rounded-lg border">
            <div className="grid grid-cols-[3fr_repeat(4,1fr)] gap-0 border-b bg-muted/50">
              <div className="p-4 font-semibold text-sm">Module</div>
              <div className="p-4 font-semibold text-sm text-center">Create</div>
              <div className="p-4 font-semibold text-sm text-center">Read</div>
              <div className="p-4 font-semibold text-sm text-center">Update</div>
              <div className="p-4 font-semibold text-sm text-center">Delete</div>
            </div>
            <div className="divide-y">
              {permissionEntries.map((entry) => (
                <div
                  key={entry.module}
                  className="grid grid-cols-[3fr_repeat(4,1fr)] gap-0 items-center"
                >
                  <div className="p-4">
                    <p className="font-medium text-base">{entry.moduleName}</p>
                  </div>
                  <div className="flex justify-center items-center p-4">
                    <Checkbox
                      key={`${entry.module}-create`}
                      checked={entry.canCreate}
                      onCheckedChange={(checked) => {
                        updatePermission(entry.module, "canCreate", checked === true);
                      }}
                      className="size-5 [&>svg]:text-white ring-white ring-1 focus-visible:ring-white"
                      aria-label={`Create ${entry.moduleName}`}
                    />
                  </div>
                  <div className="flex justify-center items-center p-4">
                    <Checkbox
                      key={`${entry.module}-read`}
                      checked={entry.canRead}
                      onCheckedChange={(checked) => {
                        updatePermission(entry.module, "canRead", checked === true);
                      }}
                      className="size-5 [&>svg]:text-white ring-white ring-1 focus-visible:ring-white"
                      aria-label={`Read ${entry.moduleName}`}
                    />
                  </div>
                  <div className="flex justify-center items-center p-4">
                    <Checkbox
                      key={`${entry.module}-update`}
                      checked={entry.canUpdate}
                      onCheckedChange={(checked) => {
                        updatePermission(entry.module, "canUpdate", checked === true);
                      }}
                      className="size-5 [&>svg]:text-white ring-white ring-1 focus-visible:ring-white"
                      aria-label={`Update ${entry.moduleName}`}
                    />
                  </div>
                  <div className="flex justify-center items-center p-4">
                    <Checkbox
                      key={`${entry.module}-delete`}
                      checked={entry.canDelete}
                      onCheckedChange={(checked) => {
                        updatePermission(entry.module, "canDelete", checked === true);
                      }}
                      className="size-5 [&>svg]:text-white ring-white ring-1 focus-visible:ring-white"
                      aria-label={`Delete ${entry.moduleName}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedUser && selectedUser.role === "admin" && (
          <EmptyState
            title="Admin User"
            description="Admin users have full access to all modules. No permission management needed."
          />
        )}

        {!selectedUser && (
          <EmptyState
            title="Select a user"
            description="Choose a user from the dropdown above to manage their permissions."
          />
        )}

        {selectedUser && selectedUser.role !== "admin" && (
          <div className="flex justify-end">
            <Button onClick={onSubmit} disabled={isSaving} className="min-w-[160px]">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="size-5 text-primary" />
              Configure Permissions
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Check or select the permissions that you want to give this user, then go to{" "}
              <strong>Save Changes</strong> to apply them.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button onClick={confirmUserSelection} className="min-w-[120px]">
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
