"use client"

import { useEffect } from "react";
import { useWebsiteStore } from "@/stores/website.store";

export function useInitializeWebsite() {
  const fetchWebsite = useWebsiteStore(
    (state) => state.fetchWebsite
  );

  const initialized = useWebsiteStore(
    (state) => state.initialized
  );

  useEffect(() => {
    if (!initialized) {
      fetchWebsite();
    }
  }, [initialized, fetchWebsite]);

  return initialized;
}