"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Eye, EyeOff } from "lucide-react";
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
import { IconButton } from "@/components/admin/icon-button";
import { FormCard } from "@/components/admin/form-card";
import { StatInput } from "@/components/admin/stat-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function AboutForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AboutInput>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: "",
      description: "",
      visible: true,
      stats: [],
      contactMethods: [],
      socialMedia: {
        facebook: { href: null, visible: true },
        instagram: { href: null, visible: true },
        whatsapp: { href: null, visible: true },
        x: { href: null, visible: true },
        linkedin: { href: null, visible: true },
        youtube: { href: null, visible: true },
      },
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
          visible: a.visible ?? true,
          stats: a.stats ?? [],
          contactMethods: a.contactMethods ?? [],
          socialMedia: a.socialMedia ?? {
            facebook: { href: null, visible: true },
            instagram: { href: null, visible: true },
            whatsapp: { href: null, visible: true },
            x: { href: null, visible: true },
            linkedin: { href: null, visible: true },
            youtube: { href: null, visible: true },
          },
        });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast.error(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, [form]);

  const onSubmit = async (values: AboutInput) => {
    setIsSaving(true);
    try {
      await aboutService.update(values);
      setIsSaving(false);
      toast.success("About content updated");
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const toggleStatVisibility = (index: number, visible: boolean) => {
    const stats = form.getValues("stats");
    const next = stats.map((s, i) => (i === index ? { ...s, visible } : s));
    form.setValue("stats", next, { shouldDirty: true });
  };

  // Toggle the visibility of an individual contact method by index.
  const toggleContactMethodVisibility = (index: number, visible: boolean) => {
    const contactMethods = form.getValues("contactMethods");
    const next = contactMethods.map((c, i) =>
      i === index ? { ...c, visible } : c
    );
    form.setValue("contactMethods", next, { shouldDirty: true });
  };

  if (isLoading) return <LoadingSpinner label="Loading..." />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormCard
          title="About Us"
          description="Update the about section and statistics."
          footer={
            <div className="flex justify-end">
              <SubmitButton isLoading={isSaving}>Save Changes</SubmitButton>
            </div>
          }
        >
          <div className="space-y-6">
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
              <IconButton
                variant="outline"
                label="Add stat"
                icon={<Plus />}
                onClick={() => append({ number: "", label: "", visible: true })}
              />
            </div>
            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No statistics yet.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-1 text-xs font-medium text-muted-foreground">
                  <span>Number</span>
                  <span>Label</span>
                  <span />
                  <span />
                </div>
                {fields.map((f, i) => (
                  <StatInput
                    key={f.id}
                    index={i}
                    visible={form.watch(`stats.${i}.visible`) ?? true}
                    onToggle={(visible) => toggleStatVisibility(i, visible)}
                    onRemove={() => remove(i)}
                    disabled={isSaving}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Contact Information</label>
              <IconButton
                variant="outline"
                label="Add contact"
                icon={<Plus />}
                onClick={() =>
                  appendContact({ label: "", value: "", href: "", visible: true })
                }
              />
            </div>

            {contactFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contact information yet.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 px-1 text-xs font-medium text-muted-foreground">
                  <span>Label</span>
                  <span>Value</span>
                  <span>Link</span>
                  <span />
                  <span />
                </div>
                {contactFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_1fr_1fr_auto_auto] items-start gap-3"
                  >
                    <FormField
                      control={form.control}
                      name={`contactMethods.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
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
                        <FormItem className="space-y-1">
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
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input
                              placeholder="tel:, mailto:, https://"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <IconButton
                      variant="outline"
                      label={
                        form.watch(`contactMethods.${index}.visible`) === false
                          ? "Show contact method"
                          : "Hide contact method"
                      }
                      icon={
                        form.watch(`contactMethods.${index}.visible`) === false ? (
                          <EyeOff />
                        ) : (
                          <Eye />
                        )
                      }
                      className="mt-0.5"
                      onClick={() =>
                        toggleContactMethodVisibility(
                          index,
                          !(form.watch(`contactMethods.${index}.visible`) ?? true)
                        )
                      }
                      disabled={isSaving}
                    />
                    <IconButton
                      variant="outline"
                      label="Remove contact"
                      icon={<X />}
                      className="mt-0.5"
                      onClick={() => removeContact(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Social Media */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Social Media</label>
            <div className="space-y-2">
              {(
                [
                  "facebook",
                  "instagram",
                  "whatsapp",
                  "x",
                  "linkedin",
                  "youtube",
                ] as const
              ).map((platform) => (
                <div
                  key={platform}
                  className="grid grid-cols-[1fr_auto_auto] items-start gap-3"
                >
                  <FormField
                    control={form.control}
                    name={`socialMedia.${platform}.href`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Input
                            placeholder={`${platform} URL`}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <IconButton
                    variant="outline"
                    label={
                      form.watch(`socialMedia.${platform}.visible`) === false
                        ? `Show ${platform}`
                        : `Hide ${platform}`
                    }
                    icon={
                      form.watch(`socialMedia.${platform}.visible`) === false ? (
                        <EyeOff />
                      ) : (
                        <Eye />
                      )
                    }
                    className="mt-0.5"
                    onClick={() =>
                      form.setValue(
                        `socialMedia.${platform}.visible`,
                        !(form.watch(`socialMedia.${platform}.visible`) ?? true),
                        { shouldDirty: true }
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>
          </div>
        </FormCard>
      </form>
    </Form>
  );
}
