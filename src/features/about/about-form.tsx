"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { aboutSchema, type AboutInput } from "@/schemas";
import { aboutService } from "@/services/about.service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormCard } from "@/components/admin/form-card";
import { StatInput } from "@/components/admin/stat-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";
import type { AboutUs } from "@/types";

export function AboutForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AboutInput>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: "",
      description: "",
      stats: [],
      contactMethods: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control: form.control,
    name: "contactMethods",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await aboutService.get();
        const a = res.data.about;
        form.reset({
          title: a.title,
          description: a.description,
          stats: a.stats ?? [],
          contactMethods: a.contactMethods ?? [],
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [form]);

  const onSubmit = async (values: AboutInput) => {
    setIsSaving(true);
    try {
      await aboutService.update(values);
      toast.success("About content updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading..." />;

  return (
    <FormCard
      title="About Us"
      description="Update the about section and statistics."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Statistics</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ number: "", label: "" })}
              >
                <Plus /> Add Stat
              </Button>
            </div>
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No statistics yet.
              </p>
            )}
            {fields.map((f, i) => (
              <StatInput key={f.id} index={i} onRemove={() => remove(i)} />
            ))}
          </div>
          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Contact Information</label>

            </div>

            {contactFields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No contact information yet.
              </p>
            )}

            {contactFields.map((field, index) => (
              <div
                key={field.id}
                className="grid md:grid-cols-4 gap-4 border rounded-lg p-4"
              >
                <FormField
                  control={form.control}
                  name={`contactMethods.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone, Email, Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contactMethods.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="+250788000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contactMethods.${index}.href`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tel:, mailto:, https://"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving}>Save Changes</SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
