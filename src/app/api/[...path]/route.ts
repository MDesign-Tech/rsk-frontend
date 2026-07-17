import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\//, "");
  return proxyToBackend(request, path);
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\//, "");
  return proxyToBackend(request, path);
}

export async function PUT(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\//, "");
  return proxyToBackend(request, path);
}

export async function PATCH(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\//, "");
  return proxyToBackend(request, path);
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\//, "");
  return proxyToBackend(request, path);
}
