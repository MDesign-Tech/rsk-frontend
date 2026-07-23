"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { opportunitySchema, type OpportunityInput } from "@/schemas";
import { opportunityService, type Opportunity } from "@/services/opportunity.service";
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
import { StatusToggle } from "@/components/ui/status-toggle";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

interface OpportunityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: Opportunity | null;
  onSuccess: () => void;
}

export function OpportunityFormDialog({ open, onOpenChange, opportunity, onSuccess }: OpportunityFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<OpportunityInput>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      type: "Tender",
      title: "",
      org: "",
      shortDescription: "",
      description: "",
      category: "",
      location: "",
      employmentType: "",
      salary: "",
      budget: "",
      date: "",
      contactEmail: "",
      contactPhone: "",
      requirements: "",
      benefits: "",
      featured: false,
      status: "active",
      visible: true,
      image: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (opportunity) {
        form.reset({
          type: opportunity.type,
          title: opportunity.title,
          org: opportunity.organization.name,
          shortDescription: opportunity.shortDescription,
          description: opportunity.description,
          category: opportunity.category,
          location: opportunity.location,
          employmentType: opportunity.employmentType || "",
          salary: opportunity.salary || "",
          budget: opportunity.budget || "",
          date: opportunity.deadline.split('T')[0],
          contactEmail: opportunity.contact.email,
          contactPhone: opportunity.contact.phone,
          requirements: opportunity.requirements.join("\n"),
          benefits: opportunity.benefits.join("\n"),
          featured: opportunity.featured,
          status: opportunity.status === "Open" ? "active" : "closed",
          visible: opportunity.visible,
          image: opportunity.image || null,
        });
      } else {
        form.reset({
          type: "Tender",
          title: "",
          org: "",
          shortDescription: "",
          description: "",
          category: "",
          location: "",
          employmentType: "",
          salary: "",
          budget: "",
          date: "",
          contactEmail: "",
          contactPhone: "",
          requirements: "",
          benefits: "",
          featured: false,
          status: "active",
          visible: true,
          image: null,
        });
      }
    }
  }, [open, opportunity, form]);

  const onSubmit = async (values: OpportunityInput) => {
    setIsSaving(true);
    try {
      const data = {
        ...values,
        requirements: values.requirements.split("\n").filter(Boolean),
        benefits: values.benefits.split("\n").filter(Boolean),
      };

      if (opportunity) {
        await opportunityService.update(opportunity._id, data);
        toast.success("Opportunity updated successfully");
      } else {
        await opportunityService.create(data);
        toast.success("Opportunity created successfully");
      }
      setIsSaving(false);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Failed to save opportunity");
    }
  };

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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSaving}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Tender">Tender</SelectItem>
                        <SelectItem value="Job">Job</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Consultancy">Consultancy</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="RFP">RFP</SelectItem>
                        <SelectItem value="RFQ">RFQ</SelectItem>
                        <SelectItem value="EOI">EOI</SelectItem>
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
                      <Input {...field} disabled={isSaving} />
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
                    <Input {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} disabled={isSaving} />
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
                    <Textarea rows={4} {...field} disabled={isSaving} />
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
                      <Input {...field} disabled={isSaving} />
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
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
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
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements (one per line)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits (one per line)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <ImageUpload
                value={form.watch("image") ? { url: form.watch("image") as string, publicId: "" } : null}
                onChange={(data) => form.setValue("image", data?.url ?? null)}
                disabled={isSaving}
                onUploadingChange={setIsUploading}
                label="Opportunity image"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <StatusToggle
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                  disabled={isSaving}
                />
                <span className="text-sm text-muted-foreground">
                  {form.watch("featured") ? "Featured" : "Not featured"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusToggle
                  checked={form.watch("visible")}
                  onCheckedChange={(checked) => form.setValue("visible", checked)}
                  disabled={isSaving}
                />
                <span className="text-sm text-muted-foreground">
                  {form.watch("visible") ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <SubmitButton isLoading={isSaving} disabled={isSaving}>
                {opportunity ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
