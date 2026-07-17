import { toast } from "sonner";

export interface SaveResourceOptions<R, T> {
  save: () => Promise<R>;
  getEntity: (response: R) => T;
  successMessage: string;
  errorMessage?: string;
}

export async function saveResource<R, T>({
  save,
  getEntity,
  successMessage,
  errorMessage = "Something went wrong. Please try again.",
}: SaveResourceOptions<R, T>): Promise<T | null> {
  try {
    const saved = await save();
    const result = getEntity(saved);
    toast.success(successMessage);
    return result;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : errorMessage);
    return null;
  }
}
