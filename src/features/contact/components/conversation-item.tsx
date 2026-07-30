"use client";

import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      key={conversation._id}
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
      aria-label={`Conversation with ${conversation.clientName}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {conversation.clientName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium truncate text-sm">
              {conversation.clientName}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatTime(conversation.lastMessageAt)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {conversation.lastMessage
              ? DOMPurify.sanitize(conversation.lastMessage)
              : "No messages yet"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground truncate">
              {conversation.clientEmail}
            </span>
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
