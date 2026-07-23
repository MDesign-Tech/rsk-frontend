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

function MemberDragHandle() {
  const controls = useDragControls();
  return (
    <IconButton
      variant="ghost"
      label="Drag to reorder"
      icon={<GripVertical className="size-4 text-muted-foreground" />}
      onPointerDown={(e) => controls.start(e)}
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
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{section.name}</h3>
          {section.description ? <p className="text-sm text-muted-foreground">{section.description}</p> : null}
        </div>
        <div className="flex gap-2">
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
          <IconButton variant="default" label="Add member" icon={<Plus />} onClick={() => onAddMember(section._id)} />
        </div>
      </div>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members in this section.</p>
      ) : (
        <div className="rounded-lg border">
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
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
                className="cursor-grab active:cursor-grabbing"
              >
                <div
                  className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center px-4 py-3 border-b last:border-b-0"
                >
                  <div>
                    <MemberDragHandle />
                  </div>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image ?? "/placeholder-user.jpg"} alt={m.name} className="size-9 rounded-full object-cover" />
                    <span className="font-medium">{m.name}</span>
                  </div>
                  <div>{m.title}</div>
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
