"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import type { NewsArticle, ContentBlock } from "@/types";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { EmptyState } from "@/components/admin/empty-state";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { StatusToggle } from "@/components/ui/status-toggle";
import { newsService } from "@/services/news";
import { toast } from "sonner";
import { NewsForm } from "./news-form";
import type { NewsInput } from "@/schemas";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { articles } = await newsService.list();
      setArticles(articles);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditing(article);
    setEditorOpen(true);
  };

  const handleSave = async (values: NewsInput, image: File | null, contentBlocks: ContentBlock[]) => {
    setIsSaving(true);
    try {
      if (editing) {
        await newsService.update(editing._id, { ...values, content: contentBlocks, image: image ?? undefined });
        toast.success("News article updated");
      } else {
        await newsService.create({ ...values, content: contentBlocks, image: image ?? undefined });
        toast.success("News article created");
      }
      setEditorOpen(false);
      await loadArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await newsService.remove(deleteTarget._id);
      setDeleteTarget(null);
      toast.success("News article deleted");
      await loadArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (article: NewsArticle) => {
    setTogglingId(article._id);
    const newStatus =
      article.status === "published" ? "draft" : "published";
    try {
      await newsService.update(article._id, { status: newStatus });
      toast.success(
        newStatus === "published" ? "Article published" : "Article moved to draft"
      );
      await loadArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.author.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<NewsArticle>[] = [
    {
      key: "title",
      header: "Title",
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden">
            {a.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.image}
                alt={a.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{a.title}</p>
            <p className="text-xs text-muted-foreground truncate">{a.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (a) => a.author.name,
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            a.status === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : a.status === "archived"
              ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {a.status}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (a) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            a.featured
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {a.featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "publishedAt",
      header: "Published",
      render: (a) =>
        new Date(a.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (a) => (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <StatusToggle
                checked={a.status === "published"}
                onCheckedChange={() => handleToggleStatus(a)}
                disabled={togglingId === a._id}
                aria-label={a.status === "published" ? "Unpublish article" : "Publish article"}
              />
            </TooltipTrigger>
            <TooltipContent>
              {a.status === "published" ? "Unpublish" : "Publish"}
            </TooltipContent>
          </Tooltip>
          <IconButton
            variant="outline"
            label="Edit news"
            icon={<Pencil />}
            onClick={() => openEdit(a)}
          />
          <IconButton
            variant="destructive"
            label="Delete news"
            icon={<Trash2 />}
            onClick={() => setDeleteTarget(a)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">News Articles</h2>
        <IconButton
          variant="default"
          label="Add news"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search news..."
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          title="No news articles"
          description="Create your first news article to get started."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results found"
          description="Try adjusting your search query."
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <NewsForm
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSubmit={handleSave}
        editing={editing}
        isSaving={isSaving}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete news article?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
