"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/analytics";
import { usePathname } from "next/navigation";

/**
 * Tracks page views on client-side route changes.
 *
 * The Google tag (gtag.js) script and initialization are now loaded
 * statically in the root layout's <head>, so this component only
 * handles SPA navigation tracking to avoid duplicate Google tags.
 */
export function AnalyticsWrapper() {
  const pathname = usePathname();
  const hasTracked = useRef<string | null>(null);

  // Track page views on route changes
  useEffect(() => {
    if (pathname && pathname !== hasTracked.current) {
      hasTracked.current = pathname;
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
