"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { opportunitySchema, type OpportunityInput } from "@/schemas";
import type { Opportunity } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImageUpload } from "@/components/admin/image-upload";

interface OpportunityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OpportunityInput, image?: File | null) => void;
  editing?: Opportunity | null;
  isSaving?: boolean;
}

export function OpportunityForm({
  open,
  onOpenChange,
  onSubmit,
  editing,
  isSaving = false,
}: OpportunityFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const form = useForm<OpportunityInput>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      type: "Tender",
      title: "",
      org: "",
      date: "",
      image: "",
      status: "active",
      visible: true,
      shortDescription: "",
      description: "",
      category: "",
      location: "",
      employmentType: null,
      salary: null,
      budget: null,
      contactEmail: "",
      contactPhone: "",
      requirements: [],
      benefits: [],
      featured: false,
    },
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        type: editing.type,
        title: editing.title,
        org: editing.organization.name,
        date: editing.deadline,
        image: editing.image,
        status: editing.status === "Open" ? "active" : "closed",
        visible: true,
        shortDescription: editing.shortDescription,
        description: editing.description,
        category: editing.category,
        location: editing.location,
        employmentType: editing.employmentType,
        salary: editing.salary,
        budget: editing.budget,
        contactEmail: editing.contact.email,
        contactPhone: editing.contact.phone,
        requirements: editing.requirements,
        benefits: editing.benefits,
        featured: editing.featured,
      });
    } else {
      form.reset({
        type: "Tender",
        title: "",
        org: "",
        date: "",
        image: "",
        status: "active",
        visible: true,
        shortDescription: "",
        description: "",
        category: "",
        location: "",
        employmentType: null,
        salary: null,
        budget: null,
        contactEmail: "",
        contactPhone: "",
        requirements: [],
        benefits: [],
        featured: false,
      });
    }
    setImage(null);
  }, [editing, form]);

  const handleSubmit = (values: OpportunityInput) => {
    onSubmit(values, image);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Opportunity" : "Add Opportunity"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details of this opportunity."
              : "Fill in the details to create a new opportunity."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <SelectItem value="RFP">RFP</SelectItem>
                        <SelectItem value="RFQ">RFQ</SelectItem>
                        <SelectItem value="EOI">EOI</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter opportunity title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="org"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Ministry of Finance" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(file) => {
                        if (file) {
                          setImage(file);
                        }
                      }}
                    />
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
                    <Textarea
                      {...field}
                      placeholder="Brief summary for listing cards"
                      rows={2}
                    />
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
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detailed description of the opportunity"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Finance, IT, Health" />
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
                      <Input {...field} placeholder="e.g. Kigali, Rwanda" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary / Stipend</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="e.g. $500/month" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="e.g. $50,000" />
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
                      <Input {...field} type="email" placeholder="contact@example.com" />
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
                    <Input {...field} placeholder="+250 788 000 000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 rounded-lg border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="size-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
  );
}
