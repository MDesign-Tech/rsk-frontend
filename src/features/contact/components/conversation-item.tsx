"use client";

import { Trash2 } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function truncateToWords(text: string, maxWords: number): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
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
  onDelete,
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex-1 text-left min-w-0"
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
            <p
              className="text-xs text-muted-foreground truncate mt-0.5"
              title={conversation.lastMessage ? stripHtml(conversation.lastMessage) : "No messages yet"}
            >
              {conversation.lastMessage
                ? truncateToWords(stripHtml(conversation.lastMessage), 3)
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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`Delete conversation with ${conversation.clientName}`}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
