"use client";

import { useId } from "react";

export type SectionDividerVariant =
  | "wave"
  | "diagonal"
  | "dotted"
  | "gradient"
  | "curve";

export function SectionDivider({
  variant = "wave",
  className = "",
}: {
  variant?: SectionDividerVariant;
  className?: string;
}) {
  const id = useId();

  const renderShape = () => {
    switch (variant) {
      case "diagonal":
        return (
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <polygon points="0,0 1200,0 1200,60 0,80" fill="currentColor" />
          </svg>
        );
      case "dotted":
        return (
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={`dots-${id}`}
                x="0"
                y="0"
                width="26"
                height="26"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="2" fill="currentColor" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="1200" height="80" fill={`url(#dots-${id})`} />
            <path
              d="M0,40 C300,10 600,70 900,40 L1200,20 L1200,80 L0,80 Z"
              fill="currentColor"
              opacity="0.14"
            />
          </svg>
        );
      case "gradient":
        return (
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
            <div className="absolute inset-x-0 top-2/3 h-1 rounded-full bg-primary/10 blur-sm" />
            <div className="absolute inset-x-0 top-1/2 h-12 bg-gradient-to-r from-transparent via-primary/6 to-transparent" />
          </div>
        );
      case "curve":
        return (
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <path
              d="M0,40 C300,100 900,-20 1200,40 L1200,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>
        );
      case "wave":
      default:
        return (
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <path
              d="M0,20 C200,80 400,0 600,30 C800,60 1000,10 1200,40 L1200,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={
        "pointer-events-none overflow-hidden text-primary/15 dark:text-primary/20 " +
        className
      }
    >
      <div className="h-24 sm:h-28 lg:h-32">{renderShape()}</div>
    </div>
  );
}
