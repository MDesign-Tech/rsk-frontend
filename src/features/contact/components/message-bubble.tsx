"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
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
  // Sanitize and render rich text content
  const sanitizedHtml = DOMPurify.sanitize(message.message, {
    ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "br", "p", "span"],
    ALLOWED_ATTR: [],
  });

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
        <div
          className="text-sm whitespace-pre-wrap break-words prose-sm"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
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
