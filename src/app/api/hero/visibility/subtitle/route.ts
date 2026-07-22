import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// PATCH /api/hero/visibility/subtitle -> Express /hero/visibility/subtitle
export async function PATCH(request: NextRequest) {
  return proxyToBackend(request, "hero/visibility/subtitle");
}
