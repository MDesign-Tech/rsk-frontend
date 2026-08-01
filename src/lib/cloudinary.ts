import axios from "axios";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
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

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Image size exceeds 3MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  try {
    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

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

/**
 * Deletes an image from Cloudinary via the backend API route.
 * This should be used from client-side code, as it delegates to the
 * server-side /api/cloudinary/delete endpoint which has access to
 * CLOUDINARY_API_SECRET for authenticated deletion.
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) {
    throw new Error("publicId is required");
  }

  const response = await axios.delete("/api/cloudinary/delete", {
    data: { publicId },
  });

  if (response.status !== 200) {
    throw new Error("Failed to delete image from Cloudinary");
  }
}
