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
      });

    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load"
      );
    } finally {
      setIsLoading(false);
    }
  };

  load();
}, [form]);

  const onSubmit = async (values: MissionVisionInput) => {
    setIsSaving(true);
    try {
      await missionVisionService.update(values);
      toast.success("Mission & Vision updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSaving(false);
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
                  <FormLabel>Mission Title</FormLabel>
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
