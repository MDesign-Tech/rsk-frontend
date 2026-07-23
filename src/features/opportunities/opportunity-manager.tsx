"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { opportunityService, type Opportunity } from "@/services/opportunity.service";
import { IconButton } from "@/components/admin/icon-button";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { OpportunityFormDialog } from "./opportunity-form-dialog";

export function OpportunityManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await opportunityService.getAll();
      setOpportunities(res.data.opportunities);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load opportunities");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await opportunityService.remove(deleteTarget._id);
      setOpportunities((prev) => prev.filter((o) => o._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Opportunity deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleStatus = async (opportunity: Opportunity) => {
    const newStatus = opportunity.status === "Open" ? "closed" : "active";
    try {
      const res = await opportunityService.toggleStatus(opportunity._id, newStatus);
      setOpportunities((prev) =>
        prev.map((o) => (o._id === opportunity._id ? res.data.opportunity : o))
      );
      toast.success(`Opportunity ${res.data.opportunity.status === "Open" ? "opened" : "closed"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const toggleVisibility = async (opportunity: Opportunity) => {
    try {
      const res = await opportunityService.update(opportunity._id, { visible: !opportunity.visible });
      setOpportunities((prev) =>
        prev.map((o) => (o._id === opportunity._id ? res.data.opportunity : o))
      );
      toast.success(res.data.opportunity.visible ? "Opportunity shown" : "Opportunity hidden");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    }
  };

  const openCreate = () => {
    setEditingOpportunity(null);
    setFormOpen(true);
  };

  const openEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setFormOpen(true);
  };

  const handleSuccess = () => {
    load();
  };

  const filtered = opportunities.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.organization.name.toLowerCase().includes(search.toLowerCase()) ||
    o.category.toLowerCase().includes(search.toLowerCase()) ||
    o.location.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tender":
        return "bg-blue-100 text-blue-800";
      case "Job":
        return "bg-green-100 text-green-800";
      case "Internship":
        return "bg-purple-100 text-purple-800";
      case "Consultancy":
        return "bg-orange-100 text-orange-800";
      case "Training":
        return "bg-teal-100 text-teal-800";
      case "Event":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
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
          placeholder="Search opportunities..."
        />
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add Opportunity
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading opportunities..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description={
            search
              ? "No opportunities match your search."
              : "Create your first opportunity to get started."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((opportunity) => (
            <div
              key={opportunity._id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {opportunity.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={opportunity.image}
                    alt={opportunity.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{opportunity.title}</h3>
                  <div className="flex gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {opportunity.shortDescription}
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Organization:</span>
                    <span>{opportunity.organization.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span>{opportunity.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Deadline:</span>
                    <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                  {opportunity.salary && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Salary:</span>
                      <span>{opportunity.salary}</span>
                    </div>
                  )}
                  {opportunity.budget && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Budget:</span>
                      <span>{opportunity.budget}</span>
                    </div>
                  )}
                </div>
                {opportunity.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Requirements</h4>
                    <ul className="text-xs text-foreground space-y-0.5">
                      {opportunity.requirements.slice(0, 3).map((req, i) => (
                        <li key={i} className="line-clamp-1">• {req}</li>
                      ))}
                      {opportunity.requirements.length > 3 && (
                        <li className="text-muted-foreground">+{opportunity.requirements.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                {opportunity.benefits.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Benefits</h4>
                    <ul className="text-xs text-foreground space-y-0.5">
                      {opportunity.benefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="line-clamp-1">• {benefit}</li>
                      ))}
                      {opportunity.benefits.length > 3 && (
                        <li className="text-muted-foreground">+{opportunity.benefits.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <StatusToggle
                            checked={!!opportunity.visible}
                            onCheckedChange={() => toggleVisibility(opportunity)}
                            aria-label={opportunity.visible ? "Hide" : "Show"}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {opportunity.visible ? "Hide" : "Show"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="outline"
                          label="Edit opportunity"
                          icon={<Pencil />}
                          onClick={() => openEdit(opportunity)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="destructive"
                          label="Delete opportunity"
                          icon={<Trash2 />}
                          onClick={() => setDeleteTarget(opportunity)}
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
        title="Delete opportunity?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />

      <OpportunityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        opportunity={editingOpportunity}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
