"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { userSchema, type UserInput } from "@/schemas";
import { userService } from "@/services/user.service";
import type { User } from "@/types";
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
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user: currentUser } = useAuthStore();

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", phone: "", role: "admin", password: "" },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res.data.users);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load users");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", email: "", phone: "", role: "admin", password: "" });
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      role: "admin",
      password: "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: UserInput) => {
    // Password is required when creating a new user.
    if (!editing && !values.password) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    setIsSaving(true);
    try {
      if (editing) {
        const payload = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: "admin" as const,
          ...(values.password ? { password: values.password } : {}),
        };
        const res = await userService.update(editing._id, payload);
        setUsers((prev) =>
          prev.map((u) => (u._id === editing._id ? res.data.user : u))
        );
        setDialogOpen(false);
        toast.success("User updated");
      } else {
        const res = await userService.create({
          name: values.name,
          email: values.email,
          password: values.password ?? "",
          phone: values.phone,
          role: "admin" as const,
        });
        setUsers((prev) => [res.data.user, ...prev]);
        setDialogOpen(false);
        toast.success("User created");
      }
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await userService.remove(deleteTarget._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("User deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<User>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone", render: (u) => u.phone || "—" },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label="Edit user"
            icon={<Pencil />}
            onClick={() => openEdit(u)}
          />
          {u._id !== currentUser?._id && (
            <IconButton
              variant="destructive"
              label="Delete user"
              icon={<Trash2 />}
              onClick={() => setDeleteTarget(u)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
        <IconButton
          variant="default"
          label="Add user"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading users..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          description={
            search
              ? "No users match your search."
              : "Add your first admin user to get started."
          }
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this user. Leave password blank to keep it unchanged."
                : "Fill in the details to create a new admin user."}
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password{editing ? " (optional)" : ""}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={editing ? "••••••••" : "At least 6 characters"}
                        {...field}
                      />
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
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={isSaving}>
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
        title="Delete user?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
