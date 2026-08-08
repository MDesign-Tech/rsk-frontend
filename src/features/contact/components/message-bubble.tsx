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

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  isOwn,
}: MessageBubbleProps) {
  const sanitizedHtml =
    DOMPurify.sanitize(message.message, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "u",
        "strong",
        "em",
        "br",
        "p",
        "span",
        "ul",
        "ol",
        "li",
        "blockquote",
      ],
      ALLOWED_ATTR: [],
    });

  return (
    <div
      className={cn(
        "flex w-full min-w-0",
        isOwn
          ? "justify-end"
          : "justify-start"
      )}
    >
      <div
        className={cn(
          `
          min-w-0
          max-w-[92%]
          overflow-hidden
          rounded-2xl
          px-3
          py-2
          text-sm
          sm:max-w-[82%]
          lg:max-w-[70%]
          `,
          isOwn
            ? `
              rounded-br-md
              bg-primary
              text-primary-foreground
            `
            : `
              rounded-bl-md
              bg-muted
              text-foreground
            `
        )}
      >
        {/* MESSAGE */}

        <div
          className="
            min-w-0
            break-words
            [overflow-wrap:anywhere]
            leading-relaxed
            [&_p]:m-0
            [&_p+_p]:mt-2
            [&_ul]:my-2
            [&_ul]:ml-5
            [&_ul]:list-disc
            [&_ol]:my-2
            [&_ol]:ml-5
            [&_ol]:list-decimal
            [&_li]:break-words
            [&_blockquote]:my-2
            [&_blockquote]:border-l-2
            [&_blockquote]:pl-3
            [&_strong]:font-semibold
          "
          dangerouslySetInnerHTML={{
            __html: sanitizedHtml,
          }}
        />

        {/* TIME */}

        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isOwn
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {formatTime(
            message.createdAt
          )}
        </p>
      </div>
    </div>
  );
}