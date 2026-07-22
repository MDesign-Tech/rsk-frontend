"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsInput } from "@/schemas";
import type { NewsArticle, TeamMember, ContentBlock } from "@/types";
import { teamService } from "@/services/team";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { ImageUpload } from "@/components/admin/image-upload";
import { Loader2 } from "lucide-react";
import { BlockEditor } from "@/features/articles/block-editor";

interface NewsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewsInput, image: File | null, content: ContentBlock[]) => void;
  editing?: NewsArticle | null;
  isSaving?: boolean;
}

export function NewsForm({
  open,
  onOpenChange,
  onSubmit,
  editing,
  isSaving = false,
}: NewsFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  const form = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: [],
      category: "",
      author: "",
      status: "published",
      featured: false,
      readingTime: 5,
    },
  });

  // Load team members for the author dropdown whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoadingTeam(true);
    teamService
      .list()
      .then((members) => {
        if (active) setTeamMembers(members);
      })
      .catch(() => {
        if (active) setTeamMembers([]);
      })
      .finally(() => {
        if (active) setLoadingTeam(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (editing) {
      form.reset({
        title: editing.title,
        excerpt: editing.excerpt,
        content: Array.isArray(editing.content) ? editing.content : [],
        category: editing.category,
        author: editing.author._id,
        status: editing.status,
        featured: editing.featured,
        readingTime: editing.readingTime,
      });
      // Convert HTML content to blocks if needed, or use existing blocks
      if (editing.content && Array.isArray(editing.content)) {
        setContentBlocks(editing.content);
      } else {
        setContentBlocks([]);
      }
    } else {
      form.reset({
        title: "",
        excerpt: "",
        content: [],
        category: "",
        author: "",
        status: "published",
        featured: false,
        readingTime: 5,
      });
      setContentBlocks([]);
    }
    setImage(null);
  }, [editing, form, open]);

  const handleSubmit = (values: NewsInput) => {
    onSubmit(values, image, contentBlocks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[66%] lg:max-w-[66%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit News" : "Add News"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details of this news article."
              : "Fill in the details to create a new news article."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter news title" />
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
                    <Input {...field} placeholder="Short summary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Block-based Content Editor */}
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <BlockEditor
                  value={contentBlocks}
                  onChange={setContentBlocks}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Single featured image upload */}
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={editing?.image ?? null}
                  onChange={setImage}
                  disabled={isSaving}
                  label="Featured image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Business" />
                    </FormControl>
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
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Author dropdown — only existing team members */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => {
                const selectedMember = teamMembers.find((m) => m._id === field.value);
                const displayName = selectedMember
                  ? `${selectedMember.name}${selectedMember.title ? ` — ${selectedMember.title}` : ""}`
                  : editing?.author.name
                  ? `${editing.author.name}${editing.author.role ? ` — ${editing.author.role}` : ""}`
                  : undefined;

                return (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingTeam}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={displayName || "Select an author"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((member, index) => (
                          <SelectItem key={member._id || index} value={member._id}>
                            {member.name}
                            {member.title ? ` — ${member.title}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 rounded-lg border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <SubmitButton isLoading={isSaving}>
                {editing ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
