"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./conversation-item";
import { LoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";
import type { Conversation } from "@/types";

interface ConversationSidebarProps {
  conversations: Conversation[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedConversationId: string | null;
  onSelectConversation: (
    conversation: Conversation
  ) => void;
  isLoading: boolean;
}

export function ConversationSidebar({
  conversations,
  searchQuery,
  onSearchChange,
  selectedConversationId,
  onSelectConversation,
  isLoading,
}: ConversationSidebarProps) {
  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
      "
    >
      {/* ======================================================
          SEARCH
      ======================================================= */}

      <div
        className="
          shrink-0
          border-b
          border-border
          bg-background
          p-3
        "
      >
        <div className="relative">
          <Search
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
            className="
              h-10
              w-full
              pl-9
            "
          />
        </div>
      </div>

      {/* ======================================================
          CONVERSATION LIST
      ======================================================= */}

      <div
        className="
          min-h-0
          flex-1
          overflow-hidden
        "
      >
        <ScrollArea className="h-full w-full">
          {isLoading ? (
            <LoadingState
              message="Loading conversations..."
            />
          ) : conversations.length === 0 ? (
            <EmptyState
              title="No conversations yet"
              description="Messages from the contact form will appear here"
            />
          ) : (
            <div className="w-full divide-y divide-border">
              {conversations.map(
                (conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={
                      conversation
                    }
                    isSelected={
                      conversation._id ===
                      selectedConversationId
                    }
                    onClick={() =>
                      onSelectConversation(
                        conversation
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}