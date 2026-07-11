"use client";

import { useWebsiteStore } from "@/stores/website.store";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function AdminError() {
  const error = useWebsiteStore((state) => state.error);
  const fetchWebsite = useWebsiteStore((state) => state.fetchWebsite);

  if (!error) return null;

  return (
    <div className="flex min-h-[400px] items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4">500</h1>
        <h2 className="text-xl font-semibold mb-3">Server Error</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the website content. The server may be temporarily unavailable.
          Please try again later.
        </p>
        <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted/50 p-3 rounded-lg">
          {error}
        </p>
        <Button onClick={() => fetchWebsite()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}
