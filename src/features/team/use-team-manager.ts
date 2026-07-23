"use client";

import { useEffect, useState } from "react";
import { teamService, teamSectionService } from "@/services/team.service";
import type { TeamMember, TeamSection, CloudinaryImage } from "@/types";
import { toast } from "sonner";

type DragState = {
  type: "section" | "member";
  id: string;
  sectionId?: string;
} | null;

export function useTeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [sections, setSections] = useState<TeamSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [memberOpen, setMemberOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [imageData, setImageData] = useState<CloudinaryImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<TeamSection | null>(
    null,
  );
  const [deleteSectionTarget, setDeleteSectionTarget] =
    useState<TeamSection | null>(null);
  const [togglingMemberId, setTogglingMemberId] = useState<string | null>(null);
  const [togglingSectionId, setTogglingSectionId] = useState<string | null>(
    null,
  );
  const [viewMember, setViewMember] = useState<TeamMember | null>(null);
  const [dragState, setDragState] = useState<DragState>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [teamRes, sectionsRes] = await Promise.all([
        teamService.getAll(),
        teamSectionService.getAll(),
      ]);
      setMembers(teamRes.data.teamMembers ?? []);
      setSections(sectionsRes.data ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sectionIdOf = (m: TeamMember) =>
    typeof m.section === "string" ? m.section : (m.section?._id ?? "");

  const filtered = (sid: string) =>
    members.filter((m) => {
      const q = search.toLowerCase();
      return (
        sectionIdOf(m) === sid &&
        (!q ||
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q))
      );
    });

  const openCreate = () => {
    setEditing(null);
    setImageData(null);
    setMemberOpen(true);
  };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setImageData(null);
    setMemberOpen(true);
  };
  const onMemberSaved = (m: TeamMember) =>
    setMembers((prev) =>
      prev.some((x) => x._id === m._id)
        ? prev.map((x) => (x._id === m._id ? m : x))
        : [m, ...prev],
    );

  const toggleMember = async (m: TeamMember) => {
    // Prevent showing team members without images
    if (!m.visible && !m.image) {
      toast.error(
        "Cannot show a team member without an image. Please add an image first.",
      );
      return;
    }
    setTogglingMemberId(m._id);
    try {
      const res = await teamService.toggleVisibility(m._id, !m.visible);
      setMembers((prev) =>
        prev.map((x) => (x._id === m._id ? res.data.teamMember : x)),
      );
      toast.success(
        res.data.teamMember.visible
          ? "Team member shown"
          : "Team member hidden",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to toggle visibility",
      );
    } finally {
      setTogglingMemberId(null);
    }
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teamService.remove(deleteTarget._id);
      setMembers((prev) => prev.filter((x) => x._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Team member deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete team member",
      );
    }
  };

  const openCreateSection = () => {
    setEditingSection(null);
    setSectionOpen(true);
  };
  const openEditSection = (s: TeamSection) => {
    setEditingSection(s);
    setSectionOpen(true);
  };
  const onSectionSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    try {
      if (editingSection)
        await teamSectionService.update(editingSection._id, values);
      else await teamSectionService.create(values);
      toast.success(editingSection ? "Section updated" : "Section created");
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save section",
      );
    }
  };
  const toggleSection = async (s: TeamSection) => {
    setTogglingSectionId(s._id);
    try {
      const res = await teamSectionService.toggleVisibility(s._id, !s.visible);
      setSections((prev) =>
        prev.map((x) => (x._id === s._id ? res.data.teamSection : x)),
      );
      toast.success(
        res.data.teamSection.visible ? "Section shown" : "Section hidden",
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to toggle section visibility",
      );
    } finally {
      setTogglingSectionId(null);
    }
  };
  const confirmDeleteSection = async () => {
    if (!deleteSectionTarget) return;
    try {
      await teamSectionService.remove(deleteSectionTarget._id);
      setSections((prev) =>
        prev.filter((x) => x._id !== deleteSectionTarget._id),
      );
      setMembers((prev) =>
        prev.filter((m) => sectionIdOf(m) !== deleteSectionTarget._id),
      );
      setDeleteSectionTarget(null);
      toast.success("Section deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete section",
      );
    }
  };

  const handleViewMember = (m: TeamMember) => {
    setViewMember(m);
  };

  const reorderSections = async (newOrder: TeamSection[]) => {
    setSections(newOrder);
    try {
      await teamSectionService.reorder(newOrder.map((s) => s._id));
      toast.success("Sections reordered");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reorder sections",
      );
      await load();
    }
  };

  const reorderMembers = async (sectionId: string, newOrder: TeamMember[]) => {
    setMembers((prev) => {
      const others = prev.filter((m) => sectionIdOf(m) !== sectionId);
      return [...others, ...newOrder];
    });
    try {
      await teamService.reorder(newOrder.map((m) => m._id));
      toast.success("Members reordered");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reorder members",
      );
      await load();
    }
  };

  return {
    members,
    sections,
    isLoading,
    search,
    setSearch,
    memberOpen,
    setMemberOpen,
    editing,
    imageData,
    setImageData,
    deleteTarget,
    setDeleteTarget,
    sectionOpen,
    setSectionOpen,
    editingSection,
    deleteSectionTarget,
    setDeleteSectionTarget,
    togglingMemberId,
    togglingSectionId,
    viewMember,
    setViewMember,
    dragState,
    setDragState,
    filtered,
    openCreate,
    openEdit,
    onMemberSaved,
    toggleMember,
    confirmDelete,
    openCreateSection,
    openEditSection,
    onSectionSubmit,
    toggleSection,
    confirmDeleteSection,
    handleViewMember,
    reorderSections,
    reorderMembers,
  };
}
