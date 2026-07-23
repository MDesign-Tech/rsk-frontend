"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, type CloudinaryImage } from "@/lib/cloudinary";
import { toast } from "sonner";

export interface ImageUploadHandle {
  upload: () => Promise<CloudinaryImage | null>;
}

interface ImageUploadProps {
  // Current image data stored on the backend.
  value?: CloudinaryImage | null;
  // Called with the uploaded Cloudinary image data, or null when removed.
  onChange: (imageData: CloudinaryImage | null) => void;
  // Disabled while the parent form is saving.
  disabled?: boolean;
  // Called when the upload state changes (true = uploading, false = idle).
  onUploadingChange?: (isUploading: boolean) => void;
  // Called with upload progress percentage (0-100).
  onProgress?: (progress: number) => void;
  label?: string;
  className?: string;
}

export const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
  function ImageUpload(
    {
      value,
      onChange,
      disabled,
      onUploadingChange,
      onProgress,
      label = "Image",
      className,
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const currentUrl = preview ?? value?.url ?? null;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;

      // Show local preview immediately, but don't upload yet
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    };

    const upload = async (): Promise<CloudinaryImage | null> => {
      if (!selectedFile) return value ?? null;

      setIsUploading(true);
      setUploadProgress(0);
      onUploadingChange?.(true);

      try {
        const imageData = await uploadToCloudinary(selectedFile, (progress) => {
          setUploadProgress(progress);
          onProgress?.(progress);
        });
        setPreview(null);
        setSelectedFile(null);
        onChange(imageData);
        return imageData;
      } catch (err) {
        setPreview(null);
        setSelectedFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        throw err;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadingChange?.(false);
      }
    };

    useImperativeHandle(ref, () => ({
      upload,
    }));

    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted">
            {currentUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt={label}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={disabled || isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <Upload />
              {isUploading ? `Uploading ${uploadProgress}%` : currentUrl ? "Change" : "Select"}
            </Button>
            {isUploading && (
              <div className="w-full">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
