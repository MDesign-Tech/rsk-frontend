import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// GET/PUT/PATCH /api/about -> Express /api/about
export async function GET(request: NextRequest) {
  return proxyToBackend(request, "about");
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, "about");
}

export async function PATCH(request: NextRequest) {
  return proxyToBackend(request, "about");
}
