"use client";

import { Plus } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionCard } from "./section-card";
import { MemberFormDialog } from "./member-form";
import { SectionFormDialog } from "./section-form";
import { useTeamManager } from "./use-team-manager";

export function TeamManager() {
  const t = useTeamManager();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={t.search} onChange={t.setSearch} placeholder="Search team..." />
        <div className="flex gap-4">
          <span>Add section <IconButton variant="outline" label="Add section" icon={<Plus />} onClick={t.openCreateSection} /></span>
          <span>Add member <IconButton variant="default" label="Add team member" icon={<Plus />} onClick={t.openCreate} /></span>
        </div>
      </div>

      {t.isLoading ? (
        <LoadingSpinner label="Loading team..." />
      ) : t.sections.length === 0 ? (
        <EmptyState title="No sections found" description="Create a section first, then add team members to it." />
      ) : (
        t.sections.map((s) => (
          <SectionCard
            key={s._id}
            section={s}
            members={t.filtered(s._id)}
            onAddMember={t.openCreate}
            onEditMember={t.openEdit}
            onDeleteMember={t.setDeleteTarget}
            onToggleMember={t.toggleMember}
            onEditSection={t.openEditSection}
            onDeleteSection={t.setDeleteSectionTarget}
            onToggleSection={t.toggleSection}
            onViewMember={t.handleViewMember}
            togglingMemberId={t.togglingMemberId}
            togglingSectionId={t.togglingSectionId}
          />
        ))
      )}

      <MemberFormDialog
        open={t.memberOpen}
        editing={t.editing}
        sections={t.sections}
        imageFile={t.imageFile}
        setImageFile={t.setImageFile}
        onOpenChange={t.setMemberOpen}
        onSaved={t.onMemberSaved}
      />

      <SectionFormDialog open={t.sectionOpen} editing={t.editingSection} onOpenChange={t.setSectionOpen} onSubmit={t.onSectionSubmit} />

      <DeleteDialog open={!!t.deleteTarget} onOpenChange={(o) => !o && t.setDeleteTarget(null)} onConfirm={t.confirmDelete} isDeleting={false} title="Delete team member?" description={`Delete "${t.deleteTarget?.name}"? This cannot be undone.`} />
      <DeleteDialog open={!!t.deleteSectionTarget} onOpenChange={(o) => !o && t.setDeleteSectionTarget(null)} onConfirm={t.confirmDeleteSection} isDeleting={false} title="Delete section?" description={`Delete "${t.deleteSectionTarget?.name}"? Fails if it still has members.`} />

      <Dialog open={!!t.viewMember} onOpenChange={(o) => !o && t.setViewMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.viewMember?.name}</DialogTitle>
            <DialogDescription>Team member details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
              <p className="text-sm text-foreground">{t.viewMember?.title}</p>
            </div>
            {t.viewMember?.bio ? (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
                <p className="text-sm text-foreground whitespace-pre-wrap">{t.viewMember.bio}</p>
              </div>
            ) : null}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className="text-sm text-foreground">{t.viewMember?.visible ? "Visible" : "Hidden"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => t.setViewMember(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
