"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { moduleSchema, type ModuleInput } from "@/schemas";
import { moduleService } from "@/services/module.service";
import type { Module } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function ModulesManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Module | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ModuleInput>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { name: "", description: "", route: "", icon: "", order: 0, isActive: true },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await moduleService.getAll();
      setModules(res.data.modules);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load modules");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", description: "", route: "", icon: "", order: 0, isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (mod: Module) => {
    setEditing(mod);
    form.reset({
      name: mod.name,
      description: mod.description ?? "",
      route: mod.route ?? "",
      icon: mod.icon ?? "",
      order: mod.order,
      isActive: mod.isActive,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ModuleInput) => {
    setIsSaving(true);
    try {
      if (editing) {
        const res = await moduleService.update(editing._id, values);
        setModules((prev) =>
          prev.map((m) => (m._id === editing._id ? res.data.module : m))
        );
        setIsSaving(false);
        setDialogOpen(false);
        toast.success("Module updated");
      } else {
        const res = await moduleService.create(values);
        setModules((prev) => [res.data.module, ...prev]);
        setIsSaving(false);
        setDialogOpen(false);
        toast.success("Module created");
      }
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await moduleService.delete(deleteTarget._id);
      setModules((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Module deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filtered = modules.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Module>[] = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description", render: (m) => m.description || "—" },
    { key: "route", header: "Route", render: (m) => m.route || "—" },
    {
      key: "isActive",
      header: "Active",
      render: (m) => (m.isActive ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (m) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label="Edit module"
            icon={<Pencil />}
            onClick={() => openEdit(m)}
          />
          <IconButton
            variant="destructive"
            label="Delete module"
            icon={<Trash2 />}
            onClick={() => setDeleteTarget(m)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search modules..." />
        <IconButton
          variant="default"
          label="Add module"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading modules..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No modules found"
          description={
            search
              ? "No modules match your search."
              : "Add your first module to get started."
          }
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <Dialog open={dialogOpen} onOpenChange={(isOpen) => { if (!isSaving) setDialogOpen(isOpen); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Module" : "Add Module"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the module details."
                : "Fill in the details to create a new module."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="route"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={isSaving} disabled={isSaving}>
                  {editing ? "Save Changes" : "Create"}
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete module?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
