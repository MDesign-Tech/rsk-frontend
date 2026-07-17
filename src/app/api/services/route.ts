import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// GET/POST /api/services -> Express /api/services
export async function GET(request: NextRequest) {
  return proxyToBackend(request, "services");
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "services");
}
