"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Link2, Unlink2, ShieldCheck } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { userSchema, type UserInput } from "@/schemas";
import { userService } from "@/services/user.service";
import { memberService } from "@/services/member.service";
import type { User, TeamMember, AvailableMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function UsersManager() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<AvailableMember[]>([]);
  const [allMembers, setAllMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkingUser, setLinkingUser] = useState<User | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const { user: currentUser } = useAuthStore();

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", phone: "", role: "member", member: null, password: "" },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const [usersRes, membersRes, availableRes] = await Promise.all([
        userService.getAll(),
        memberService.getAll(),
        userService.getAvailableMembers(),
      ]);
      setUsers(usersRes.data.users);
      setAllMembers(membersRes.data.members);
      setAvailableMembers(availableRes.data.members);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", email: "", phone: "", role: "member", member: null, memberId: null, password: "" });
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    const memberId = typeof user.member === 'object' && user.member ? user.member._id : (typeof user.member === 'string' ? user.member : null);
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      role: "member",
      member: memberId,
      memberId: memberId,
      password: "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: UserInput) => {
    const memberValue = values.memberId === "__none__" ? null : values.memberId;

    setIsSaving(true);
    try {
      if (editing) {
        const payload: any = {
          email: values.email,
          phone: values.phone,
          ...(values.password ? { password: values.password } : {}),
        };
        if (memberValue !== undefined) {
          payload.memberId = memberValue;
        }
        const res = await userService.update(editing._id, payload);
        setUsers((prev) =>
          prev.map((u) => (u._id === editing._id ? res.data.user : u))
        );
        setIsSaving(false);
        setDialogOpen(false);
        toast.success("User updated");
      } else {
        const res = await userService.create({
          email: values.email,
          password: values.password ?? "",
          phone: values.phone,
          memberId: memberValue ?? undefined,
        });
        setUsers((prev) => [res.data.user, ...prev]);
        setIsSaving(false);
        setDialogOpen(false);
        toast.success("User created");
      }
      // Refresh available members after create/update
      const availableRes = await userService.getAvailableMembers();
      setAvailableMembers(availableRes.data.members);
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const openLinkDialog = (user: User) => {
    setLinkingUser(user);
    setSelectedMemberId("");
    setLinkDialogOpen(true);
  };

  const handleLinkMember = async () => {
    if (!linkingUser || !selectedMemberId) return;

    setIsLinking(true);
    try {
      await memberService.linkUser(linkingUser._id, selectedMemberId);
      setLinkDialogOpen(false);
      setLinkingUser(null);
      setSelectedMemberId("");
      toast.success("Member linked to user successfully");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to link member");
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkMember = async (user: User) => {
    setIsUnlinking(true);
    try {
      await memberService.unlinkUser(user._id);
      toast.success("Member unlinked from user successfully");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unlink member");
    } finally {
      setIsUnlinking(false);
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
      // Refresh available members after delete
      const availableRes = await userService.getAvailableMembers();
      setAvailableMembers(availableRes.data.members);
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
      key: "member",
      header: "Member",
      render: (u) => {
        if (u.member && typeof u.member === 'object' && 'name' in u.member) {
          return u.member.name || "—";
        }
        return "—";
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label="Permissions"
            icon={<ShieldCheck />}
            onClick={() => router.push(`/admin/users/permissions/${u.email}`)}
          />
          <IconButton
            variant="outline"
            label={u.member ? "Unlink member" : "Link member"}
            icon={u.member ? <Unlink2 /> : <Link2 />}
            onClick={() => (u.member ? handleUnlinkMember(u) : openLinkDialog(u))}
            disabled={isUnlinking}
          />
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

      <Dialog open={dialogOpen} onOpenChange={(isOpen) => { if (!isSaving) setDialogOpen(isOpen); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this user. Leave password blank to keep it unchanged."
                : "Select a team member to link, then enter the login credentials."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!editing && (
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Member Profile</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Auto-fill name from selected member
                          if (value && value !== "__none__") {
                            const member = availableMembers.find(m => m._id === value);
                            if (member) {
                              form.setValue("name", member.name);
                            }
                          } else {
                            form.setValue("name", "");
                          }
                        }}
                        value={field.value ?? "__none__"}
                        disabled={isSaving}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team member (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None (no profile)</SelectItem>
                          {availableMembers.map((member) => (
                            <SelectItem key={member._id} value={member._id}>
                              {member.name} {member.department ? `- ${member.department}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {editing && (
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Member Profile</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "__none__"}
                        disabled={isSaving}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team member (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None (no profile)</SelectItem>
                          {allMembers.map((member) => (
                            <SelectItem key={member._id} value={member._id}>
                              {member.name} {member.department ? `- ${member.department}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isSaving} />
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
                      <Input {...field} disabled={isSaving} />
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
                      Password{editing ? " (leave blank to keep current)" : ""}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={editing ? "••••••••" : "At least 6 characters"}
                        {...field}
                        disabled={isSaving}
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

       {/* Link Member Dialog */}
       <Dialog open={linkDialogOpen} onOpenChange={(isOpen) => { if (!isLinking) setLinkDialogOpen(isOpen); }}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Link Member to User</DialogTitle>
             <DialogDescription>
               Select a member profile to link to "{linkingUser?.name}".
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">Select Member</label>
               <Select value={selectedMemberId} onValueChange={setSelectedMemberId} disabled={isLinking}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select a member" />
                 </SelectTrigger>
                 <SelectContent>
                   {allMembers.filter((m) => !m.user).map((member) => (
                     <SelectItem key={member._id} value={member._id}>
                       {member.name} {member.department ? `- ${member.department}` : ""}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <DialogFooter>
               <Button
                 variant="outline"
                 onClick={() => setLinkDialogOpen(false)}
                 disabled={isLinking}
               >
                 Cancel
               </Button>
               <Button onClick={handleLinkMember} disabled={!selectedMemberId || isLinking}>
                 {isLinking && <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                 Link Member
               </Button>
             </DialogFooter>
           </div>
         </DialogContent>
       </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!isDeleting) setDeleteTarget(null); }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete user?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
