import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// PATCH /api/hero/visibility/trust -> Express /hero/visibility/trust
export async function PATCH(request: NextRequest) {
  return proxyToBackend(request, "hero/visibility/trust");
}
