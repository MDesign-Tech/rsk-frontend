"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { teamMemberSchema, type TeamMemberInput } from "@/schemas";
import { teamService } from "@/services/team.service";
import type { TeamMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: { name: "", title: "", bio: "" },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await teamService.getAll();
      setMembers(res.data.teamMembers);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load team");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    form.reset({ name: "", title: "", bio: "" });
    setDialogOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    setImageFile(null);
    form.reset({ name: member.name, title: member.title, bio: member.bio ?? "" });
    setDialogOpen(true);
  };

  const onSubmit = async (values: TeamMemberInput) => {
    setIsSaving(true);
    try {
      let saved: TeamMember;
      if (editing) {
        const res = await teamService.update(editing._id, values);
        saved = res.data.teamMember;
        setMembers((prev) =>
          prev.map((m) => (m._id === editing._id ? saved : m))
        );
        toast.success("Team member updated");
      } else {
        const res = await teamService.create(values);
        saved = res.data.teamMember;
        setMembers((prev) => [saved, ...prev]);
        toast.success("Team member created");
      }

      if (imageFile) {
        setIsUploading(true);
        try {
          const up = await teamService.uploadImage(saved._id, imageFile);
          setMembers((prev) =>
            prev.map((m) => (m._id === saved._id ? up.data.teamMember : m))
          );
          setIsUploading(false);
          toast.success("Image uploaded");
        } catch (err) {
          setIsUploading(false);
          toast.error(err instanceof Error ? err.message : "Image upload failed");
        } 
      }
    setIsSaving(false);
      setDialogOpen(false);
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await teamService.remove(deleteTarget._id);
      setMembers((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Team member deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } 
  };

  const toggleVisibility = async (member: TeamMember) => {
    const next = !member.visible;
    try {
      const res = await teamService.toggleVisibility(member._id, next);
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? res.data.teamMember : m))
      );
      toast.success(next ? "Team member shown" : "Team member hidden");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    }
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<TeamMember>[] = [
    {
      key: "name",
      header: "Name",
      render: (m) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.image ?? "/placeholder-user.jpg"}
            alt={m.name}
            className="size-9 rounded-full object-cover"
          />
          <span className="font-medium">{m.name}</span>
        </div>
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (m) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label={m.visible === false ? "Show team member" : "Hide team member"}
            icon={m.visible === false ? <EyeOff /> : <Eye />}
            onClick={() => toggleVisibility(m)}
          />
          <IconButton
            variant="outline"
            label="Edit team member"
            icon={<Pencil />}
            onClick={() => openEdit(m)}
          />
          <IconButton
            variant="destructive"
            label="Delete team member"
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
        <SearchInput value={search} onChange={setSearch} placeholder="Search team..." />
        <IconButton
          variant="default"
          label="Add team member"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading team..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No team members found"
          description={
            search
              ? "No team members match your search."
              : "Add your first team member to get started."
          }
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this team member."
                : "Fill in the details to add a new team member."}
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <ImageUpload
                  value={editing?.image ?? null}
                  onChange={setImageFile}
                  isUploading={isUploading}
                  label="Team member photo"
                />
                <p className="text-sm text-muted-foreground">
                  Select a new image and save to update the photo.
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={isSaving || isUploading}>
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
        title="Delete team member?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
