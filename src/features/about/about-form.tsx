"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
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
import { SimpleRichTextEditor } from "@/features/contact/components/simple-rich-text-editor";
import { IconButton } from "@/components/admin/icon-button";
import { FormCard } from "@/components/admin/form-card";
import { StatInput } from "@/components/admin/stat-input";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { StatusToggle } from "@/components/ui/status-toggle";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        tiktok: { href: null, visible: true },
        snapchat: { href: null, visible: true },
      },
      ourStory: { title: "", description: "" },
      whatsappNumber: "",
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

  const extractWhatsappNumber = (href: string | null | undefined): string => {
    if (!href) return "";
    const waMatch = href.match(/wa\.me\/(\d+)/);
    if (waMatch) return waMatch[1];
    const apiMatch = href.match(/phone=(\d+)/);
    if (apiMatch) return apiMatch[1];
    if (/^\d+$/.test(href)) return href;
    return "";
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await aboutService.get();
        const a = res.data.about;
        const existingWhatsappHref = a.socialMedia?.whatsapp?.href;
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
            tiktok: { href: null, visible: true },
            snapchat: { href: null, visible: true },
          },
          ourStory: a.ourStory ?? { title: "", description: "" },
          whatsappNumber: extractWhatsappNumber(existingWhatsappHref),
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
      const payload: AboutInput = {
        title: values.title,
        description: values.description,
        visible: values.visible,
        stats: values.stats,
        contactMethods: values.contactMethods,
        socialMedia: {
          ...values.socialMedia,
          whatsapp: {
            ...values.socialMedia.whatsapp,
            href: values.whatsappNumber
              ? `https://wa.me/${values.whatsappNumber}`
              : null,
          },
        },
        ourStory: values.ourStory,
        whatsappNumber: "",
      };
      await aboutService.update(payload);
      setIsSaving(false);
      toast.success("About content updated");
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const toggleStatVisibility = (index: number) => {
    const stats = form.getValues("stats");
    const current = stats[index]?.visible ?? true;
    const next = stats.map((s, i) => (i === index ? { ...s, visible: !current } : s));
    form.setValue("stats", next, { shouldDirty: true });
  };

  // Toggle the visibility of an individual contact method by index.
  const toggleContactMethodVisibility = (index: number) => {
    const contactMethods = form.getValues("contactMethods");
    const current = contactMethods[index]?.visible ?? true;
    const next = contactMethods.map((c, i) =>
      i === index ? { ...c, visible: !current } : c
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
                  <SimpleRichTextEditor
                    value={field.value}
                    onChange={(html) => field.onChange(html)}
                    minHeight="150px"
                  />
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
                    onToggle={() => toggleStatVisibility(i)}
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

                    <Tooltip>
                      <TooltipTrigger asChild>
                         <span
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <StatusToggle
                          checked={
                            form.watch(`contactMethods.${index}.visible`) !== false
                          }
                          onCheckedChange={() =>
                            toggleContactMethodVisibility(index)
                          }
                          className="mt-0.5"
                          disabled={isSaving}
                          aria-label={
                            form.watch(`contactMethods.${index}.visible`) === false
                              ? "Show contact method"
                              : "Hide contact method"
                          }
                        />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {form.watch(`contactMethods.${index}.visible`) === false
                          ? "Show contact method"
                          : "Hide contact method"}
                      </TooltipContent>
                    </Tooltip>
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
          {/* Our Story */}
          <div className="space-y-3">
            <label className="text-lg font-medium">Our Story</label>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="ourStory.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Our Story" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ourStory.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Description</FormLabel>
                <FormControl>
                  <SimpleRichTextEditor
                    value={field.value}
                    onChange={(html) => field.onChange(html)}
                    minHeight="120px"
                    placeholder="Tell your story..."
                  />
                </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  "tiktok",
                  "snapchat",
                ] as const
              ).map((platform) => (
                <div
                  key={platform}
                  className="grid grid-cols-[1fr_auto_auto] items-start gap-3"
                >
                  {platform === "whatsapp" ? (
                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input
                              placeholder="250788492529"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
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
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <span
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                      <StatusToggle
                        checked={
                          form.watch(`socialMedia.${platform}.visible`) !== false
                        }
                        onCheckedChange={() =>
                          form.setValue(
                            `socialMedia.${platform}.visible`,
                            !form.watch(`socialMedia.${platform}.visible`),
                            { shouldDirty: true }
                          )
                        }
                        className="mt-0.5"
                        disabled={isSaving}
                        aria-label={
                          form.watch(`socialMedia.${platform}.visible`) === false
                            ? `Show ${platform}`
                            : `Hide ${platform}`
                        }
                      /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {form.watch(`socialMedia.${platform}.visible`) === false
                        ? `Show ${platform}`
                        : `Hide ${platform}`}
                    </TooltipContent>
                  </Tooltip>
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
