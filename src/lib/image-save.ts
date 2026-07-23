import { toast } from "sonner";

export interface SaveResourceOptions<R, T> {
  save: () => Promise<R>;
  getEntity: (response: R) => T;
  successMessage: string;
  errorMessage?: string;
  showToast?: boolean;
}

export async function saveResource<R, T>({
  save,
  getEntity,
  successMessage,
  errorMessage = "Something went wrong. Please try again.",
  showToast = true,
}: SaveResourceOptions<R, T>): Promise<T | null> {
  try {
    const saved = await save();
    const result = getEntity(saved);
    if (showToast) {
      toast.success(successMessage);
    }
    return result;
  } catch (err) {
    if (showToast) {
      toast.error(err instanceof Error ? err.message : errorMessage);
    }
    return null;
  }
}
