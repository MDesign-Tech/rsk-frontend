"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { newsSchema, type NewsInput } from "@/schemas";
import { newsService, type NewsArticle } from "@/services/news.service";
import { teamService } from "@/services/team.service";
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
import { Button } from "@/components/ui/button";
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
import { StatusToggle } from "@/components/ui/status-toggle";
import { ImageUpload, type ImageUploadHandle } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: NewsArticle | null;
  onSuccess: () => void;
}

export function NewsFormDialog({ open, onOpenChange, article, onSuccess }: NewsFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [authors, setAuthors] = useState<{ _id: string; name: string; title: string }[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  const form = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "General",
      authorId: "",
      featured: false,
      status: "draft",
      readingTime: 5,
    },
  });

  useEffect(() => {
    if (open) {
      if (article) {
        form.reset({
          title: article.title,
          excerpt: article.excerpt,
          content: typeof article.content === 'string' ? article.content : JSON.stringify(article.content),
          coverImage: article.coverImage,
          category: article.category,
          authorId: article.author._id,
          featured: article.featured,
          status: article.status,
          readingTime: article.readingTime,
        });
      } else {
        form.reset({
          title: "",
          excerpt: "",
          content: "",
          coverImage: "",
          category: "General",
          authorId: "",
          featured: false,
          status: "draft",
          readingTime: 5,
        });
      }
      loadAuthors();
    }
  }, [open, article, form]);

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

  const onSubmit = async (values: NewsInput) => {
    setIsSaving(true);
    try {
      const coverImage = values.coverImage || "";

      if (article) {
        await newsService.update(article._id, {
          ...values,
          coverImage,
        } as any);
        toast.success("Article updated successfully");
      } else {
        await newsService.create({
          ...values,
          coverImage,
        } as any);
        toast.success("Article created successfully");
      }
      setIsSaving(false);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Failed to save article");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <Input {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} disabled={isSaving} />
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
                    <Textarea rows={8} {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <ImageUpload
                value={form.watch("coverImage") ? { url: form.watch("coverImage"), publicId: "" } : null}
                onChange={(data) => form.setValue("coverImage", data?.url ?? "")}
                disabled={isSaving}
                onUploadingChange={setIsUploading}
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSaving}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSaving || loadingAuthors}>
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
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSaving}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Time (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <StatusToggle
                checked={form.watch("featured")}
                onCheckedChange={(checked) => form.setValue("featured", checked)}
                disabled={isSaving}
              />
              <span className="text-sm text-muted-foreground">
                {form.watch("featured") ? "Featured" : "Not featured"}
              </span>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <SubmitButton isLoading={isSaving} disabled={isSaving}>
                {article ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
