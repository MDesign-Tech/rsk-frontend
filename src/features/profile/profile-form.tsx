"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";
import { userSchema, type UserInput } from "@/schemas";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser, TeamMember } from "@/types";
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
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", phone: "", role: "admin", password: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
    ),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        role: user.role,
        password: "",
      });
      setIsLoading(false);
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (values: UserInput) => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: user.role,
      };
      const res = await userService.update(user._id, payload);
      const updated: AuthUser = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        phone: res.data.user.phone,
        member: res.data.user.member,
      };
      setUser(updated);
      profileForm.reset({ ...payload, password: "" });
      setIsSavingProfile(false);
      toast.success("Profile updated");
    } catch (err) {
      setIsSavingProfile(false);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const onPasswordSubmit = async (values: { currentPassword: string; newPassword: string }) => {
    if (!user) return;
    setIsChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset({ currentPassword: "", newPassword: "" });
      setIsChangingPassword(false);
      toast.success("Password changed successfully");
    } catch (err) {
      setIsChangingPassword(false);
      toast.error(err instanceof Error ? err.message : "Current password is incorrect");
    }
  };

  if (isLoading || !user) return <LoadingSpinner label="Loading profile..." />;

  const memberInfo = user.member && typeof user.member === "object" ? (user.member as TeamMember) : null;

  return (
    <div className="space-y-6">
      {/* Profile Information Section */}
      <FormCard
        title="Profile Information"
        description="View and update your personal account details."
      >
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            {/* Display all user information in a comprehensive view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{user.name || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{user.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium capitalize">{user.role}</p>
                </div>
              </div>
              {memberInfo && (
                <>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Member Name</p>
                      <p className="text-sm font-medium">{memberInfo.name || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="text-sm font-medium">{memberInfo.title || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{memberInfo.department || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="text-sm font-medium">{memberInfo.position || "—"}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
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
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                       <Input type="email" {...field} disabled={!user.member} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
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
            </div>
            <div className="flex justify-end">
              <SubmitButton isLoading={isSavingProfile}>Save Changes</SubmitButton>
            </div>
          </form>
        </Form>
      </FormCard>

      {/* Divider */}
      <hr className="border-border" />

      {/* Change Password Section */}
      <FormCard
        title="Change Password"
        description="Update your account password. Enter your current password and a new password."
      >
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <SubmitButton isLoading={isChangingPassword} type="submit">
                Save Changes
              </SubmitButton>
            </div>
          </form>
        </Form>
      </FormCard>
    </div>
  );
}

