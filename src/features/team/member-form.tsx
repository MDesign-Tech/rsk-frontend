"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { teamMemberSchema, type TeamMemberInput } from "@/schemas";
import { teamService } from "@/services/team.service";
import type { ApiResponse, TeamMember, TeamSection, CloudinaryImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveResource } from "@/lib/image-save";
import { toast } from "sonner";
import { SocialMediaField } from "./social-media-field";

export function MemberFormDialog({
  open,
  editing,
  sections,
  imageData,
  setImageData,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: TeamMember | null;
  sections: TeamSection[];
  imageData: CloudinaryImage | null;
  setImageData: (d: CloudinaryImage | null) => void;
  onOpenChange: (o: boolean) => void;
  onSaved: (m: TeamMember) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageUploadRef = useRef<ImageUploadHandle>(null);
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

  const isBusy = isUploading || form.formState.isSubmitting;

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
    try {
      // Upload any pending image first
      const uploadedImage = await imageUploadRef.current?.upload();

      const data = {
        name: values.name,
        title: values.title,
        bio: values.bio,
        section: values.section,
        socialMedia: values.socialMedia ?? {},
        image: uploadedImage?.url ?? null,
        imagePublicId: uploadedImage?.publicId ?? null,
      };

      const result = await saveResource<ApiResponse<{ teamMember: TeamMember }>, TeamMember>({
        save: () =>
          editing ? teamService.update(editing._id, data) : teamService.create(data),
        getEntity: (res) => res.data.teamMember,
        successMessage: editing ? "Team member updated successfully." : "Team member created successfully.",
        showToast: false,
      });

      if (result) {
        onSaved(result);
        setImageData(null);
        onOpenChange(false);
        toast.success(editing ? "Team member updated successfully" : "Team member created successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save team member");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && imageData && !isBusy) {
      toast.error("Please save the data or remove the image before closing.");
      return;
    }
    if (!isBusy) onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} disabled={isBusy} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} disabled={isBusy} /></FormControl><FormMessage /></FormItem>
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
              <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea rows={3} {...field} disabled={isBusy} /></FormControl><FormMessage /></FormItem>
            )} />
            <SocialMediaField control={form.control} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo</label>
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
                label="Team member photo"
              />
              <p className="text-sm text-muted-foreground">Select a new image and save to update the photo.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isBusy}>Cancel</Button>
              <SubmitButton isLoading={form.formState.isSubmitting} disabled={isBusy}>{editing ? "Save Changes" : "Create"}</SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
