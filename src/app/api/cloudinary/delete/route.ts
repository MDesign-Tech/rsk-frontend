import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff";

export async function DELETE(request: NextRequest) {
  const path = "cloudinary/delete";
  return proxyToBackend(request, path);
}
