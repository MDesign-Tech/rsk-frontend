"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Pencil, CheckCircle } from "lucide-react";
import { whyBecomeMemberSchema, type WhyBecomeMemberInput } from "@/schemas";
import { whyBecomeMemberService } from "@/services/why-become-member.service";
import type { WhyBecomeMemberPoint } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconButton } from "@/components/admin/icon-button";
import { FormCard } from "@/components/admin/form-card";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { StatusToggle } from "@/components/ui/status-toggle";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/admin/delete-dialog";

type Point = {
  _id?: string;
  title: string;
  description: string;
  image: string | null;
  imagePublicId: string | null;
  visible: boolean;
};

export function WhyBecomeMemberForm() {
  const [points, setPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Point | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ url: string; publicId: string } | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [sectionVisible, setSectionVisible] = useState(true);

  const imageUploadRef = useRef<ImageUploadHandle>(null);
  const isBusy = isSaving || isUploading;

  const form = useForm<WhyBecomeMemberInput>({
    resolver: zodResolver(whyBecomeMemberSchema),
    defaultValues: {
      title: sectionTitle,
      description: sectionDescription,
      visible: sectionVisible,
      points: points.map((p) => ({ title: p.title, description: p.description, image: p.image, imagePublicId: p.imagePublicId, visible: p.visible })),
    },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await whyBecomeMemberService.get();
      const data = res.data.whyBecomeMember;
      const normalizedPoints: Point[] = (data.points ?? []).map((p) => ({
        ...p,
        image: p.image ?? null,
        imagePublicId: p.imagePublicId ?? null,
        visible: p.visible ?? true,
      }));
      setPoints(normalizedPoints);
      setSectionTitle(data.title);
      setSectionDescription(data.description);
      setSectionVisible(data.visible ?? true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingPoint(null);
    setImageData(null);
    setDialogOpen(true);
  };

  const openEdit = (point: Point) => {
    setEditingPoint(point);
    setImageData(
      point.image && point.imagePublicId
        ? { url: point.image, publicId: point.imagePublicId }
        : null
    );
    setDialogOpen(true);
  };

  const onSubmit = async (values: { title: string; description: string; image: string | null; imagePublicId: string | null }) => {
    setIsSaving(true);
    try {
      const uploadedImage = await imageUploadRef.current?.upload();
      const data = {
        title: values.title,
        description: values.description,
        image: uploadedImage?.url ?? values.image,
        imagePublicId: uploadedImage?.publicId ?? values.imagePublicId,
      };

      if (editingPoint) {
        const newPoints = points.map((p) => (p._id === editingPoint._id ? { ...p, ...data } : p));
        const res = await whyBecomeMemberService.update({
          title: sectionTitle,
          description: sectionDescription,
          visible: sectionVisible,
          points: newPoints,
        });
        setPoints(res.data.whyBecomeMember.points ?? []);
        toast.success("Benefit updated");
      } else {
        const newPoints = [...points, { ...data, visible: true }];
        const res = await whyBecomeMemberService.update({
          title: sectionTitle,
          description: sectionDescription,
          visible: sectionVisible,
          points: newPoints,
        });
        setPoints(res.data.whyBecomeMember.points ?? []);
        toast.success("Benefit created");
      }
      setImageData(null);
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save benefit");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePointVisibility = async (point: Point) => {
    setTogglingId(point._id ?? null);
    try {
      const newPoints = points.map((p) => (p._id === point._id ? { ...p, visible: !p.visible } : p));
      const res = await whyBecomeMemberService.update({
        title: sectionTitle,
        description: sectionDescription,
        visible: sectionVisible,
        points: newPoints,
      });
      setPoints(res.data.whyBecomeMember.points ?? []);
      toast.success(res.data.whyBecomeMember.points.find((p) => p._id === point._id)?.visible ? "Benefit shown" : "Benefit hidden");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await whyBecomeMemberService.update({
        title: sectionTitle,
        description: sectionDescription,
        visible: sectionVisible,
        points: points.filter((p) => p._id !== deleteTarget._id),
      });
      setPoints(res.data.whyBecomeMember.points ?? []);
      setDeleteTarget(null);
      toast.success("Benefit deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    try {
      const res = await whyBecomeMemberService.update({
        title: sectionTitle,
        description: sectionDescription,
        visible: sectionVisible,
        points,
      });
      setPoints(res.data.whyBecomeMember.points ?? []);
      toast.success("Why Become Member content updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading..." />;

  return (
    <div className="space-y-6">
      <FormCard
        title="Why Become Member"
        description="Update the Why Become Member section content and benefits."
        footer={
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving} onClick={handleSaveSection}>Save Changes</SubmitButton>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              rows={4}
              value={sectionDescription}
              onChange={(e) => setSectionDescription(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Benefits</label>
              <IconButton
                variant="outline"
                label="Add benefit"
                icon={<Plus />}
                onClick={openCreate}
              />
            </div>
            {points.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No benefits yet.
              </p>
            ) : (
              <div className="rounded-lg border w-full">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b w-full">
                  <div className="w-10" />
                  <div>Title</div>
                  <div>Description</div>
                  <div className="text-right">Actions</div>
                </div>
                {points.map((point, index) => {
                  const hasImage = point.image;
                  return (
                    <div
                      key={point._id || index}
                      className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center px-4 py-3 border-b last:border-b-0 w-full ${!point.visible ? "opacity-50" : ""}`}
                    >
                      <div>
                        {hasImage ? (
                          <img src={hasImage} alt={point.title} className="size-8 rounded-full object-cover" />
                        ) : (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="font-medium">{point.title || "Untitled"}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {point.description || "No description"}
                      </div>
                      <div className="flex justify-end gap-2">
                        <StatusToggle
                          checked={!!point.visible}
                          onCheckedChange={() => togglePointVisibility(point)}
                          disabled={togglingId === point._id}
                          aria-label={point.visible ? "Hide benefit" : "Show benefit"}
                        />
                        <IconButton
                          variant="outline"
                          label="Edit benefit"
                          icon={<Pencil />}
                          onClick={() => openEdit(point)}
                        />
                        <IconButton
                          variant="destructive"
                          label="Delete benefit"
                          icon={<X />}
                          onClick={() => setDeleteTarget(point)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusToggle
              checked={sectionVisible}
              onCheckedChange={(checked) => setSectionVisible(checked)}
              disabled={isSaving}
            />
            <span className="text-sm text-muted-foreground">
              {sectionVisible ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>
      </FormCard>

      {/* Edit/Create Point Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen && imageData && !isBusy) {
          toast.error("Please save the data or remove the image before closing.");
          return;
        }
        if (!isBusy) setDialogOpen(isOpen);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPoint ? "Edit Benefit" : "Add Benefit"}</DialogTitle>
            <DialogDescription>
              {editingPoint ? "Update the benefit details." : "Fill in the details to add a new benefit."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <ImageUpload
                ref={imageUploadRef}
                value={
                  editingPoint?.image && editingPoint?.imagePublicId
                    ? { url: editingPoint.image, publicId: editingPoint.imagePublicId }
                    : imageData
                }
                onChange={setImageData}
                disabled={isBusy}
                onUploadingChange={setIsUploading}
                onProgress={setUploadProgress}
                label="Benefit image"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                {...form.register("title")}
                disabled={isBusy}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={3}
                {...form.register("description")}
                disabled={isBusy}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
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
                {editingPoint ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete benefit?"
        description={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
