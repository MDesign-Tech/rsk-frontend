"use client";

import { Pencil, Plus, Trash2, GripVertical } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Reorder, useDragControls } from "framer-motion";
import type { TeamMember, TeamSection } from "@/types";

function MemberDragHandle({ dragControls }: { dragControls: ReturnType<typeof useDragControls> }) {
  return (
    <IconButton
      variant="ghost"
      label="Drag to reorder"
      icon={<GripVertical className="size-4 text-muted-foreground" />}
      onPointerDown={(e) => dragControls.start(e)}
    />
  );
}

export function SectionCard({
  section,
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onToggleMember,
  onEditSection,
  onDeleteSection,
  onToggleSection,
  onViewMember,
  togglingMemberId,
  togglingSectionId,
  onReorderMembers,
}: {
  section: TeamSection;
  members: TeamMember[];
  onAddMember: (sectionId: string) => void;
  onEditMember: (m: TeamMember) => void;
  onDeleteMember: (m: TeamMember) => void;
  onToggleMember: (m: TeamMember) => void;
  onEditSection: (s: TeamSection) => void;
  onDeleteSection: (s: TeamSection) => void;
  onToggleSection: (s: TeamSection) => void;
  onViewMember?: (m: TeamMember) => void;
  togglingMemberId?: string | null;
  togglingSectionId?: string | null;
  onReorderMembers?: (sectionId: string, newOrder: TeamMember[]) => void;
}) {
  const memberDragControls = useDragControls();

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate">{section.name}</h3>
          {section.description ? <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
              <StatusToggle
                checked={!!section.visible}
                onCheckedChange={() => onToggleSection(section)}
                disabled={togglingSectionId === section._id}
                aria-label={section.visible ? "Hide section" : "Show section"}
              />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {section.visible ? "Hide" : "Show"}
            </TooltipContent>
          </Tooltip>
          <IconButton variant="outline" label="Edit section" icon={<Pencil />} onClick={() => onEditSection(section)} />
          <IconButton variant="destructive" label="Delete section" icon={<Trash2 />} onClick={() => onDeleteSection(section)} />
        </div>
      </div>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members in this section.</p>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          {/* Header - hidden on mobile */}
          <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
            <div className="w-10" />
            <div>Name</div>
            <div>Title</div>
            <div className="text-right">Actions</div>
          </div>
          <Reorder.Group
            axis="y"
            values={members}
            onReorder={(newOrder) => onReorderMembers?.(section._id, newOrder)}
          >
            {members.map((m) => (
              <Reorder.Item
                key={m._id}
                value={m}
                dragControls={memberDragControls}
                className="cursor-grab active:cursor-grabbing"
              >
                <div
                  className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_auto] gap-3 md:gap-4 items-center px-4 py-3 border-b last:border-b-0"
                >
                  <div className="flex md:block items-center gap-3">
                    <MemberDragHandle dragControls={memberDragControls} />
                    <div className="flex items-center gap-3 md:hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.image ?? "/placeholder-user.jpg"} alt={m.name} className="size-9 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image ?? "/placeholder-user.jpg"} alt={m.name} className="size-9 rounded-full object-cover" />
                    <span className="font-medium">{m.name}</span>
                  </div>
                  <div className="hidden md:block">{m.title}</div>
                  <div className="flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <StatusToggle
                            checked={!!m.visible}
                            onCheckedChange={() => onToggleMember(m)}
                            disabled={togglingMemberId === m._id || !m.image}
                            aria-label={m.visible ? "Hide team member" : "Show team member"}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {!m.image ? "Add an image to show this member" : m.visible ? "Hide" : "Show"}
                      </TooltipContent>
                    </Tooltip>
                    <IconButton variant="outline" label="Edit team member" icon={<Pencil />} onClick={(e) => { e.stopPropagation(); onEditMember(m); }} />
                    <IconButton variant="destructive" label="Delete team member" icon={<Trash2 />} onClick={(e) => { e.stopPropagation(); onDeleteMember(m); }} />
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}
    </div>
  );
}
