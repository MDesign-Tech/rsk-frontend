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
  onSelectConversation: (conversation: Conversation) => void;
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
    <div className="flex h-full flex-col">
      {/* Sticky Search */}
      <div className="shrink-0 border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Scrollable Conversation List */}
      <ScrollArea className="flex-1 min-h-0">
        {isLoading ? (
          <LoadingState message="Loading conversations..." />
        ) : conversations.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            description="Messages from the contact form will appear here"
          />
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv._id}
                conversation={conv}
                isSelected={conv._id === selectedConversationId}
                onClick={() => onSelectConversation(conv)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
