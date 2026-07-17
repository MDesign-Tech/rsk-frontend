import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Absolute backend URL used for SERVER-side fetches from the BFF route handlers.
const SERVER_API_URL =
  process.env.NEXT_PUBLIC_SERVER_API_URL ||
  "https://rsk-backend-api.vercel.app/api";

const AUTH_COOKIE_NAME = "token";

export async function proxyToBackend(
  request: NextRequest,
  path: string
): Promise<NextResponse> {
  const cookieStore = await cookies();

  // Build backend URL.
  const target = new URL(
    `${SERVER_API_URL.replace(/\/$/, "")}/${path}`
  );
  target.search = request.nextUrl.search;

  // Clone incoming headers.
  const headers = new Headers(request.headers);

  // Remove headers that should not be forwarded.
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  // Forward auth cookie if present.
  const incomingCookies = request.headers.get("cookie");
  if (incomingCookies) {
    headers.set("cookie", incomingCookies);
  }

  const backendResponse = await fetch(target.toString(), {
  method: request.method,
  headers,
  body:
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : request.body,
  cache: "no-store",
  redirect: "manual",
  duplex: "half",
} as RequestInit & { duplex: "half" });

  const responseHeaders = new Headers();

  const contentType = backendResponse.headers.get("content-type");
  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });

  // Forward auth cookie from backend to frontend domain.
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

  // Handle logout.
  if (
    backendResponse.status === 200 &&
    !setCookie &&
    cookieStore.get(AUTH_COOKIE_NAME)
  ) {
    if (path.endsWith("/logout")) {
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
  const [pair, ...attrs] = header.split(";").map((s) => s.trim());

  const eq = pair.indexOf("=");

  const name = pair.slice(0, eq);
  const value = pair.slice(eq + 1);

  let maxAge: number | undefined;

  for (const attr of attrs) {
    const [key, val] = attr.split("=");

    if (key.toLowerCase() === "max-age") {
      maxAge = Number(val);
    }
  }

  return {
    name,
    value,
    maxAge,
  };
}