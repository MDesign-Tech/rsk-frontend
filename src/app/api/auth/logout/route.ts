import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// POST /api/auth/logout -> Express POST /api/auth/logout
// The BFF clears the frontend auth cookie after the backend logs the user out.
export async function POST(request: NextRequest) {
  return proxyToBackend(request, "auth/logout");
}
