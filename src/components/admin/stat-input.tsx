"use client";

import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
import { IconButton } from "@/components/admin/icon-button";
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AboutInput } from "@/schemas";

interface StatInputProps {
  index: number;
  visible?: boolean;
  onToggle: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function StatInput({
  index,
  visible = true,
  onToggle,
  onRemove,
  disabled,
}: StatInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AboutInput>();

  const statError = errors.stats?.[index];

  return (
    <div className="grid grid-cols-[1fr_1fr_auto_auto] items-start gap-3">
      <div className="space-y-1">
        <Input
          placeholder="e.g. 500+"
          {...register(`stats.${index}.number` as const)}
        />
        {statError?.number && (
          <FormMessage>{statError.number.message}</FormMessage>
        )}
      </div>
      <div className="space-y-1">
        <Input
          placeholder="e.g. Clients"
          {...register(`stats.${index}.label` as const)}
        />
        {statError?.label && (
          <FormMessage>{statError.label.message}</FormMessage>
        )}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <StatusToggle
              checked={visible !== false}
              onCheckedChange={onToggle}
              className="mt-0.5"
              disabled={disabled}
              aria-label={visible === false ? "Show stat" : "Hide stat"}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {visible === false ? "Show stat" : "Hide stat"}
        </TooltipContent>
      </Tooltip>
      <IconButton
        variant="outline"
        label="Remove stat"
        icon={<X />}
        className="mt-0.5"
        onClick={onRemove}
      />
    </div>
  );
}
