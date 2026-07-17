import { toast } from "sonner";

/**
 * Options controlling a single combined save + (optional) image upload.
 *
 * This helper enforces the unified admin image-editing UX:
 *  - the form submits everything in ONE action (text fields + image)
 *  - there is no separate "Upload" step
 *  - only ONE success toast is shown on full success
 *  - only ONE error toast is shown if any part fails
 *  - the caller is responsible for disabling the Save button while this runs
 *
 * `R` is the raw service response type (e.g. `ApiResponse<{ hero: HeroContent }>`)
 * and `T` is the entity type extracted from it (e.g. `HeroContent`).
 */
export interface ImageSaveOptions<R, T> {
  /** The selected image file, or null when the user did not pick one. */
  imageFile: File | null;
  /** Persists the text/content fields. Returns the raw service response. */
  saveContent: () => Promise<R>;
  /** Uploads the image and returns the raw service response. */
  uploadImage: (file: File) => Promise<R>;
  /** Extracts the entity from a raw service response. */
  getEntity: (response: R) => T;
  /** Single success message shown after the whole operation succeeds. */
  successMessage: string;
  /** Single error message shown if any part of the operation fails. */
  errorMessage?: string;
}

/**
 * Runs the unified save flow used by every image-enabled admin form.
 *
 * Order:
 *  1. Persist content (always).
 *  2. If an image was selected, upload it using the entity returned by step 1.
 *
 * Both steps are treated as a single operation: success/error toasts are
 * emitted exactly once.
 */
export async function saveWithImage<R, T>({
  imageFile,
  saveContent,
  uploadImage,
  getEntity,
  successMessage,
  errorMessage = "Something went wrong. Please try again.",
}: ImageSaveOptions<R, T>): Promise<T | null> {
  try {
    const saved = await saveContent();
    let result = getEntity(saved);

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      result = getEntity(uploaded);
    }

    toast.success(successMessage);
    return result;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : errorMessage);
    return null;
  }
}
