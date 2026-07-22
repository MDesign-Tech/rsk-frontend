"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { opportunitySchema, type OpportunityInput } from "@/schemas";
import type { Opportunity } from "@/types";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useOpportunityStore } from "@/stores/opportunity.store";
import { toast } from "sonner";
import { OpportunityForm } from "./opportunity-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function OpportunityManager() {
  const {
    opportunities,
    loading,
    fetchOpportunities,
    addOpportunity,
    updateOpportunity,
    removeOpportunity,
    toggleVisibility,
  } = useOpportunityStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities().catch(() => {});
  }, [fetchOpportunities]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (opportunity: Opportunity) => {
    setEditing(opportunity);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: OpportunityInput, image?: File | null) => {
    setIsSaving(true);
    try {
      if (editing) {
        await updateOpportunity(editing._id || editing.id, values, image ?? undefined);
        toast.success("Opportunity updated");
      } else {
        await addOpportunity(values, image ?? undefined);
        toast.success("Opportunity created");
      }
      setDialogOpen(false);
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
      await removeOpportunity(deleteTarget._id || deleteTarget.id);
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Opportunity deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleToggleStatus = async (opportunity: Opportunity) => {
    setTogglingId(opportunity._id || opportunity.id);
    try {
      await toggleVisibility(opportunity._id || opportunity.id);
      toast.success(opportunity.status === "Open" ? "Opportunity closed" : "Opportunity opened");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = opportunities.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.organization.name.toLowerCase().includes(search.toLowerCase()) ||
      o.type.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Opportunity>[] = [
    {
      key: "title",
      header: "Title",
      render: (o) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden">
            <img
              src={o.image}
              alt={o.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{o.title}</p>
            <p className="text-xs text-muted-foreground truncate">{o.organization.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (o) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
          {o.type}
        </span>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (o) =>
        new Date(o.deadline).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            o.status === "Open"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {o.status}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (o) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            o.featured
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {o.featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (o) => (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <StatusToggle
                checked={o.status === "Open"}
                onCheckedChange={() => handleToggleStatus(o)}
                disabled={togglingId === (o._id || o.id)}
                aria-label={o.status === "Open" ? "Close opportunity" : "Open opportunity"}
              />
            </TooltipTrigger>
            <TooltipContent>
              {o.status === "Open" ? "Close" : "Open"}
            </TooltipContent>
          </Tooltip>
          <IconButton
            variant="outline"
            label="Edit opportunity"
            icon={<Pencil />}
            onClick={() => openEdit(o)}
          />
          <IconButton
            variant="destructive"
            label="Delete opportunity"
            icon={<Trash2 />}
            onClick={() => setDeleteTarget(o)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunities</h2>
        <IconButton
          variant="default"
          label="Add opportunity"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search opportunities..."
      />

      {loading ? (
        <EmptyState
          title="Loading..."
          description="Please wait while we load opportunities."
        />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities"
          description="Create your first opportunity to get started."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results found"
          description="Try adjusting your search query."
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <OpportunityForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        editing={editing}
        isSaving={isSaving}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete opportunity?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
