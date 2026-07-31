"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroInput } from "@/schemas";
import { heroService } from "@/services/hero.service";
import { saveResource } from "@/lib/image-save";
import { deleteImage } from "@/lib/cloudinary";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { ApiResponse, CloudinaryImage, HeroServiceItem, HeroImage } from "@/types";
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
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Check, Upload } from "lucide-react";
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
  const [images, setImages] = useState<HeroImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<HeroInput>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      services: [],
      images: [],
    },
  });

  const services = form.watch("services");

  useEffect(() => {
    (async () => {
      try {
        const res = await heroService.get();
        const h = res.data.hero;
        setHero(h);
        setImages(h.images || []);
        form.reset({
          title: h.title,
          services: h.services || [],
          images: h.images || [],
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const imageData = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      const newImage: HeroImage = {
        url: imageData.url,
        publicId: imageData.publicId,
        isActive: images.length === 0, // First image is active by default
      };

      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      form.setValue("images", updatedImages, { shouldDirty: true });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const setActiveImage = (publicId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isActive: img.publicId === publicId,
    }));
    setImages(updatedImages);
    form.setValue("images", updatedImages, { shouldDirty: true });
  };

  const removeImage = async (publicId: string) => {
    if (!canDeleteHero) return;

    try {
      setDeletingImageId(publicId);
      await deleteImage(publicId);
      const updatedImages = images.filter((img) => img.publicId !== publicId);
      setImages(updatedImages);
      form.setValue("images", updatedImages, { shouldDirty: true });
      toast.success("Image removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete image");
    } finally {
      setDeletingImageId(null);
    }
  };

  const onSubmit = async (values: HeroInput) => {
    setIsSaving(true);

    try {
      const data = {
        title: values.title,
        services: values.services,
        images: values.images,
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
        setImages(result.images || []);
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium">Background Images</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !canCreateHero}
                className="gap-1"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? `Uploading ${uploadProgress}%` : "Upload Image"}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {isUploading && (
              <div className="w-full">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading {uploadProgress}%
                </p>
              </div>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.publicId}
                    className={`relative group rounded-lg border-2 overflow-hidden transition-all ${
                      image.isActive
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="aspect-video relative bg-muted">
                      <img
                        src={image.url}
                        alt={image.publicId}
                        className="h-full w-full object-cover"
                      />
                      {/* Active checkbox - top left */}
                      <button
                        type="button"
                        onClick={() => setActiveImage(image.publicId)}
                        className={`absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          image.isActive
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-white/80 border-white/50 hover:border-white"
                        }`}
                        title={image.isActive ? "Active image" : "Set as active"}
                      >
                        {image.isActive && <Check className="size-4" />}
                      </button>
                      {/* Delete button - top right */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image.publicId)}
                        disabled={isSaving || deletingImageId === image.publicId}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-mono truncate" title={image.publicId}>
                        {image.publicId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No images uploaded. Click "Upload Image" to add background images.
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving} disabled={!canUpdateHero}>
              Save Changes
            </SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
