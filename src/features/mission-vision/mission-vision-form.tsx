"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { missionVisionSchema, type MissionVisionInput } from "@/schemas";
import { missionVisionService } from "@/services/missionVision.service";

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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormCard } from "@/components/admin/form-card";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function MissionVisionForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<MissionVisionInput>({
    resolver: zodResolver(missionVisionSchema),
    defaultValues: {
      missionTitle: "",
      missionDescription: "",
      visionTitle: "",
      visionDescription: "",
      visible: true,
    },
  });

 useEffect(() => {
  const load = async () => {
    try {
      const res = await missionVisionService.get();

      const mv = res.data;

      if (!mv) {
        throw new Error("Mission vision not found");
      }

      form.reset({
        missionTitle: mv.missionTitle ?? "",
        missionDescription: mv.missionDescription ?? "",
        visionTitle: mv.visionTitle ?? "",
        visionDescription: mv.visionDescription ?? "",
        visible: mv.visible ?? true,
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(
        err instanceof Error ? err.message : "Failed to load"
      );
    }
  };

  load();
}, [form]);

  const onSubmit = async (values: MissionVisionInput) => {
    setIsSaving(true);
    try {
      await missionVisionService.update(values);
      setIsSaving(false);
      toast.success("Mission & Vision updated");
    } catch (err) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading..." />;

  return (
    <FormCard
      title="Mission & Vision"
      description="Update the mission and vision statement."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="missionTitle"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-4">
                    <FormLabel>Mission Title</FormLabel>
                    <FormField
                      control={form.control}
                      name="visible"
                      render={({ field: visField }) => (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {visField.value ? "Visible" : "Hidden"}
                              </span>
                              <Switch
                                id="mission-vision-visible"
                                checked={visField.value}
                                onCheckedChange={visField.onChange}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {visField.value
                              ? "Hide this section from the website"
                              : "Show this section on the website"}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    />
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vision Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="missionDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mission Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visionDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vision Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <SubmitButton isLoading={isSaving}>Save Changes</SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
