"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { partnerSchema, type PartnerInput } from "@/schemas";
import { partnerService } from "@/services/partner.service";
import type { Partner } from "@/types";
import { getImageUrl } from "@/lib/image";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    defaultValues: { name: "" },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await partnerService.getAll();
      setPartners(res.data.partners);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(
        err instanceof Error ? err.message : "Failed to load partners",
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    form.reset({ name: "" });
    setDialogOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setEditing(partner);
    setImageFile(null);
    form.reset({ name: partner.name });
    setDialogOpen(true);
  };

  const onSubmit = async (values: PartnerInput) => {
    setIsSaving(true);
    try {
      let saved: Partner;
      if (editing) {
        const res = await partnerService.update(editing._id, values);
        saved = res.data.partner;
        setPartners((prev) =>
          prev.map((p) => (p._id === editing._id ? saved : p)),
        );
        toast.success("Partner updated");
      } else {
        const res = await partnerService.create(values);
        saved = res.data.partner;
        setPartners((prev) => [saved, ...prev]);
        toast.success("Partner created");
      }

      if (imageFile) {
        setIsUploading(true);
        try {
          const up = await partnerService.uploadImage(saved._id, imageFile);
          setPartners((prev) =>
            prev.map((p) => (p._id === saved._id ? up.data.partner : p)),
          );
          setIsUploading(false);
          toast.success("Image uploaded");
        } catch (err) {
          setIsUploading(false);
          toast.error(
            err instanceof Error ? err.message : "Image upload failed",
          );
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
      await partnerService.remove(deleteTarget._id);
      setPartners((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Partner deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleVisibility = async (partner: Partner) => {
    const next = !partner.visible;
    try {
      const res = await partnerService.toggleVisibility(partner._id, next);
      setPartners((prev) =>
        prev.map((p) => (p._id === partner._id ? res.data.partner : p)),
      );
      toast.success(next ? "Partner shown" : "Partner hidden");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update visibility",
      );
    }
  };

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Partner>[] = [
    {
      key: "name",
      header: "Partner",
      render: (p) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(p.image) ?? "/images/8.jpg"}
            alt={p.name}
            className="size-9 rounded object-contain bg-muted"
          />
          <span className="font-medium">{p.name}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label={p.visible === false ? "Show partner" : "Hide partner"}
            icon={p.visible === false ? <EyeOff /> : <Eye />}
            onClick={() => toggleVisibility(p)}
          />
          <IconButton
            variant="outline"
            label="Edit partner"
            icon={<Pencil />}
            onClick={() => openEdit(p)}
          />
          <IconButton
            variant="destructive"
            label="Delete partner"
            icon={<Trash2 />}
            onClick={() => setDeleteTarget(p)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search partners..."
        />
        <IconButton
          variant="default"
          label="Add partner"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading partners..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No partners found"
          description={
            search
              ? "No partners match your search."
              : "Add your first partner to get started."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyField="_id"
          getRowClassName={(p) =>
            p.visible === false ? "bg-muted/50 opacity-70" : ""
          }
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Partner" : "Add Partner"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this partner."
                : "Fill in the details to create a new partner."}
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo</label>
                <ImageUpload
                  value={editing?.image ?? null}
                  onChange={setImageFile}
                  isUploading={isUploading}
                  label="Partner logo"
                />
                <p className="text-sm text-muted-foreground">
                  Select a new image and save to update the logo.
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
        title="Delete partner?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
