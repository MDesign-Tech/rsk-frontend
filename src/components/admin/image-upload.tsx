"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, type CloudinaryImage } from "@/lib/cloudinary";
import { toast } from "sonner";

export interface ImageUploadHandle {
  upload: () => Promise<CloudinaryImage | null>;
  remove: () => void;
  isRemoved: () => boolean;
  getPublicId: () => string | null;
}

interface ImageUploadProps {
  // Current image data stored on the backend.
  value?: CloudinaryImage | null;
  // Called with the uploaded Cloudinary image data, or null when removed.
  onChange: (imageData: CloudinaryImage | null) => void;
  // Called when the image is marked for removal (before form submission).
  onRemoved?: (publicId: string | null) => void;
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
      onRemoved,
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
    const [imageRemoved, setImageRemoved] = useState(false);

    const currentUrl = preview ?? value?.url ?? null;
    const currentPublicId = value?.publicId ?? null;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;

      // Reset removal state when a new file is selected
      setImageRemoved(false);
      onRemoved?.(null);

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
        setImageRemoved(false);
        onRemoved?.(null);
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

    const remove = () => {
      setImageRemoved(true);
      onRemoved?.(currentPublicId);
      onChange(null);
      setPreview(null);
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    useImperativeHandle(ref, () => ({
      upload,
      remove,
      isRemoved: () => imageRemoved,
      getPublicId: () => currentPublicId,
    }));

    const isBusy = disabled || isUploading;

    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted">
            {currentUrl && !imageRemoved ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt={label}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                {imageRemoved ? "Marked for removal" : "No image"}
              </div>
            )}
            {imageRemoved && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Trash2 className="h-8 w-8 text-red-500" />
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
              disabled={isBusy}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isBusy}
              >
                <Upload />
                {isUploading ? `Uploading ${uploadProgress}%` : currentUrl && !imageRemoved ? "Change" : "Select"}
              </Button>
              {currentUrl && !imageRemoved && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={remove}
                  disabled={isBusy}
                >
                  <Trash2 />
                  Remove
                </Button>
              )}
            </div>
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
