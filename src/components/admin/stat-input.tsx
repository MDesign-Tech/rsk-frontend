"use client";

import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import type { AboutInput } from "@/schemas";

interface StatInputProps {
  index: number;
  onRemove: () => void;
}

// A single stat row (number + label) used inside the About Us form field array.
export function StatInput({ index, onRemove }: StatInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AboutInput>();

  const statError = errors.stats?.[index];

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium">Number</label>
          <Input placeholder="e.g. 500+" {...register(`stats.${index}.number` as const)} />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium">Label</label>
          <Input placeholder="e.g. Clients" {...register(`stats.${index}.label` as const)} />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRemove}
          aria-label="Remove stat"
        >
          <X />
        </Button>
      </div>
      {statError?.number && (
        <FormMessage>{statError.number.message}</FormMessage>
      )}
      {statError?.label && (
        <FormMessage>{statError.label.message}</FormMessage>
      )}
    </div>
  );
}
