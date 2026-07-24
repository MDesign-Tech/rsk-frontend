"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { opportunityService } from "@/services/opportunity.service";
import type { Opportunity, OpportunityType } from "@/types";
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
import { OpportunityFormDialog } from "./opportunity-form-dialog";

const RSK_LOGO = "/rsk-logo.svg";

type Tab = "opportunities" | "types";

export function OpportunityManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [types, setTypes] = useState<OpportunityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | OpportunityType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeOpportunityCount, setTypeOpportunityCount] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [editingType, setEditingType] = useState<OpportunityType | null>(null);
  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [defaultTypeId, setDefaultTypeId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("opportunities");
  const [typeName, setTypeName] = useState("");
  const [isSavingType, setIsSavingType] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const load = async () => {
    setIsLoading(true);
    try {
      const [oppRes, typesRes] = await Promise.all([
        opportunityService.getAll({ page: currentPage, limit: itemsPerPage }),
        opportunityService.getTypes(),
      ]);
      setOpportunities(oppRes.data.opportunities);
      setTypes(typesRes.data.types);
      setTotalPages(oppRes.data.totalPages);
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
      if ("title" in deleteTarget) {
        await opportunityService.remove(deleteTarget._id);
        setOpportunities((prev) => prev.filter((o) => o._id !== deleteTarget._id));
        toast.success("Opportunity deleted");
      } else {
        await opportunityService.deleteByType(deleteTarget._id);
        await opportunityService.deleteType(deleteTarget._id);
        setOpportunities((prev) => prev.filter((o) => getTypeName(o.type) !== deleteTarget.name));
        setTypes((prev) => prev.filter((t) => t._id !== deleteTarget._id));
        toast.success("Type and its opportunities deleted");
      }
      setDeleteTarget(null);
      setTypeOpportunityCount(0);
      setIsDeleting(false);
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleOpportunityStatus = async (opportunity: Opportunity) => {
    const newStatus = opportunity.status === "Open" ? "Closed" : "Open";
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

  const openCreateOpportunity = (typeId?: string) => {
    setEditingOpportunity(null);
    setDefaultTypeId(typeId || null);
    setFormOpen(true);
  };

  const openEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setDefaultTypeId(null);
    setFormOpen(true);
  };

  const openCreateType = () => {
    setEditingType(null);
    setTypeName("");
    setTypeFormOpen(true);
  };

  const openEditType = (type: OpportunityType) => {
    setEditingType(type);
    setTypeName(type.name);
    setTypeFormOpen(true);
  };

  const handleDeleteType = (type: OpportunityType) => {
    const count = opportunities.filter((o) => getTypeName(o.type) === type.name).length;
    setTypeOpportunityCount(count);
    setDeleteTarget(type);
  };

  const handleSuccess = () => {
    load();
  };

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;
    setIsSavingType(true);
    try {
      if (editingType) {
        await opportunityService.updateType(editingType._id, typeName.trim());
        toast.success("Type updated successfully");
      } else {
        await opportunityService.createType(typeName.trim());
        toast.success("Type created successfully");
      }
      setIsSavingType(false);
      setTypeFormOpen(false);
      setTypeName("");
      setEditingType(null);
      handleSuccess();
    } catch (err) {
      setIsSavingType(false);
      toast.error(err instanceof Error ? err.message : "Failed to save type");
    }
  };

  const getTypeName = (type: OpportunityType | string | null | undefined): string => {
    if (typeof type === "string") return type;
    if (!type) return "Unknown";
    return type.name;
  };

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      search === "" ||
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.description.toLowerCase().includes(search.toLowerCase()) ||
      opp.org.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === null || getTypeName(opp.type) === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const getTypeColor = (typeName: string) => {
    switch (typeName) {
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
      case "RFP":
        return "bg-indigo-100 text-indigo-800";
      case "RFQ":
        return "bg-yellow-100 text-yellow-800";
      case "EOI":
        return "bg-gray-100 text-gray-800";
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
        <div className="flex gap-2">
          <Button
            variant={tab === "opportunities" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("opportunities")}
          >
            Opportunities
          </Button>
          <Button
            variant={tab === "types" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("types")}
          >
            Types
          </Button>
        </div>
        {tab === "opportunities" ? (
          <Button onClick={() => openCreateOpportunity()}>
            <Plus className="mr-2 size-4" />
            Add Opportunity
          </Button>
        ) : (
          <Button onClick={openCreateType}>
            <Plus className="mr-2 size-4" />
            Add Type
          </Button>
        )}
      </div>

      {tab === "opportunities" && (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search opportunities..."
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
                type="button"
                onClick={() => handleTypeFilter(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  typeFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {types.map((type) => (
                <button
                  key={type._id}
                  type="button"
                  onClick={() => handleTypeFilter(type.name)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    typeFilter === type.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.name}
                </button>
              ))}
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((opportunity) => (
                <div
                  key={opportunity._id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full bg-muted">
                    {opportunity.image ? (
                      <Image
                        src={opportunity.image}
                        alt={opportunity.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Image
                          src={RSK_LOGO}
                          alt="RSK Associates"
                          width={48}
                          height={48}
                          className="opacity-40"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{opportunity.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(getTypeName(opportunity.type))}`}>
                        {getTypeName(opportunity.type)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {opportunity.description}
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Organization:</span>
                        <span>{opportunity.org}</span>
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
                        <span className="font-medium">Date:</span>
                        <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                      </div>
                    </div>
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
                                checked={opportunity.status === "Open"}
                                onCheckedChange={() => toggleOpportunityStatus(opportunity)}
                                aria-label={opportunity.status === "Open" ? "Close" : "Open"}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {opportunity.status === "Open" ? "Close" : "Open"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <IconButton
                              variant="outline"
                              label="Edit opportunity"
                              icon={<Pencil />}
                              onClick={() => openEditOpportunity(opportunity)}
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

       {tab === "types" && (
        <>
          {isLoading ? (
            <LoadingSpinner label="Loading types..." />
          ) : types.length === 0 ? (
            <EmptyState
              title="No types found"
              description="Create your first opportunity type to get started."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map((type) => (
                <div
                  key={type._id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">{type.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            variant="outline"
                            label="Edit type"
                            icon={<Pencil />}
                            onClick={() => openEditType(type)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            variant="destructive"
                            label="Delete type"
                            icon={<Trash2 />}
                            onClick={() => handleDeleteType(type)}
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
                      onClick={() => openCreateOpportunity(type._id)}
                    >
                      <Plus className="mr-2 size-3" />
                      Add Opportunity in {type.name}
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
        title={deleteTarget && "title" in deleteTarget ? "Delete opportunity?" : "Delete type?"}
        description={
          deleteTarget && "title" in deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This will also permanently delete ${typeOpportunityCount} associated opportunity(ies). This action cannot be undone.`
        }
      />

      <OpportunityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        opportunity={editingOpportunity}
        types={types}
        defaultTypeId={defaultTypeId}
        onSuccess={handleSuccess}
      />

      {/* Type Form Dialog */}
      <Dialog open={typeFormOpen} onOpenChange={setTypeFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingType ? "Edit Type" : "Create Type"}</DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update the opportunity type name below."
                : "Enter a name for the new opportunity type."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTypeSubmit} className="space-y-4">
            <Input
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="Type name (e.g. Tender, Job)"
              disabled={isSavingType}
              autoFocus
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTypeFormOpen(false)}
                disabled={isSavingType}
              >
                Cancel
              </Button>
              <SubmitButton isLoading={isSavingType} disabled={isSavingType}>
                {editingType ? "Save Changes" : "Create"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
