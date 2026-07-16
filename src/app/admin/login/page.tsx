"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas";
import { useAuthStore } from "@/stores/auth.store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Maps the `?reason=` query param (set by middleware / the auth gate) to a
// human-readable message shown AFTER the redirect lands on the login page.
const REASON_MESSAGES: Record<string, { title: string; description: string }> = {
  unauthorized: {
    title: "Session required",
    description: "Your session expired or you are not signed in. Please log in to continue.",
  },
  logout: {
    title: "Logged out",
    description: "You have been signed out. Sign in again to continue.",
  },
};

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason && REASON_MESSAGES[reason]) {
      const { title, description } = REASON_MESSAGES[reason];
      router.replace("/admin/login");
      toast.error(title, { description });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, router]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      await login(values.email, values.password);
      router.push("/admin");
      toast.success("Login successful");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">RSK Associates Admin</CardTitle>
          <CardDescription>Sign in to manage your website content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@rsk.com"
                        autoComplete="email"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <Spinner />}
                Sign In
              </Button>
              <div className="text-center text-sm">
                <Link
                  href="/admin/forgot-password"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// `useSearchParams` must be wrapped in Suspense for static rendering.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
