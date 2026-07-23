"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { newsService, type NewsArticle } from "@/services/news.service";
import { IconButton } from "@/components/admin/icon-button";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { NewsFormDialog } from "./news-form-dialog";

export function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewArticle, setViewArticle] = useState<NewsArticle | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await newsService.getAll();
      setArticles(res.data.articles);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load news");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await newsService.remove(deleteTarget._id);
      setArticles((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Article deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleFeatured = async (article: NewsArticle) => {
    try {
      const res = await newsService.toggleFeatured(article._id, !article.featured);
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? res.data : a))
      );
      toast.success(res.data.featured ? "Article featured" : "Article unfeatured");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const openCreate = () => {
    setEditingArticle(null);
    setFormOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormOpen(true);
  };

  const handleSuccess = () => {
    load();
  };

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search articles..."
        />
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add Article
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading articles..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No articles found"
          description={
            search
              ? "No articles match your search."
              : "Create your first article to get started."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <div
              key={article._id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {article.coverImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{article.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(article.status)}`}>
                    {article.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <StatusToggle
                            checked={!!article.featured}
                            onCheckedChange={() => toggleFeatured(article)}
                            aria-label={article.featured ? "Unfeature" : "Feature"}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {article.featured ? "Unfeature" : "Feature"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="outline"
                          label="View article"
                          icon={<Eye />}
                          onClick={() => setViewArticle(article)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="outline"
                          label="Edit article"
                          icon={<Pencil />}
                          onClick={() => openEdit(article)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="destructive"
                          label="Delete article"
                          icon={<Trash2 />}
                          onClick={() => setDeleteTarget(article)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete article?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />

      <Dialog open={!!viewArticle} onOpenChange={(o) => !o && setViewArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewArticle?.title}</DialogTitle>
            <DialogDescription>
              {viewArticle?.category} • {viewArticle?.author.name} • {viewArticle?.publishedAt ? new Date(viewArticle.publishedAt).toLocaleDateString() : "Draft"}
            </DialogDescription>
          </DialogHeader>
          {viewArticle?.coverImage && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={viewArticle.coverImage}
                alt={viewArticle.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Excerpt</h4>
              <p className="text-sm text-foreground">{viewArticle?.excerpt}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {viewArticle?.content && typeof viewArticle.content === 'string' 
                  ? viewArticle.content 
                  : JSON.stringify(viewArticle?.content, null, 2)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p className="text-sm text-foreground">{viewArticle?.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Featured</h4>
                <p className="text-sm text-foreground">{viewArticle?.featured ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Views</h4>
                <p className="text-sm text-foreground">{viewArticle?.views}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Reading Time</h4>
                <p className="text-sm text-foreground">{viewArticle?.readingTime} min</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewArticle(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <NewsFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        article={editingArticle}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
