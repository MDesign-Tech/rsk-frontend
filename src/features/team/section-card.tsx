"use client";

import { Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import type { TeamMember, TeamSection } from "@/types";

function SixDotHandle({
  onDragStart,
  onDragEnd,
}: {
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) {
  return (
    <span
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="inline-flex cursor-grab active:cursor-grabbing select-none items-center justify-center text-muted-foreground leading-none w-5 h-5 flex-shrink-0"
      title="Drag to move"
    >
      ⋮⋮
    </span>
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
  onMoveMember,
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
  onMoveMember?: (memberId: string, targetSectionId: string) => void;
}) {
  const [draggedMemberId, setDraggedMemberId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<"top" | "bottom" | null>(null);

  const handleDragStart = (e: React.DragEvent, memberId: string) => {
    e.dataTransfer.setData("text/plain", memberId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedMemberId(memberId);
  };

  const handleDragEnd = () => {
    setDraggedMemberId(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? "top" : "bottom";
    setDragOverIndex(index);
    setDragOverPosition(position);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const memberId = e.dataTransfer.getData("text/plain");
    if (!memberId) return;

    const member = members.find((m) => m._id === memberId);

    if (member) {
      // Intra-section reorder
      const newMembers = [...members];
      const draggedIndex = newMembers.findIndex((m) => m._id === memberId);
      const [draggedItem] = newMembers.splice(draggedIndex, 1);
      let insertIndex = targetIndex;
      if (dragOverPosition === "bottom") {
        insertIndex = targetIndex + 1;
      }
      if (draggedIndex < insertIndex) {
        insertIndex -= 1;
      }
      newMembers.splice(insertIndex, 0, draggedItem);
      onReorderMembers?.(section._id, newMembers);
    } else {
      // Cross-section move
      onMoveMember?.(memberId, section._id);
    }

    setDraggedMemberId(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSectionDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const memberId = e.dataTransfer.getData("text/plain");
    if (!memberId) return;

    // Only handle cross-section drops (member not in this section)
    const member = members.find((m) => m._id === memberId);
    if (!member && onMoveMember) {
      onMoveMember(memberId, section._id);
    }

    setDraggedMemberId(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  return (
    <div
      className="space-y-3 rounded-xl border border-border/60 bg-card p-4"
      onDragOver={handleSectionDragOver}
      onDrop={handleSectionDrop}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate">{section.name}</h3>
          {section.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {section.description}
            </p>
          ) : null}
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
          <IconButton
            variant="outline"
            label="Edit section"
            icon={<Pencil />}
            onClick={() => onEditSection(section)}
          />
          <IconButton
            variant="destructive"
            label="Delete section"
            icon={<Trash2 />}
            onClick={() => onDeleteSection(section)}
          />
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
          {members.map((m, index) => (
            <div
              key={m._id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_auto] gap-3 md:gap-4 items-center px-4 py-3 border-b last:border-b-0 transition-colors relative ${
                draggedMemberId === m._id ? "opacity-40" : ""
              }`}
            >
              {dragOverIndex === index && dragOverPosition && (
                <div
                  className={`absolute left-0 right-0 h-[2px] bg-primary transition-all duration-150 ease-in-out ${
                    dragOverPosition === "top" ? "-top-px" : "-bottom-px"
                  }`}
                />
              )}
              <div className="flex md:block items-center gap-3">
                <SixDotHandle
                  onDragStart={(e) => handleDragStart(e, m._id)}
                  onDragEnd={handleDragEnd}
                />
                <div className="flex items-center gap-3 md:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image ?? "/placeholder-user.jpg"}
                    alt={m.name}
                    className="size-9 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.title}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image ?? "/placeholder-user.jpg"}
                  alt={m.name}
                  className="size-9 rounded-full object-cover"
                />
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
                        disabled={
                          togglingMemberId === m._id || !m.image
                        }
                        aria-label={
                          m.visible ? "Hide team member" : "Show team member"
                        }
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!m.image
                      ? "Add an image to show this member"
                      : m.visible
                        ? "Hide"
                        : "Show"}
                  </TooltipContent>
                </Tooltip>
                <IconButton
                  variant="outline"
                  label="Edit team member"
                  icon={<Pencil />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMember(m);
                  }}
                />
                <IconButton
                  variant="destructive"
                  label="Delete team member"
                  icon={<Trash2 />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMember(m);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
