"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { opportunitySchema, type OpportunityInput } from "@/schemas";
import { opportunityService } from "@/services/opportunity.service";
import type { Opportunity, OpportunityType } from "@/types";
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
import { Button } from "@/components/ui/button";
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
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

interface OpportunityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: Opportunity | null;
  types: OpportunityType[];
  defaultTypeId?: string | null;
  onSuccess: () => void;
}

export function OpportunityFormDialog({ open, onOpenChange, opportunity, types, defaultTypeId, onSuccess }: OpportunityFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<{ url: string; publicId: string } | null>(null);

  const imageUploadRef = useRef<ImageUploadHandle>(null);
  const isBusy = isSaving || isUploading;

  const form = useForm<OpportunityInput>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      type: "",
      title: "",
      org: "",
      description: "",
      category: "General",
      location: "",
      date: "",
      image: null,
      status: "Open",
    },
  });

  useEffect(() => {
    if (open) {
      if (opportunity) {
        form.reset({
          type: typeof opportunity.type === "string" ? opportunity.type : opportunity.type._id,
          title: opportunity.title,
          org: opportunity.org,
          description: opportunity.description || "",
          category: opportunity.category || "General",
          location: opportunity.location || "",
          date: opportunity.date.split('T')[0],
          image: opportunity.image || null,
          status: opportunity.status,
        });
        setImageData(
          opportunity.image
            ? { url: opportunity.image, publicId: opportunity.imagePublicId || "" }
            : null
        );
      } else {
        const initialType = defaultTypeId || types[0]?._id || "";
        form.reset({
          type: initialType,
          title: "",
          org: "",
          description: "",
          category: "General",
          location: "",
          date: "",
          image: null,
          status: "Open",
        });
        setImageData(null);
      }
    }
  }, [open, opportunity, types, defaultTypeId, form]);

  const onSubmit = async (values: OpportunityInput) => {
    setIsSaving(true);
    try {
      const uploadedImage = await imageUploadRef.current?.upload();
      const data = {
        ...values,
        image: uploadedImage?.url ?? imageData?.url ?? null,
        imagePublicId: uploadedImage?.publicId ?? imageData?.publicId ?? null,
      };

      if (opportunity) {
        await opportunityService.update(opportunity._id, data);
        toast.success("Opportunity updated successfully");
      } else {
        await opportunityService.create(data);
        toast.success("Opportunity created successfully");
      }
      setImageData(null);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save opportunity");
    } finally {
      setIsSaving(false);
    }
  };

  const isTypeLocked = !!defaultTypeId && !opportunity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{opportunity ? "Edit Opportunity" : "Create Opportunity"}</DialogTitle>
          <DialogDescription>
            {opportunity
              ? "Update the opportunity details below."
              : "Fill in the details to create a new opportunity."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSaving || isTypeLocked}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type._id} value={type._id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input {...field} disabled={isBusy} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="org"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isBusy} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isBusy} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isBusy} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <ImageUpload
                  ref={imageUploadRef}
                  value={
                    imageData
                      ? { url: imageData.url, publicId: imageData.publicId }
                      : null
                  }
                  onChange={setImageData}
                  disabled={isBusy}
                  onUploadingChange={setIsUploading}
                  onProgress={setUploadProgress}
                  label="Opportunity image"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <SubmitButton isLoading={isSaving} disabled={isBusy} type="submit">
                {opportunity ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
