"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Trash2, RefreshCw, ImageOff, ExternalLink, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { mediaLibraryService, type MediaLibraryQueryParams } from "@/services/media-library.service";
import type { MediaLibraryImage } from "@/types";

type FilterType = "used" | "unused";

export function MediaLibraryManager() {
  const [images, setImages] = useState<MediaLibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("used");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<MediaLibraryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = useCallback(async (params: MediaLibraryQueryParams = {}) => {
    try {
      setLoading(true);
      const response = await mediaLibraryService.get({
        filter: params.filter ?? filter,
        search: params.search ?? search,
        page: params.page ?? page,
        limit: params.limit ?? limit,
      });
      setImages(response.data.images);
      setTotalPages(response.data.pagination.totalPages);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch media library:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load media library");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, search, page, limit]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchImages({ page: newPage });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const handleDeleteClick = (image: MediaLibraryImage) => {
    if (image.isUsed) return;
    setDeleteTarget(image);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await mediaLibraryService.delete(deleteTarget.publicId);
      toast.success("Image deleted successfully");
      setDeleteTarget(null);
      // Refresh the gallery
      fetchImages();
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFilterCounts = () => {
    const used = images.filter((img) => img.isUsed).length;
    const unused = images.filter((img) => !img.isUsed).length;
    return { used, unused };
  };

  const counts = getFilterCounts();

  const renderEmptyState = () => {
    if (search) {
      return (
        <Card className="flex flex-col items-center justify-center py-12">
          <ImageOff className="size-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No images found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
        </Card>
      );
    }
    if (filter === "used") {
      return (
        <Card className="flex flex-col items-center justify-center py-12">
          <ImageOff className="size-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No used images found</p>
          <p className="text-sm text-muted-foreground">All images are currently unused</p>
        </Card>
      );
    }
    if (filter === "unused") {
      return (
        <Card className="flex flex-col items-center justify-center py-12">
          <ImageOff className="size-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No unused images found</p>
          <p className="text-sm text-muted-foreground">All images are currently in use</p>
        </Card>
      );
    }
    return (
      <Card className="flex flex-col items-center justify-center py-12">
        <ImageOff className="size-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No images found</p>
        <p className="text-sm text-muted-foreground">No images in your Cloudinary account</p>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with search and refresh */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by public ID or format..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b">
        {[
          { key: "used" as FilterType, label: "Used", count: counts.used },
          { key: "unused" as FilterType, label: "Unused", count: counts.unused },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <Card
                key={image.publicId}
                className="group relative overflow-hidden"
              >
                <div className="aspect-square relative bg-muted">
                  <img
                    src={image.url}
                    alt={image.publicId}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 px-2"
                        onClick={() => window.open(image.url, "_blank")}
                      >
                        <ExternalLink className="size-3" />
                      </Button>
                      {!image.isUsed && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-2"
                          onClick={() => handleDeleteClick(image)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        image.isUsed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {image.isUsed ? "Used" : "Unused"}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-mono truncate" title={image.publicId}>
                    {image.publicId}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{image.format.toUpperCase()}</span>
                    <span>{formatBytes(image.bytes)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(image.createdAt)}
                  </p>
                  {/* Usage references */}
                  {image.isUsed && image.references && image.references.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <FolderOpen className="size-3" />
                        <span>Used in:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {image.references.map((ref, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs"
                            title={`${ref.collection}: ${ref.field}`}
                          >
                            {ref.collection}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) handlePageChange(page - 1);
                      }}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) handlePageChange(page + 1);
                      }}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Image"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.publicId}" from Cloudinary? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        variant="destructive"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
