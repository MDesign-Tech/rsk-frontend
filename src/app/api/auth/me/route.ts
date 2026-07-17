import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// GET /api/auth/me -> Express GET /api/auth/me
// The BFF forwards the browser's auth cookie to Express, which validates the
// JWT and returns the authenticated user. JWT validation stays in Express.
export async function GET(request: NextRequest) {
  return proxyToBackend(request, "auth/me");
}
