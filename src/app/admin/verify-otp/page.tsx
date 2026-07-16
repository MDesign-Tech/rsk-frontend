"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpInput } from "@/schemas";
import { authService } from "@/services/auth.service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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

const RESEND_SECONDS = 60;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const resendTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  // Redirect back to the start if no email is present.
  useEffect(() => {
    if (!email) router.replace("/admin/forgot-password");
  }, [email, router]);

  // Countdown that disables the resend button.
  useEffect(() => {
    resendTimer.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (resendTimer.current) clearInterval(resendTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (resendTimer.current) clearInterval(resendTimer.current);
    };
  }, []);

  const startCountdown = () => {
    setSecondsLeft(RESEND_SECONDS);
    if (resendTimer.current) clearInterval(resendTimer.current);
    resendTimer.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (resendTimer.current) clearInterval(resendTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);
    try {
      await authService.resendOTP({ email });
      startCountdown();
      setIsResending(false);
      toast.success("A new OTP has been sent to your email");
    } catch (err) {
      setIsResending(false);
      toast.error(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  const onSubmit = async (values: VerifyOtpInput) => {
    if (!email) return;
    setIsSubmitting(true);
    try {
      await authService.verifyOTP({ email, otp: values.otp });
      toast.success("OTP verified");
      router.push(
        `/admin/reset-password?email=${encodeURIComponent(
          email,
        )}&otp=${encodeURIComponent(values.otp)}`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="items-center">
                  <FormLabel className="sr-only">One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      autoFocus
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              Verify
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          {secondsLeft > 0 ? (
            <span className="text-muted-foreground">
              Resend OTP in {secondsLeft} second{secondsLeft === 1 ? "" : "s"}
            </span>
          ) : (
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending && <Spinner />}
              Resend OTP
            </Button>
          )}
        </div>

        <div className="mt-2 text-center text-sm">
          <Link
            href="/admin/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Use a different email
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<Card className="w-full max-w-md"><CardContent><div className="flex justify-center py-8"><Spinner /></div></CardContent></Card>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
