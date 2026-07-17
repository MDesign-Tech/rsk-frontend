import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// GET/PUT/POST /api/hero -> Express /api/hero
export async function GET(request: NextRequest) {
  return proxyToBackend(request, "hero");
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, "hero");
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "hero");
}
