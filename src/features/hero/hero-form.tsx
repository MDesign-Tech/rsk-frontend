"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroInput } from "@/schemas";
import { heroService } from "@/services/hero.service";
import { saveResource } from "@/lib/image-save";
import type { ApiResponse } from "@/types";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";
import type { HeroContent } from "@/types";

export function HeroForm() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isTogglingSubtitle, setIsTogglingSubtitle] = useState(false);
  const [isTogglingTrust, setIsTogglingTrust] = useState(false);

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
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("subtitle", values.subtitle);
    formData.append("trust", values.trust);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await saveResource<ApiResponse<{ hero: HeroContent }>, HeroContent>({
      save: async (): Promise<ApiResponse<{ hero: HeroContent }>> => heroService.update(formData),
      getEntity: (res) => res.data.hero,
      successMessage: "Hero updated successfully.",
    });
    setIsSaving(false);
    if (result) {
      setHero(result);
      setImageFile(null);
    }
  };

  // Toggle the subtitle visibility locally and persist via PATCH /hero/visibility/subtitle.
  const toggleSubtitleVisibility = async (visible: boolean) => {
    form.setValue("subtitleVisible", visible, { shouldDirty: true });
    setIsTogglingSubtitle(true);
    try {
      await heroService.updateSubtitleVisibility(visible);
      toast.success("Subtitle visibility updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update subtitle visibility");
    } finally {
      setIsTogglingSubtitle(false);
    }
  };

  // Toggle the trust text visibility locally and persist via PATCH /hero/visibility/trust.
  const toggleTrustVisibility = async (visible: boolean) => {
    form.setValue("trustVisible", visible, { shouldDirty: true });
    setIsTogglingTrust(true);
    try {
      await heroService.updateTrustVisibility(visible);
      toast.success("Trust text visibility updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update trust text visibility");
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
                      <StatusToggle
                        checked={form.watch("subtitleVisible") !== false}
                        onCheckedChange={(checked) =>
                          toggleSubtitleVisibility(checked)
                        }
                        disabled={isSaving || isTogglingSubtitle}
                        className="mt-0.5 shrink-0"
                        aria-label={
                          form.watch("subtitleVisible") === false
                            ? "Show Subtitle"
                            : "Hide Subtitle"
                        }
                      />
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
                      <StatusToggle
                        checked={form.watch("trustVisible") !== false}
                        onCheckedChange={(checked) =>
                          toggleTrustVisibility(checked)
                        }
                        disabled={isSaving || isTogglingTrust}
                        className="mt-0.5 shrink-0"
                        aria-label={
                          form.watch("trustVisible") === false
                            ? "Show Trust Text"
                            : "Hide Trust Text"
                        }
                      />
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
              value={hero?.image ?? null}
              onChange={setImageFile}
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              Select a new image and save to update the background.
            </p>
          </div>
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving}>
              Save Changes
            </SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
