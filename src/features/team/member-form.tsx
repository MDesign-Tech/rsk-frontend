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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveResource } from "@/lib/image-save";
import { deleteImage } from "@/lib/cloudinary";
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
  const [imageRemoved, setImageRemoved] = useState(false);
  const [removedPublicId, setRemovedPublicId] = useState<string | null>(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [deleteImageProgress, setDeleteImageProgress] = useState(0);
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
      setImageRemoved(false);
      setRemovedPublicId(null);
    } else {
      form.reset({
        name: "",
        title: "",
        bio: "",
        section: "",
        socialMedia: {},
      });
      setImageRemoved(false);
      setRemovedPublicId(null);
    }
  }, [editing, form]);

  const onSubmit = async (values: TeamMemberInput) => {
    try {
      // Upload any pending image first
      const uploadedImage = await imageUploadRef.current?.upload();

      let imageUrl = uploadedImage?.url ?? null;
      let imagePublicId = uploadedImage?.publicId ?? null;

      if (imageRemoved && removedPublicId) {
        setIsDeletingImage(true);
        setDeleteImageProgress(0);
        try {
          await deleteImage(removedPublicId);
          imageUrl = null;
          imagePublicId = null;
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to delete image");
          setIsDeletingImage(false);
          return;
        } finally {
          setIsDeletingImage(false);
        }
      }

      const data = {
        name: values.name,
        title: values.title,
        bio: values.bio,
        section: values.section,
        socialMedia: values.socialMedia ?? {},
        image: imageUrl,
        imagePublicId: imagePublicId,
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
        setImageRemoved(false);
        setRemovedPublicId(null);
        onOpenChange(false);
        toast.success(editing ? "Team member updated successfully" : "Team member created successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save team member");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && (imageData || imageRemoved) && !isBusy) {
      toast.error("Please save the data or remove the image before closing.");
      return;
    }
    if (!isBusy) onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{editing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the details of this team member." : "Fill in the details to add a new team member."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
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
                <FormItem><FormLabel>Bio</FormLabel><FormControl><RichTextEditor value={field.value} onChange={(html) => field.onChange(html)} disabled={isBusy} showToolbar={true} minHeight="120px" /></FormControl><FormMessage /></FormItem>
              )} />
              <SocialMediaField control={form.control} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <ImageUpload
                  ref={imageUploadRef}
                  value={
                    editing?.image && editing?.imagePublicId && !imageRemoved
                      ? { url: editing.image, publicId: editing.imagePublicId }
                      : imageData
                  }
                  onChange={setImageData}
                  onRemoved={(publicId) => {
                    setImageRemoved(true);
                    setRemovedPublicId(publicId);
                  }}
                  disabled={isBusy}
                  onUploadingChange={setIsUploading}
                  onProgress={setUploadProgress}
                  isRemoving={isDeletingImage}
                  removeProgress={deleteImageProgress}
                  label="Team member photo"
                />
                <p className="text-sm text-muted-foreground">Select a new image and save to update the photo.</p>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isBusy}>Cancel</Button>
          <SubmitButton isLoading={form.formState.isSubmitting} disabled={isBusy}>{editing ? "Save Changes" : "Create"}</SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
