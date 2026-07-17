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

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie");

  console.log("Middleware cookie:", cookie);

  if (!cookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "unauthorized");

    return NextResponse.redirect(loginUrl);
  }

  try {
    const response = await fetch(
      new URL("/api/auth/me", request.url),
      {
        headers: {
          Cookie: cookie,
        },
        cache: "no-store",
      }
    );

    console.log("Auth status:", response.status);

    if (!response.ok) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("reason", "unauthorized");

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Middleware auth error:", error);

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "unauthorized");

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};