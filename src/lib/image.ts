import { SERVER_BASE_URL } from "./constants";

// Build an absolute URL for images stored on the backend (e.g. /uploads/foo.jpg).
// If the path is already absolute (http/https/data:) it is returned unchanged.
export function getImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (path.startsWith("//")) return `https:${path}`;
  return `${SERVER_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
