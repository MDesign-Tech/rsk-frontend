import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { error: "publicId is required" },
        { status: 400 }
      );
    }

    await deleteFromCloudinary(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Cloudinary delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete image" },
      { status: 500 }
    );
  }
}
