"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserInput } from "@/schemas";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormCard } from "@/components/admin/form-card";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { SubmitButton } from "@/components/admin/submit-button";
import { toast } from "sonner";

export function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", phone: "", role: "admin", password: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        role: "admin",
        password: "",
      });
      setIsLoading(false);
    }
  }, [user, form]);

  const onSubmit = async (values: UserInput) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: "admin" as const,
        ...(values.password ? { password: values.password } : {}),
      };
      const res = await userService.update(user._id, payload);
      const updated: AuthUser = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        phone: res.data.user.phone,
      };
      setUser(updated);
      form.reset({ ...payload, password: "" });
      setIsSaving(false);
      toast.success("Profile updated");
    } catch (err) {
       setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (isLoading || !user) return <LoadingSpinner label="Loading profile..." />;

  return (
    <FormCard
      title="Profile"
      description="Update your personal account details."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    {...field}
                  />
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
