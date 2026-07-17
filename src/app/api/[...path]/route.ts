import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

// Catch-all BFF proxy for every content endpoint not handled by a dedicated
// route handler above. This covers: /faqs, /users, /contact, /partners,
// /team, /mission-vision, /website and all nested sub-paths
// (e.g. /services/:id, /about/visibility, /hero/upload, /users/:id/reply).
//
// The browser only ever calls /api/*; this handler forwards to Express.
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
