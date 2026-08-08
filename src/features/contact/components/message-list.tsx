"use client";

import { MessageBubble } from "./message-bubble";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <div
      className="
        absolute
        inset-0
        overflow-y-auto
        overflow-x-hidden
      "
    >
      <div
        className="
          flex
          min-h-0
          w-full
          flex-col
          px-3
          py-3
          sm:px-4
          sm:py-4
        "
      >
        {messages.length === 0 ? (
          <div
            className="
              flex
              flex-1
              items-center
              justify-center
              py-10
              text-center
              text-muted-foreground
            "
          >
            <div className="px-4">
              <p className="text-sm font-medium">No messages yet</p>

              <p className="mt-1 text-xs">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender === "admin"}
              />
            ))}

            {/* Scroll target */}
            <div
              ref={messagesEndRef}
              className="h-px w-full"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
