"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroInput } from "@/schemas";
import { heroService } from "@/services/hero.service";
import { saveResource } from "@/lib/image-save";
import { deleteImage } from "@/lib/cloudinary";
import type { ApiResponse, CloudinaryImage, HeroServiceItem } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import type { HeroContent } from "@/types";

export function HeroForm() {
  const { hasPermission } = useAuthStore();
  const canCreateHero = hasPermission("Hero", "create");
  const canUpdateHero = hasPermission("Hero", "update");
  const canDeleteHero = hasPermission("Hero", "delete");

  const [hero, setHero] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<CloudinaryImage | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [removedPublicId, setRemovedPublicId] = useState<string | null>(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [deleteImageProgress, setDeleteImageProgress] = useState(0);
  const imageUploadRef = useRef<ImageUploadHandle>(null);

  const form = useForm<HeroInput>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      services: [],
    },
  });

  const services = form.watch("services");

  useEffect(() => {
    (async () => {
      try {
        const res = await heroService.get();
        const h = res.data.hero;
        setHero(h);
        setImageRemoved(false);
        setRemovedPublicId(null);
        form.reset({
          title: h.title,
          services: h.services || [],
        });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast.error(err instanceof Error ? err.message : "Failed to load hero");
      }
    })();
  }, [form]);

  const addService = () => {
    const current = form.getValues("services");
    form.setValue("services", [...current, { text: "", visible: true }], { shouldDirty: true });
  };

  const removeService = (index: number) => {
    const current = form.getValues("services");
    form.setValue(
      "services",
      current.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const toggleServiceVisibility = (index: number) => {
    const current = form.getValues("services");
    const updated = current.map((item, i) =>
      i === index ? { ...item, visible: !item.visible } : item
    );
    form.setValue("services", updated, { shouldDirty: true });
  };

  const onSubmit = async (values: HeroInput) => {
    setIsSaving(true);

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
          setIsSaving(false);
          setIsDeletingImage(false);
          return;
        } finally {
          setIsDeletingImage(false);
        }
      }

      const data = {
        title: values.title,
        services: values.services,
        image: imageUrl,
        imagePublicId: imagePublicId,
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
        setImageRemoved(false);
        setRemovedPublicId(null);
        toast.success("Hero updated successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update hero");
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium">Sentences</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addService}
                disabled={!canCreateHero}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Sentence
              </Button>
            </div>

            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 border rounded-md"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Enter a sentence..."
                    value={service.text}
                    onChange={(e) => {
                      const updated = services.map((item, i) =>
                        i === index ? { ...item, text: e.target.value } : item
                      );
                      form.setValue("services", updated, { shouldDirty: true });
                    }}
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <StatusToggle
                        checked={service.visible !== false}
                        onCheckedChange={() => toggleServiceVisibility(index)}
                        disabled={isSaving || !canUpdateHero}
                        aria-label={
                          service.visible === false
                            ? "Show Sentence"
                            : "Hide Sentence"
                        }
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {service.visible === false ? "Show Sentence" : "Hide Sentence"}
                  </TooltipContent>
                </Tooltip>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeService(index)}
                  disabled={isSaving || !canDeleteHero}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {services.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No sentences added. Click "Add Sentence" to create one.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Background Image</label>
            <ImageUpload
              ref={imageUploadRef}
              value={
                hero?.image && hero?.imagePublicId && !imageRemoved
                  ? { url: hero.image, publicId: hero.imagePublicId }
                  : imageData
              }
              onChange={setImageData}
              onRemoved={(publicId) => {
                setImageRemoved(true);
                setRemovedPublicId(publicId);
              }}
              disabled={isSaving}
              onUploadingChange={setIsUploading}
              onProgress={setUploadProgress}
              isRemoving={isDeletingImage}
              removeProgress={deleteImageProgress}
            />
            <p className="text-sm text-muted-foreground">
              Select a new image and save to update the background.
            </p>
          </div>
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving} disabled={!canUpdateHero}>Save Changes</SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
