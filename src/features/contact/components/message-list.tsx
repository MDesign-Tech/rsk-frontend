"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<
    HTMLDivElement | null
  >;
}

export function MessageList({
  messages,
  messagesEndRef,
}: MessageListProps) {
  return (
    <ScrollArea
      className="
        h-full
        min-h-0
        w-full
      "
    >
      <div
        className="
          flex
          w-full
          flex-col
          px-3
          py-4
          sm:px-4
          sm:py-5
        "
      >
        {messages.length === 0 ? (
          <div
            className="
              flex
              min-h-[240px]
              items-center
              justify-center
              text-center
            "
          >
            <div className="px-4">
              <p
                className="
                  text-sm
                  font-medium
                  text-muted-foreground
                "
              >
                No messages yet
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                "
              >
                Start the conversation by
                sending a message
              </p>
            </div>
          </div>
        ) : (
          <div
            className="
              w-full
              space-y-3
            "
          >
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={
                  message.sender ===
                  "admin"
                }
              />
            ))}

            <div
              ref={messagesEndRef}
              className="h-px w-full"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}