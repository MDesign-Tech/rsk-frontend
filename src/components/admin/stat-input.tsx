"use client";

import { useFormContext } from "react-hook-form";
import { X, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
import { IconButton } from "@/components/admin/icon-button";
import type { AboutInput } from "@/schemas";

interface StatInputProps {
  index: number;
  visible?: boolean;
  onToggle: (visible: boolean) => void;
  onRemove: () => void;
}

export function StatInput({
  index,
  visible = true,
  onToggle,
  onRemove,
}: StatInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AboutInput>();

  const statError = errors.stats?.[index];

  return (
    <div className="grid grid-cols-[1fr_1fr_auto_auto] items-start gap-3">
      <div className="space-y-1">
        <Input placeholder="e.g. 500+" {...register(`stats.${index}.number` as const)} />
        {statError?.number && (
          <FormMessage>{statError.number.message}</FormMessage>
        )}
      </div>
      <div className="space-y-1">
        <Input placeholder="e.g. Clients" {...register(`stats.${index}.label` as const)} />
        {statError?.label && (
          <FormMessage>{statError.label.message}</FormMessage>
        )}
      </div>
      <IconButton
        variant="outline"
        label={visible === false ? "Show stat" : "Hide stat"}
        icon={visible === false ? <EyeOff /> : <Eye />}
        className="mt-0.5"
        onClick={() => onToggle(!visible)}
      />
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
