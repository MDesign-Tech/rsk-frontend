"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TeamMember, TeamSection } from "@/types";

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
}) {
  const columns: Column<TeamMember>[] = [
    {
      key: "name",
      header: "Name",
      render: (m) => {
        const words = m.name.split(" ");
        const preview =
          words.length > 3 ? words.slice(0, 3).join(" ") + "..." : m.name;
        return (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.image ?? "/placeholder-user.jpg"} alt={m.name} className="size-9 rounded-full object-cover" />
            <span className="font-medium" title={m.name}>{preview}</span>
          </div>
        );
      },
    },
    { key: "title", header: "Title" },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (m) => (
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
                  disabled={togglingMemberId === m._id}
                  aria-label={m.visible ? "Hide team member" : "Show team member"}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {m.visible ? "Hide" : "Show"}
            </TooltipContent>
          </Tooltip>
          <IconButton variant="outline" label="Edit team member" icon={<Pencil />} onClick={(e) => { e.stopPropagation(); onEditMember(m); }} />
          <IconButton variant="destructive" label="Delete team member" icon={<Trash2 />} onClick={(e) => { e.stopPropagation(); onDeleteMember(m); }} />
        </div>
      ),
    },
  ];

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
              <StatusToggle
                checked={!!section.visible}
                onCheckedChange={() => onToggleSection(section)}
                disabled={togglingSectionId === section._id}
                aria-label={section.visible ? "Hide section" : "Show section"}
              />
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
        <DataTable columns={columns} data={members} keyField="_id" onRowClick={onViewMember ? (m) => onViewMember(m) : undefined} />
      )}
    </div>
  );
}
