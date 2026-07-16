import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that do NOT require authentication.
const PUBLIC_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/verify-otp",
  "/admin/reset-password",
];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect the admin area.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow public auth paths through without any checks.
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      const loginUrl = new URL("/admin/login", request.url);
      // Signal the login page to show the "Not authorized" toast after redirect.
      loginUrl.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
