"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { IconButton } from "@/components/admin/icon-button";
import { faqSchema, type FaqInput } from "@/schemas";
import { faqService } from "@/services/faq.service";
import type { FAQ } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function FaqsManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const form = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: { question: "", answer: "" },
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await faqService.getAll();
      setFaqs(res.data.faqs);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err instanceof Error ? err.message : "Failed to load FAQs");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.reset({ question: "", answer: "" });
    setDialogOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditing(faq);
    form.reset({ question: faq.question, answer: faq.answer });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FaqInput) => {
    setIsSaving(true);
    try {
      if (editing) {
        const res = await faqService.update(editing._id, values);
        setFaqs((prev) =>
          prev.map((f) => (f._id === editing._id ? res.data.faq : f))
        );
        toast.success("FAQ updated");
      } else {
        const res = await faqService.create(values);
        setFaqs((prev) => [res.data.faq, ...prev]);
        toast.success("FAQ created");
      }
      setDialogOpen(false);
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Save failed");
    } 
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await faqService.remove(deleteTarget._id);
      setFaqs((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      setDeleteTarget(null);
      setIsDeleting(false);
      toast.success("FAQ deleted");
    } catch (err) {
      setIsDeleting(false);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleVisibility = async (faq: FAQ) => {
    setTogglingId(faq._id);
    try {
      const res = await faqService.toggleVisibility(faq._id, !faq.visible);
      setFaqs((prev) =>
        prev.map((f) => (f._id === faq._id ? res.data.faq : f))
      );
      toast.success(res.data.faq.visible ? "FAQ shown" : "FAQ hidden");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<FAQ>[] = [
    {
      key: "question",
      header: "Question",
      render: (f) => <span className="line-clamp-1 font-medium">{f.question}</span>,
    },
    {
      key: "answer",
      header: "Answer",
      render: (f) => <span className="line-clamp-1">{f.answer}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (f) => (
        <div className="flex justify-end gap-2">
          <IconButton
            variant="outline"
            label={f.visible === false ? "Show FAQ" : "Hide FAQ"}
            icon={f.visible === false ? <EyeOff /> : <Eye />}
            onClick={() => toggleVisibility(f)}
            disabled={togglingId === f._id}
          />
          <IconButton
            variant="outline"
            label="Edit FAQ"
            icon={<Pencil />}
            onClick={() => openEdit(f)}
          />
          <IconButton
            variant="destructive"
            label="Delete FAQ"
            icon={<Trash2 />}
            onClick={() => setDeleteTarget(f)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search FAQs..." />
        <IconButton
          variant="default"
          label="Add FAQ"
          icon={<Plus />}
          onClick={openCreate}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading FAQs..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No FAQs found"
          description={
            search
              ? "No FAQs match your search."
              : "Add your first FAQ to get started."
          }
        />
      ) : (
        <DataTable columns={columns} data={filtered} keyField="_id" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this FAQ."
                : "Fill in the question and answer to create a new FAQ."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={isSaving}>
                  {editing ? "Save Changes" : "Create"}
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete FAQ?"
        description={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
      />
    </div>
  );
}
