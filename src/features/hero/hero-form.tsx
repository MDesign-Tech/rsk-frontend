"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroInput } from "@/schemas";
import { heroService } from "@/services/hero.service";
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
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<HeroInput>({
    resolver: zodResolver(heroSchema),
    defaultValues: { title: "", subtitle: "", trust: "" },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await heroService.get();
        const h = res.data.hero;
        setHero(h);
        form.reset({ title: h.title, subtitle: h.subtitle, trust: h.trust });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load hero");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [form]);

  const onSubmit = async (values: HeroInput) => {
    setIsSaving(true);
    try {
      const res = await heroService.update(values);
      setHero(res.data.hero);
      toast.success("Hero content updated");

      if (imageFile) {
        setIsUploading(true);
        try {
          const up = await heroService.uploadImage(imageFile);
          setHero(up.data.hero);
          setImageFile(null);
          toast.success("Background image updated");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Image upload failed");
        } finally {
          setIsUploading(false);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSaving(false);
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
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
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
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Image</label>
            <ImageUpload
              value={hero?.bgImage ?? null}
              onChange={setImageFile}
              isUploading={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              Select a new image and save to update the background.
            </p>
          </div>
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving || isUploading}>
              Save Changes
            </SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
