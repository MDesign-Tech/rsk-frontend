"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSectionSchema, type TeamSectionInput } from "@/schemas";
import type { TeamSection } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/admin/submit-button";

export function SectionFormDialog({
  open,
  editing,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  editing: TeamSection | null;
  onOpenChange: (o: boolean) => void;
  onSubmit: (values: TeamSectionInput) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TeamSectionInput>({
    resolver: zodResolver(teamSectionSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        description: editing.description ?? "",
      });
    } else {
      form.reset({ name: "", description: "" });
    }
  }, [editing, form]);

  const isBusy = isSubmitting || form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isBusy) onOpenChange(isOpen); }}>
      <DialogContent className="flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{editing ? "Edit Section" : "Add Section"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this team section." : "Create a new team section to group members."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                setIsSubmitting(true);
                await onSubmit(values);
                setIsSubmitting(false);
                onOpenChange(false);
              })}
              className="space-y-4"
            >
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} disabled={isBusy} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><RichTextEditor value={field.value} onChange={(html) => field.onChange(html)} disabled={isBusy} showToolbar={true} minHeight="120px" /></FormControl><FormMessage /></FormItem>
              )} />
            </form>
          </Form>
        </div>
        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isBusy}>Cancel</Button>
          <SubmitButton isLoading={isBusy} disabled={isBusy}>{editing ? "Save Changes" : "Create"}</SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
