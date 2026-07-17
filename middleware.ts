import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that do NOT require authentication.
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

  // Only protect the admin area.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow public auth paths through without any checks.
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Hit /me through the SAME origin (the /api proxy). This keeps the auth
  // cookie first-party so it is forwarded correctly by the browser/server.
  const meUrl = new URL("/api/auth/me", request.url);

  try {
    const response = await fetch(meUrl.toString(), {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    console.log(response)

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
