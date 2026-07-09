import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-12 text-muted-foreground",
        className
      )}
    >
      <Spinner className="size-6" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
