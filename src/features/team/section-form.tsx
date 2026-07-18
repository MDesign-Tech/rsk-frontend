"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSectionSchema, type TeamSectionInput } from "@/schemas";
import type { TeamSection } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Section" : "Add Section"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this team section." : "Create a new team section to group members."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values);
              onOpenChange(false);
            })}
            className="space-y-4"
          >
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <SubmitButton isLoading={form.formState.isSubmitting}>{editing ? "Save Changes" : "Create"}</SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
