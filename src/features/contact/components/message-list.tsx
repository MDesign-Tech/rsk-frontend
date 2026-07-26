"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 min-h-0 px-3 py-3">
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender === "admin"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
