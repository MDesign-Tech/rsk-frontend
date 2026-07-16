"use client";

import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface IconButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
    ButtonVariantProps {
  /** Accessible label, also used as the tooltip text. */
  label: string;
  /** The icon element to render (e.g. <Pencil />). */
  icon: ReactNode;
  /** Optional custom tooltip text (defaults to `label`). */
  tooltip?: string;
  /** Tooltip side. Defaults to "top". */
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/**
 * An icon-only button with a built-in tooltip. Use this for table row actions
 * (edit, delete, etc.) so the action is conveyed by the icon + tooltip instead
 * of inline text.
 */
export function IconButton({
  label,
  icon,
  tooltip,
  side = "top",
  className,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          aria-label={label}
          className={cn(className)}
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip ?? label}</TooltipContent>
    </Tooltip>
  );
}
