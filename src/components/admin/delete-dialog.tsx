"use client";

import { ConfirmDialog } from "./confirm-dialog";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isDeleting}
      title={title}
      description={description}
      confirmText="Delete"
      variant="destructive"
    />
  );
}
