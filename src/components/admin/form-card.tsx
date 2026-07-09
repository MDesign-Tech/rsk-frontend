import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function FormCard({
  title,
  description,
  children,
  className,
  footer,
}: FormCardProps) {
  return (
    <Card className={cn("max-w-2xl", className)}>
      <CardContent className="space-y-6">{children}</CardContent>
      {footer && <div className="border-t px-6 py-4">{footer}</div>}
    </Card>
  );
}
