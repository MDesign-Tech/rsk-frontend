"use client";

import DOMPurify from "isomorphic-dompurify";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

function formatTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  const now = new Date();

  const diff =
    now.getTime() - date.getTime();

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  if (days === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return date.toLocaleDateString([], {
      weekday: "short",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const initials = conversation.clientName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const preview = conversation.lastMessage
    ? DOMPurify.sanitize(
        conversation.lastMessage,
        {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        }
      )
    : "No messages yet";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `
        flex
        w-full
        min-w-0
        items-start
        gap-3
        px-3
        py-3
        text-left
        transition-colors
        hover:bg-muted/50
        `,
        isSelected &&
          "bg-muted"
      )}
      aria-label={`Conversation with ${conversation.clientName}`}
      aria-pressed={isSelected}
    >
      {/* AVATAR */}

      <Avatar
        className="
          mt-0.5
          h-10
          w-10
          shrink-0
        "
      >
        <AvatarFallback>
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* CONTENT */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        {/* NAME + TIME */}

        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-2
          "
        >
          <p
            className="
              min-w-0
              truncate
              text-sm
              font-medium
            "
          >
            {conversation.clientName}
          </p>

          <span
            className="
              shrink-0
              text-[10px]
              text-muted-foreground
              sm:text-xs
            "
          >
            {formatTime(
              conversation.lastMessageAt
            )}
          </span>
        </div>

        {/* MESSAGE PREVIEW */}

        <p
          className="
            mt-1
            truncate
            text-xs
            text-muted-foreground
          "
          title={preview}
        >
          {preview}
        </p>

        {/* EMAIL */}

        <p
          className="
            mt-1
            truncate
            text-[11px]
            text-muted-foreground/80
          "
        >
          {conversation.clientEmail}
        </p>
      </div>

      {/* UNREAD */}

      {conversation.unreadCount > 0 && (
        <Badge
          variant="default"
          className="
            mt-1
            h-5
            min-w-5
            shrink-0
            justify-center
            rounded-full
            px-1.5
            text-[10px]
          "
        >
          {conversation.unreadCount}
        </Badge>
      )}
    </button>
  );
}