"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Reply, EyeOff } from "lucide-react";
import { contactService } from "@/services/contact.service";
import type { ContactMessage, ContactStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/admin/icon-button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLES: Record<ContactStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  replied: "bg-green-100 text-green-800 border-green-200",
};

function StatusBadge({ status }: { status?: ContactStatus }) {
  const value = status ?? "pending";
  return (
    <Badge className={STATUS_STYLES[value]} variant="outline">
      {value === "replied" ? "Replied" : "Pending"}
    </Badge>
  );
}

export function ContactManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewTarget, setViewTarget] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getAll();
      setMessages(res.data.messages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(
        err instanceof Error ? err.message : "Failed to load messages",
      );
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
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("Message deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } 
  };

  const openReply = (message: ContactMessage) => {
    setReplyTarget(message);
    setReplyText(message.reply ?? "");
  };

  const toggleVisibility = async (message: ContactMessage) => {
    const next = !message.visible;
    try {
      const res = await contactService.toggleVisibility(message._id, next);
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? res.data.message : m))
      );
      toast.success(next ? "Message shown" : "Message hidden");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    }
  };

  const sendReply = async () => {
    if (!replyTarget) return;
    if (!replyText.trim()) {
      toast.error("Reply message is required");
      return;
    }
    setIsReplying(true);
    try {
      const res = await contactService.reply(replyTarget._id, replyText.trim());
      const updated = res.data.message;
      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m)),
      );
      
      setReplyTarget(null);
      setReplyText("");
      setIsReplying(false);
      toast.success("Reply sent");
    } catch (err) {
      setIsReplying(false);
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
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
    {
      key: "email",
      header: "Email",
      render: (m) => (
        <a
          href={`mailto:${m.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {m.email}
        </a>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (m) => <span className="line-clamp-1">{m.message}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (m) => formatDate(m.createdAt),
    },
    {
      key: "replyAt",
      header: "Reply Date",
      render: (m) => formatDate(m.replyAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (m) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label="View message"
            icon={<Eye />}
            onClick={() => setViewTarget(m)}
          />
          <IconButton
            variant="secondary"
            label="Reply to message"
            icon={<Reply />}
            onClick={() => openReply(m)}
          />
          <IconButton
            variant="destructive"
            label="Delete message"
            icon={<Trash2 />}
            onClick={() => setDeleteTarget(m)}
          />
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
            {viewTarget?.reply && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Reply</p>
                <p className="whitespace-pre-wrap rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
                  {viewTarget.reply}
                </p>
                <p className="text-xs text-muted-foreground">
                  Replied {formatDate(viewTarget.replyAt)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!replyTarget}
        onOpenChange={(o) => !o && setReplyTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {replyTarget?.name}</DialogTitle>
            <DialogDescription>
              Your reply will be sent to{" "}
              <a
                href={`mailto:${replyTarget?.email}`}
                className="text-primary hover:underline"
              >
                {replyTarget?.email}
              </a>
              .
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows={6}
            disabled={isReplying}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReplyTarget(null)}
              disabled={isReplying}
            >
              Cancel
            </Button>
            <Button onClick={sendReply} disabled={isReplying}>
              {isReplying && <Spinner />}
              Send Reply
            </Button>
          </DialogFooter>
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
