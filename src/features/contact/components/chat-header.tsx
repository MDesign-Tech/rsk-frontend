"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Conversation } from "@/types";

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur-sm">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 p-1 -ml-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors md:hidden"
          aria-label="Back to conversations"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
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
        <h3 className="font-semibold truncate text-sm">
          {conversation.clientName}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {conversation.clientEmail}
        </p>
      </div>
    </div>
  );
}
