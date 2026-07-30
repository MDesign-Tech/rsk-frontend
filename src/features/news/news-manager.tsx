"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { newsService, type NewsArticle } from "@/services/news.service";
import { categoryService, type Category } from "@/services/category.service";
import { deleteImage } from "@/lib/cloudinary";
import { IconButton } from "@/components/admin/icon-button";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { NewsFormDialog } from "./news-form-dialog";

const RSK_LOGO = "/rsk-logo.svg";

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .trim();
};

const getCategoryName = (category: string | { _id: string; name: string } | null | undefined): string => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name;
};

type Tab = "articles" | "categories";

export function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewArticle, setViewArticle] = useState<NewsArticle | null>(null);
   const [formOpen, setFormOpen] = useState(false);
   const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
   const [defaultCategory, setDefaultCategory] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("articles");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const load = async () => {
    setIsLoading(true);
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        newsService.getAll({ page: currentPage, limit: itemsPerPage }),
        categoryService.getAll(),
      ]);
      setArticles(articlesRes.data.articles);
      setCategories(categoriesRes.data.categories);
      setTotalPages(articlesRes.data.totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    }
  };

  useEffect(() => {
    load();
  }, [currentPage]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if ("title" in deleteTarget) {
        const article = deleteTarget as NewsArticle;
        // Delete cover image from Cloudinary
        if (article.coverImagePublicId) {
          try {
            await deleteImage(article.coverImagePublicId);
          } catch {
            console.error("Failed to delete cover image from Cloudinary");
          }
        }
        // Delete editor images from Cloudinary
        if (article.editorImages && article.editorImages.length > 0) {
          await Promise.allSettled(
            article.editorImages.map((img) =>
              deleteImage(img.publicId).catch((err) => {
                console.error("Failed to delete editor image from Cloudinary:", err);
              })
            )
          );
        }
        await newsService.remove(article._id);
        setArticles((prev) => prev.filter((a) => a._id !== article._id));
        toast.success("Article deleted");
      } else {
        await categoryService.remove(deleteTarget._id);
        setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
        toast.success("Category deleted");
      }
      setDeleteTarget(null);
      setIsDeleting(false);
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleArticleStatus = async (article: NewsArticle) => {
    try {
      const newStatus = article.status === "published" ? "draft" : "published";
      const res = await newsService.toggleStatus(article._id, newStatus);
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? { ...a, ...res.data } : a))
      );
      toast.success(newStatus === "published" ? "Article published" : "Article draft");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

   const openCreate = (category?: string) => {
     setEditingArticle(null);
     setDefaultCategory(category);
     setFormOpen(true);
   };

   const openEdit = (article: NewsArticle) => {
     setEditingArticle(article);
     setDefaultCategory(undefined);
     setFormOpen(true);
   };

  const handleSuccess = () => {
    load();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setIsSavingCategory(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, categoryName.trim());
        toast.success("Category updated successfully");
      } else {
        await categoryService.create(categoryName.trim());
        toast.success("Category created successfully");
      }
      setIsSavingCategory(false);
      setCategoryFormOpen(false);
      setCategoryName("");
      setEditingCategory(null);
      handleSuccess();
    } catch (err) {
      setIsSavingCategory(false);
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    }
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryFormOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryFormOpen(true);
  };

   const filtered = categoryFilter
     ? articles.filter((a) => getCategoryName(a.category) === categoryFilter)
     : articles;

  const handleCategoryFilter = (cat: string | null) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={tab === "articles" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("articles")}
          >
            Articles
          </Button>
          <Button
            variant={tab === "categories" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("categories")}
          >
            Categories
          </Button>
        </div>
        {tab === "articles" ? (
          <Button onClick={() => openCreate()}>
            <Plus className="mr-2 size-4" />
            Add Article
          </Button>
        ) : (
          <Button onClick={openCreateCategory}>
            <Plus className="mr-2 size-4" />
            Add Category
          </Button>
        )}
      </div>

      {tab === "articles" && (
        <>
          <SearchInput
            value={search}
            onChange={(val) => { setSearch(val); setCurrentPage(1); }}
            placeholder="Search articles..."
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCategoryFilter(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categoryFilter === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleCategoryFilter(cat.name)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  categoryFilter === cat.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSpinner label="Loading articles..." />
          ) : articles.length === 0 ? (
            <EmptyState
              title="No articles found"
              description={
                search
                  ? "No articles match your search."
                  : "Create your first article to get started."
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((article) => (
                  <div
                    key={article._id}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {article.coverImage ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                        <Image
                          src={RSK_LOGO}
                          alt="RSK Associates"
                          width={64}
                          height={64}
                          className="opacity-50"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{article.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(article.status)}`}>
                          {getCategoryName(article.category)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {truncateText(stripHtml(article.content), 150)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                                  checked={article.status === "published"}
                                  onCheckedChange={() => toggleArticleStatus(article)}
                                  aria-label={article.status === "published" ? "Unpublish" : "Publish"}
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {article.status === "published" ? "Unpublish" : "Publish"}
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
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/60">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "border border-border/60 text-foreground hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === "categories" && (
        <>
          {isLoading ? (
            <LoadingSpinner label="Loading categories..." />
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories found"
              description="Create your first category to get started."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {categories.map((category) => (
                 <div
                   key={category._id}
                   className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 hover:shadow-md transition-shadow"
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <GripVertical className="h-4 w-4 text-muted-foreground" />
                       <h3 className="font-semibold text-sm">{category.name}</h3>
                     </div>
                     <div className="flex items-center gap-2">
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <IconButton
                             variant="outline"
                             label="Edit category"
                             icon={<Pencil />}
                             onClick={() => openEditCategory(category)}
                           />
                         </TooltipTrigger>
                         <TooltipContent>Edit</TooltipContent>
                       </Tooltip>
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <IconButton
                             variant="destructive"
                             label="Delete category"
                             icon={<Trash2 />}
                             onClick={() => setDeleteTarget(category)}
                           />
                         </TooltipTrigger>
                         <TooltipContent>Delete</TooltipContent>
                       </Tooltip>
                     </div>
                   </div>
                   <div className="mt-4">
                     <Button
                       size="sm"
                       variant="secondary"
                       className="w-full"
                       onClick={() => openCreate(category.name)}
                     >
                       <Plus className="mr-2 size-3" />
                       Add Article in {category.name}
                     </Button>
                   </div>
                 </div>
               ))}
            </div>
          )}
        </>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title={deleteTarget && "title" in deleteTarget ? "Delete article?" : "Delete category?"}
        description={
          deleteTarget && "title" in deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
      />

      <Dialog open={!!viewArticle} onOpenChange={(o) => !o && setViewArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewArticle?.title}</DialogTitle>
            <DialogDescription>
              {getCategoryName(viewArticle?.category)} • {viewArticle?.author.name} • {viewArticle?.publishedAt ? new Date(viewArticle.publishedAt).toLocaleDateString() : "Draft"}
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
              <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
              <div
                className="text-sm text-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    typeof viewArticle?.content === "string" ? viewArticle.content : ""
                  ),
                }}
              />
            </div>
            {viewArticle?.gallery && viewArticle.gallery.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Gallery</h4>
                <div className="grid grid-cols-2 gap-2">
                  {viewArticle.gallery.map((img, idx) => (
                    <div key={idx} className="relative h-32 w-full rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Gallery image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p className="text-sm text-foreground">{viewArticle?.status}</p>
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
         defaultCategory={defaultCategory}
         onSuccess={handleSuccess}
       />

       {/* Category Form Dialog */}
       <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
         <DialogContent className="flex flex-col max-w-md max-h-[90vh]">
           <DialogHeader className="shrink-0">
             <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
             <DialogDescription>
               {editingCategory
                 ? "Update the category name below."
                 : "Enter a name for the new category."}
             </DialogDescription>
           </DialogHeader>
           <div className="flex-1 overflow-y-auto">
             <form onSubmit={handleCategorySubmit} className="space-y-4">
               <Input
                 value={categoryName}
                 onChange={(e) => setCategoryName(e.target.value)}
                 placeholder="Category name (e.g. Finance, Technology)"
                 disabled={isSavingCategory}
                 autoFocus
               />
             </form>
           </div>
           <DialogFooter className="shrink-0">
             <Button
               type="button"
               variant="outline"
               onClick={() => setCategoryFormOpen(false)}
               disabled={isSavingCategory}
             >
               Cancel
             </Button>
             <SubmitButton isLoading={isSavingCategory} disabled={isSavingCategory}>
               {editingCategory ? "Save Changes" : "Create"}
             </SubmitButton>
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </div>
  );
}
