"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsInput } from "@/schemas";
import { newsService, type NewsArticle } from "@/services/news.service";
import { categoryService } from "@/services/category.service";
import { teamService } from "@/services/team.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Category, CloudinaryImage, EditorImage, TeamMember } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: NewsArticle | null;
  defaultCategory?: string;
  onSuccess: () => void;
}

export function NewsFormDialog({ open, onOpenChange, article, defaultCategory, onSuccess }: NewsFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<CloudinaryImage | null>(null);
  const [authors, setAuthors] = useState<TeamMember[]>([] as TeamMember[]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [useRskAssociates, setUseRskAssociates] = useState(true);
  const [editorImages, setEditorImages] = useState<EditorImage[]>([]);

  const imageUploadRef = useRef<ImageUploadHandle>(null);
  const isBusy = isSaving || isUploading;

  const { user, hasPermission } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const canSelectAuthor = hasPermission("news", "create") || hasPermission("news", "update");

  const rskAssociatesAuthor = authors.find(a => a.name === "RSK Associates");
  const rskAssociatesId = rskAssociatesAuthor?._id ?? "";

  const form = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
      coverImage: null,
      category: "",
      authorId: "",
      status: "draft",
      editorImages: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (article) {
        const categoryName =
          typeof article.category === "string"
            ? article.category
            : article.category?.name ?? "";
        const isRskAuthor = article.author.name === "RSK Associates";
        form.reset({
          title: article.title,
          content: typeof article.content === "string" ? article.content : JSON.stringify(article.content),
          coverImage: article.coverImage || null,
          category: categoryName,
          authorId: article.author._id,
          status: article.status,
          editorImages: article.editorImages || [],
        });
        setUseRskAssociates(isRskAuthor);
        setEditorImages(article.editorImages || []);
        setImageData(
          article.coverImage
            ? { url: article.coverImage, publicId: article.coverImagePublicId || "" }
            : null,
        );
      } else {
        const defaultAuthorId = !isAdmin && canSelectAuthor
          ? (user?.member && typeof user.member === 'object' && '_id' in user.member
              ? (user.member as { _id: string })._id
              : rskAssociatesId)
          : rskAssociatesId;
        form.reset({
          title: "",
          content: "",
          coverImage: "",
          category: defaultCategory ?? "",
          authorId: defaultAuthorId || "",
          status: "draft",
          editorImages: [],
        });
        setUseRskAssociates(true);
        setEditorImages([]);
        setImageData(null);
      }
      loadAuthors();
      loadCategories();
    }
  }, [open, article, defaultCategory, form, rskAssociatesId, isAdmin, canSelectAuthor, user]);

  const loadAuthors = async () => {
    setLoadingAuthors(true);
    try {
      const res = await teamService.getAll();
      setAuthors(res.data.teamMembers.filter(m => m.visible));
    } catch (err) {
      toast.error("Failed to load authors");
    } finally {
      setLoadingAuthors(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.categories);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const onSubmit = async (values: NewsInput) => {
    setIsSaving(true);

    try {
      const uploadedImage = await imageUploadRef.current?.upload();

      const data = {
        ...values,
        coverImage: uploadedImage?.url ?? imageData?.url ?? null,
        coverImagePublicId: uploadedImage?.publicId ?? imageData?.publicId ?? null,
        editorImages,
      };

      if (article) {
        await newsService.update(article._id, data);
        toast.success("Article updated successfully");
      } else {
        await newsService.create(data);
        toast.success("Article created successfully");
      }
      setImageData(null);
      setEditorImages([]);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRskAssociatesChange = (checked: boolean) => {
    setUseRskAssociates(checked);
    if (checked && rskAssociatesId) {
      form.setValue("authorId", rskAssociatesId);
    } else if (!checked) {
      form.setValue("authorId", "");
    }
  };

  const handleEditorChange = (html: string, images: EditorImage[]) => {
    form.setValue("content", html);
    setEditorImages(images);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && imageData && !isBusy) {
        toast.error("Please save the data or remove the image before closing.");
        return;
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? "Edit Article" : "Create Article"}</DialogTitle>
          <DialogDescription>
            {article
              ? "Update the article details below."
              : "Fill in the details to create a new article."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isBusy} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={handleEditorChange}
                      editorImages={editorImages}
                      disabled={isBusy}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUpload
                  ref={imageUploadRef}
                  value={
                    imageData
                      ? { url: imageData.url, publicId: imageData.publicId }
                      : null
                  }
                  onChange={setImageData}
                  disabled={isBusy}
                  onUploadingChange={setIsUploading}
                  onProgress={setUploadProgress}
                  label="Article cover image"
                />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isBusy || loadingCategories}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAdmin && canSelectAuthor && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="use-rsk-associates"
                    checked={useRskAssociates}
                    onCheckedChange={handleRskAssociatesChange}
                    disabled={isBusy}
                  />
                  <label
                    htmlFor="use-rsk-associates"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    RSK Associates
                  </label>
                </div>
              )}
              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => {
                  const isDisabled = isBusy || loadingAuthors || (!isAdmin && !canSelectAuthor) || (isAdmin && useRskAssociates);
                  const selectedAuthor = authors.find(a => a._id === field.value);
                  const displayValue = selectedAuthor
                    ? `${selectedAuthor.name} - ${selectedAuthor.title}`
                    : field.value;

                  if (!isAdmin && canSelectAuthor) {
                    return (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input
                            value={displayValue || (user?.member && typeof user.member === 'object' && 'name' in user.member ? (user.member as { name: string }).name : "RSK Associates")}
                            disabled={true}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }

                  return (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingAuthors ? "Loading..." : "Select author"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author._id} value={author._id}>
                              {author.name} - {author.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isBusy}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <SubmitButton isLoading={isBusy} disabled={isBusy}>
                {article ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
