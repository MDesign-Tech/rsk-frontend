import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/verify-otp",
  "/admin/reset-password",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block public access to /services/* URLs — Services are a homepage section only.
  // These URLs must return 404, not redirect or pass through.
  if (pathname.startsWith("/services")) {
    return new NextResponse(null, { status: 404 });
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // BFF: the auth cookie is first-party (set on the frontend domain by the
  // /api/auth/* route handlers). Middleware only checks for its existence;
  // JWT validation remains the Express backend's responsibility. We do NOT
  // call Express from middleware (that caused the cookie to be lost before).
  const token = request.cookies.get("token");

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "unauthorized");

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/services/:path*"],
};