import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Absolute backend URL used for SERVER-side fetches from the BFF route handlers.
// Must be a full URL because the server cannot use a relative path.
const SERVER_API_URL =
  process.env.NEXT_PUBLIC_SERVER_API_URL ||
  "https://rsk-backend-api.vercel.app/api";

// Name of the HttpOnly auth cookie set by the Express backend.
const AUTH_COOKIE_NAME = "token";

export async function proxyToBackend(
  request: NextRequest,
  path: string
): Promise<NextResponse> {
  const cookieStore = await cookies();

  // Build the absolute backend URL, preserving the query string.
  const target = new URL(
    `${SERVER_API_URL.replace(/\/$/, "")}/${path}`
  );
  target.search = request.nextUrl.search;

  // Forward the browser's auth cookie to Express (it validates the JWT).
  const incomingCookies = request.headers.get("cookie") ?? "";

  const backendResponse = await fetch(target.toString(), {
    method: request.method,
    headers: {
      "Content-Type":
        request.headers.get("content-type") || "application/json",
      // Only forward the cookie header; strip other browser headers that may
      // confuse the backend (host, origin, etc.).
      ...(incomingCookies ? { Cookie: incomingCookies } : {}),
    },
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
    cache: "no-store",
    redirect: "manual",
  });

  // Build the response we send back to the browser.
  const responseBody = await backendResponse.text();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") || "application/json",
    },
  });

  // Re-issue the backend's Set-Cookie on the FRONTEND domain so the browser
  // stores it first-party. This is the key fix for the production cookie bug.
  const setCookie = backendResponse.headers.get("set-cookie");
  if (setCookie) {
    const parsed = parseSetCookie(setCookie);
    if (parsed.name === AUTH_COOKIE_NAME) {
      response.cookies.set(parsed.name, parsed.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: parsed.maxAge,
      });
    }
  }

  // If the backend cleared the cookie (logout), clear it on the frontend too.
  if (
    backendResponse.status === 200 &&
    !setCookie &&
    cookieStore.get(AUTH_COOKIE_NAME)
  ) {
    // Logout path: backend may not return a Set-Cookie; clear explicitly.
    const isLogout = path.endsWith("/logout");
    if (isLogout) {
      response.cookies.set(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
  }

  return response;
}

function parseSetCookie(header: string): {
  name: string;
  value: string;
  maxAge?: number;
} {
  // Header looks like: token=abc; Max-Age=...; Path=/; HttpOnly; ...
  const [pair, ...attrs] = header.split(";").map((s) => s.trim());
  const eq = pair.indexOf("=");
  const name = pair.slice(0, eq);
  const value = pair.slice(eq + 1);
  let maxAge: number | undefined;
  for (const attr of attrs) {
    const [k, v] = attr.split("=");
    if (k.toLowerCase() === "max-age") {
      maxAge = Number(v);
    }
  }
  return { name, value, maxAge };
}
