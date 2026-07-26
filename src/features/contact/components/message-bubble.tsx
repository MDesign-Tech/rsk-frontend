"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] sm:max-w-[80%] lg:max-w-[65%] rounded-lg px-3 py-2",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.message}
        </p>
        <p
          className={cn(
            "text-xs mt-1",
            isOwn
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
