"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function SubmitButton({
  isLoading,
  children,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading || disabled} className={cn(className)} {...props}>
      {isLoading && <Spinner />}
      {children}
    </Button>
  );
}
