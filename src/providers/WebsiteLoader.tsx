"use client";

import { useWebsiteStore } from "@/stores/website.store";
import { Loader2 } from "lucide-react";
export function WebsiteLoader() {
  const loading = useWebsiteStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div
      className="
    fixed inset-0
    z-50
    flex
    items-center
    justify-center
    bg-background
  "
    >
      <div className="text-center">
        <Loader2
          className="
        w-10 h-10
        animate-spin
        mx-auto
        text-primary
        "
        />
      </div>
    </div>
  );
}
