"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  // Current image path/url stored on the backend.
  value?: string | null;
  // Called with the selected File, or null when removed.
  onChange: (file: File | null) => void;
  isUploading?: boolean;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  isUploading,
  label = "Image",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const currentUrl = preview ?? getImageUrl(value) ?? null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

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
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Spinner /> : <Upload />}
            {preview ? "Change" : "Upload"}
          </Button>
          {currentUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
