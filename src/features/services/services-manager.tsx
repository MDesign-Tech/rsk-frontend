"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, CheckCircle } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { serviceSchema, type ServiceInput } from "@/schemas";
import { serviceService } from "@/services/service.service";
import type { ApiResponse, Service, CloudinaryImage } from "@/types";
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
import { StatusToggle } from "@/components/ui/status-toggle";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveResource } from "@/lib/image-save";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<CloudinaryImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [viewService, setViewService] = useState<Service | null>(null);

  const imageUploadRef = useRef<ImageUploadHandle>(null);

  const isBusy = isSaving || isUploading;

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: "", description: "" },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await serviceService.getAll();
      setServices(res.data.services);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load services");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setImageData(null);
    form.reset({ title: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setImageData(null);
    form.reset({ title: service.title, description: service.description });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ServiceInput) => {
    setIsSaving(true);

    try {
      // Upload any pending image first
      const uploadedImage = await imageUploadRef.current?.upload();

      const data = {
        title: values.title,
        description: values.description,
        image: uploadedImage?.url ?? null,
        imagePublicId: uploadedImage?.publicId ?? null,
      };

      const result = await saveResource<ApiResponse<{ service: Service }>, Service>({
        save: async (): Promise<ApiResponse<{ service: Service }>> => {
          if (editing) {
            return serviceService.update(editing._id, data);
          }
          return serviceService.create(data);
        },
        getEntity: (res) => res.data.service,
        successMessage: editing ? "Service updated" : "Service created",
        showToast: false,
      });

      if (result) {
        setServices((prev) =>
          prev.map((s) => (s._id === result._id ? result : s))
        );
        if (!editing) setServices((prev) => [result, ...prev]);
        setImageData(null);
        setDialogOpen(false);
        toast.success(editing ? "Service updated successfully" : "Service created successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await serviceService.remove(deleteTarget._id);
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Service deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleVisibility = async (service: Service) => {
    setTogglingId(service._id);
    try {
      const res = await serviceService.toggleVisibility(service._id, !service.visible);
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? res.data.service : s))
      );
      toast.success(res.data.service.visible ? "Service shown" : "Service hidden");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const handleRowClick = (service: Service) => {
    setViewService(service);
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Service>[] = [
    {
      key: "icon",
      header: "",
      className: "w-12",
      render: (s) => (
        <div className="flex items-center justify-center">
          {s.image ? (
            <img
              src={s.image}
              alt={s.title}
              className="size-10 rounded-lg object-cover"
            />
          ) : (
            <CheckCircle className="size-8 text-muted-foreground" />
          )}
        </div>
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "description",
      header: "Description",
      render: (s) => {
        const words = s.description.split(" ");
        const preview =
          words.length > 3 ? words.slice(0, 3).join(" ") + "..." : s.description;
        return (
          <span className="text-sm text-foreground" title={s.description}>
            {preview}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (s) => (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <StatusToggle
                  checked={!!s.visible}
                  onCheckedChange={() => toggleVisibility(s)}
                  disabled={togglingId === s._id}
                  aria-label={s.visible ? "Hide service" : "Show service"}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {s.visible ? "Hide" : "Show"}
            </TooltipContent>
          </Tooltip>
          <IconButton
            variant="outline"
            label="Edit service"
            icon={<Pencil />}
            onClick={(e) => {
              e.stopPropagation();
              openEdit(s);
            }}
          />
          <IconButton
            variant="destructive"
            label="Delete service"
            icon={<Trash2 />}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(s);
            }}
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
          placeholder="Search services..."
        />
        <IconButton
          variant="default"
          label="Add service"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading services..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No services found"
          description={
            search
              ? "No services match your search."
              : "Create your first service to get started."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyField="_id"
          onRowClick={handleRowClick}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen && imageData && !isBusy) {
          toast.error("Please save the data or remove the image before closing.");
          return;
        }
        if (!isBusy) setDialogOpen(isOpen);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this service."
                : "Fill in the details to create a new service."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <ImageUpload
                  ref={imageUploadRef}
                  value={
                    editing?.image && editing?.imagePublicId
                      ? { url: editing.image, publicId: editing.imagePublicId }
                      : null
                  }
                  onChange={setImageData}
                  disabled={isBusy}
                  onUploadingChange={setIsUploading}
                  onProgress={setUploadProgress}
                  label="Service icon"
                />
                <p className="text-sm text-muted-foreground">
                  Upload an icon for this service. A default icon will be shown if none is provided.
                </p>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isBusy} />
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
                      <Textarea rows={4} {...field} disabled={isBusy} />
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
                  disabled={isBusy}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={isSaving} disabled={isBusy}>
                  {editing ? "Save Changes" : "Create"}
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewService} onOpenChange={(o) => !o && setViewService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewService?.title}</DialogTitle>
            <DialogDescription>Service details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {viewService?.description}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className="text-sm text-foreground">
                {viewService?.visible ? "Visible" : "Hidden"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewService(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete service?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
