"use client";

import { Mail } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center px-4">
        <Mail className="size-14 mx-auto mb-4 opacity-30" />
        <h3 className="text-base font-medium mb-1">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
