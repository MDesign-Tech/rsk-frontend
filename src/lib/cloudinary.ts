import axios from "axios";
import crypto from "crypto";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryImage> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not configured in environment variables");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  console.log("[Cloudinary] Uploading to:", url);
  console.log("[Cloudinary] Using upload preset:", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    console.log("[Cloudinary] Upload successful:", response.data.secure_url);

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
    };
  } catch (networkError) {
    console.error("[Cloudinary] Network error:", networkError);
    throw new Error(
      `Network error while uploading to Cloudinary. Please check your internet connection and CORS settings. Details: ${networkError instanceof Error ? networkError.message : "Unknown error"}`
    );
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not configured in environment variables");
  }

  if (!CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is not configured in environment variables");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;

  console.log("[Cloudinary] Deleting image:", publicId);

  try {
    // If API secret is available, use authenticated deletion (more reliable)
    if (CLOUDINARY_API_SECRET) {
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature({
        timestamp,
        public_id: publicId,
      });

      await axios.post(
        url,
        {
          public_id: publicId,
          api_key: CLOUDINARY_API_KEY,
          timestamp,
          signature,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // Fallback to unsigned deletion (requires upload preset to allow unsigned deletion)
      await axios.post(
        url,
        {
          public_id: publicId,
          upload_preset: CLOUDINARY_UPLOAD_PRESET,
          api_key: CLOUDINARY_API_KEY,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[Cloudinary] Delete successful:", publicId);
  } catch (networkError) {
    console.error("[Cloudinary] Delete error:", networkError);
    const message = networkError instanceof Error ? networkError.message : "Unknown error";
    throw new Error(`Failed to delete image from Cloudinary. Details: ${message}`);
  }
}

function generateSignature(params: Record<string, string | number>): string {
  if (!CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is not configured");
  }

  // Sort parameters alphabetically and create the string to sign
  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");

  // Use Node.js crypto module for SHA-1 hash
  return crypto.createHash("sha1").update(stringToSign + CLOUDINARY_API_SECRET).digest("hex");
}
