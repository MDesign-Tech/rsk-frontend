"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { contactService } from "@/services/contact.service";
import type { ContactMessage } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { toast } from "sonner";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ContactManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewTarget, setViewTarget] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getAll();
      setMessages(res.data.messages);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load messages",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await contactService.remove(deleteTarget._id);
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      toast.success("Message deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<ContactMessage>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "message",
      header: "Message",
      render: (m) => <span className="line-clamp-1">{m.message}</span>,
    },
    {
      key: "createdAt",
      header: "Received",
      render: (m) => formatDate(m.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (m) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewTarget(m)}>
            <Eye /> View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteTarget(m)}
          >
            <Trash2 /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search messages..."
      />

      {isLoading ? (
        <LoadingSpinner label="Loading messages..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No messages found"
          description={
            search
              ? "No messages match your search."
              : "Contact form submissions will appear here."
          }
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <Dialog
        open={!!viewTarget}
        onOpenChange={(o) => !o && setViewTarget(null)}
      >
        <DialogContent>
          <DialogHeader>  
            <DialogTitle>{viewTarget?.name}</DialogTitle>
            <DialogDescription>
              <a href={`mailto:${viewTarget?.email}`}>{viewTarget?.email}</a>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Received {formatDate(viewTarget?.createdAt)}
            </p>
            <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-sm">
              {viewTarget?.message}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete message?"
        description="Are you sure you want to delete this contact message? This action cannot be undone."
      />
    </div>
  );
}
