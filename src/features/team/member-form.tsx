"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { teamMemberSchema, type TeamMemberInput } from "@/schemas";
import { teamService } from "@/services/team.service";
import type { ApiResponse, TeamMember, TeamSection } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveResource } from "@/lib/image-save";
import { toast } from "sonner";
import { SocialMediaField } from "./social-media-field";

export function MemberFormDialog({
  open,
  editing,
  sections,
  imageFile,
  setImageFile,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: TeamMember | null;
  sections: TeamSection[];
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  onOpenChange: (o: boolean) => void;
  onSaved: (m: TeamMember) => void;
}) {
  const form = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      section: "",
      socialMedia: {},
    },
  });

  useEffect(() => {
    if (editing) {
      const sectionId = typeof editing.section === "string" ? editing.section : editing.section?._id ?? "";
      const sm = editing.socialMedia ?? {};
      const toSocialInput = (link?: { href?: string | null; visible?: boolean }) => ({
        href: link?.href ?? "",
        visible: link?.visible ?? true,
      });
      form.reset({
        name: editing.name,
        title: editing.title,
        bio: editing.bio ?? "",
        section: sectionId,
        socialMedia: {
          facebook: toSocialInput(sm.facebook),
          instagram: toSocialInput(sm.instagram),
          whatsapp: toSocialInput(sm.whatsapp),
          x: toSocialInput(sm.x),
          linkedin: toSocialInput(sm.linkedin),
          youtube: toSocialInput(sm.youtube),
        },
      });
    } else {
      form.reset({
        name: "",
        title: "",
        bio: "",
        section: "",
        socialMedia: {},
      });
    }
  }, [editing, form]);

  const onSubmit = async (values: TeamMemberInput) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("title", values.title);
    formData.append("bio", values.bio);
    formData.append("section", values.section);
    formData.append("socialMedia", JSON.stringify(values.socialMedia ?? {}));
    if (imageFile) formData.append("image", imageFile);

    const result = await saveResource<ApiResponse<{ teamMember: TeamMember }>, TeamMember>({
      save: () =>
        editing ? teamService.update(editing._id, formData) : teamService.create(formData),
      getEntity: (res) => res.data.teamMember,
      successMessage: editing ? "Team member updated successfully." : "Team member created successfully.",
    });
    if (result) {
      onSaved(result);
      setImageFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the details of this team member." : "Fill in the details to add a new team member."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="section" render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a section" /></SelectTrigger></FormControl>
                  <SelectContent>{sections.map((s) => (<SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <SocialMediaField control={form.control} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo</label>
              <ImageUpload value={editing?.image ?? null} onChange={setImageFile} disabled={form.formState.isSubmitting} label="Team member photo" />
              <p className="text-sm text-muted-foreground">Select a new image and save to update the photo.</p>
            </div>
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
