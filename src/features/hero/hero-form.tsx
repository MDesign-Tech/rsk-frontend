"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroInput } from "@/schemas";
import { heroService } from "@/services/hero.service";
import { saveResource } from "@/lib/image-save";
import type { ApiResponse, CloudinaryImage } from "@/types";
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
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormCard } from "@/components/admin/form-card";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";
import type { HeroContent } from "@/types";

export function HeroForm() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<CloudinaryImage | null>(null);
  const [isTogglingSubtitle, setIsTogglingSubtitle] = useState(false);
  const [isTogglingTrust, setIsTogglingTrust] = useState(false);
  const imageUploadRef = useRef<ImageUploadHandle>(null);

  const form = useForm<HeroInput>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      trust: "",
      subtitleVisible: true,
      trustVisible: true,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await heroService.get();
        const h = res.data.hero;
        setHero(h);
        form.reset({
          title: h.title,
          subtitle: h.subtitle,
          trust: h.trust,
          subtitleVisible: h.subtitleVisible ?? true,
          trustVisible: h.trustVisible ?? true,
        });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast.error(err instanceof Error ? err.message : "Failed to load hero");
      }
    })();
  }, [form]);

  const onSubmit = async (values: HeroInput) => {
    setIsSaving(true);

    try {
      // Upload any pending image first
      const uploadedImage = await imageUploadRef.current?.upload();

      const data = {
        title: values.title,
        subtitle: values.subtitle,
        trust: values.trust,
        subtitleVisible: values.subtitleVisible,
        trustVisible: values.trustVisible,
        image: uploadedImage?.url ?? null,
        imagePublicId: uploadedImage?.publicId ?? null,
      };

      const result = await saveResource<
        ApiResponse<{ hero: HeroContent }>,
        HeroContent
      >({
        save: async (): Promise<ApiResponse<{ hero: HeroContent }>> =>
          heroService.update(data),
        getEntity: (res) => res.data.hero,
        successMessage: "Hero updated successfully.",
        showToast: false,
      });

      if (result) {
        setHero(result);
        setImageData(null);
        toast.success("Hero updated successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update hero");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle the subtitle visibility locally and persist via PATCH /hero/visibility/subtitle.
  const toggleSubtitleVisibility = async () => {
    const current = form.getValues("subtitleVisible");
    const next = !current;
    form.setValue("subtitleVisible", next, { shouldDirty: true });
    setIsTogglingSubtitle(true);
    try {
      await heroService.updateSubtitleVisibility(next);
      toast.success("Subtitle visibility updated.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update subtitle visibility",
      );
    } finally {
      setIsTogglingSubtitle(false);
    }
  };

  // Toggle the trust text visibility locally and persist via PATCH /hero/visibility/trust.
  const toggleTrustVisibility = async () => {
    const current = form.getValues("trustVisible");
    const next = !current;
    form.setValue("trustVisible", next, { shouldDirty: true });
    setIsTogglingTrust(true);
    try {
      await heroService.updateTrustVisibility(next);
      toast.success("Trust text visibility updated.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update trust text visibility",
      );
    } finally {
      setIsTogglingTrust(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading hero..." />;

  return (
    <FormCard
      title="Hero Section"
      description="Update the main hero content shown on the homepage."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <StatusToggle
                          checked={form.watch("subtitleVisible") !== false}
                          onCheckedChange={toggleSubtitleVisibility}
                          disabled={isSaving || isTogglingSubtitle}
                          aria-label={
                            form.watch("subtitleVisible") === false
                              ? "Show Subtitle"
                              : "Hide Subtitle"
                          }
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {form.watch("subtitleVisible") === false
                        ? "Show Subtitle"
                        : "Hide Subtitle"}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trust"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trust Text</FormLabel>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <StatusToggle
                          checked={form.watch("trustVisible") !== false}
                          onCheckedChange={toggleTrustVisibility}
                          disabled={isSaving || isTogglingTrust}
                          className="mt-0.5 shrink-0"
                          aria-label={
                            form.watch("trustVisible") === false
                              ? "Show Trust Text"
                              : "Hide Trust Text"
                          }
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {form.watch("trustVisible") === false
                        ? "Show Trust Text"
                        : "Hide Trust Text"}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Image</label>
            <ImageUpload
              ref={imageUploadRef}
              value={
                hero?.image && hero?.imagePublicId
                  ? { url: hero.image, publicId: hero.imagePublicId }
                  : null
              }
              onChange={setImageData}
              disabled={isSaving}
              onUploadingChange={setIsUploading}
              onProgress={setUploadProgress}
            />
            <p className="text-sm text-muted-foreground">
              Select a new image and save to update the background.
            </p>
          </div>
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving}>Save Changes</SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
