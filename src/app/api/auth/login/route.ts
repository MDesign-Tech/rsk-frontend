import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// POST /api/auth/login -> Express POST /api/auth/login
// Express issues the JWT cookie; the BFF re-issues it on the frontend domain.
export async function POST(request: NextRequest) {
  return proxyToBackend(request, "auth/login");
}
