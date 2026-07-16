import { Loader2 } from "lucide-react";

/**

*
 * Rendered while the client-side session is being resolved. It covers the
 * entire viewport with an opaque background so no protected UI can flash
 * through before authentication completes.
 */
export function AdminLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
}
