"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Send } from "lucide-react";
import { contactService } from "@/services/contact.service";
import type { Conversation, ChatMessage } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "./components/chat-header";
import { ConversationSidebar } from "./components/conversation-sidebar";
import { MessageList } from "./components/message-list";
import { SimpleRichTextEditor } from "./components/simple-rich-text-editor";
import { EmptyState } from "./components/empty-state";
import DOMPurify from "isomorphic-dompurify";

export function ChatManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * Load conversations
   */
  const loadConversations = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await contactService.getConversations();

      const convs = res.data.conversations || [];

      setConversations(convs);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load messages
   */
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await contactService.getConversation(conversationId);

      const loadedMessages = res.data.conversation.messages || [];

      setMessages(loadedMessages);

      // Mark conversation as read
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load messages",
      );
    }
  }, []);

  /**
   * Select conversation
   */
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      setSelectedConversation(conversation);
      setMessageText("");
      setMessages([]);

      await loadMessages(conversation._id);
    },
    [loadMessages],
  );

  /**
   * Back to conversations on mobile
   */
  const handleBackToList = useCallback(() => {
    setSelectedConversation(null);
    setMessages([]);
    setMessageText("");
  }, []);

  /**
   * Send message
   */
  const sendMessage = useCallback(async () => {
    if (!selectedConversation || !messageText.trim() || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const sanitizedHtml = DOMPurify.sanitize(messageText, {
        ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "br", "p", "span"],
        ALLOWED_ATTR: [],
      });

      await contactService.sendMessage(selectedConversation._id, sanitizedHtml);

      // Clear editor immediately after successful send
      setMessageText("");

      // Refresh messages
      await loadMessages(selectedConversation._id);

      // Refresh conversation list
      await loadConversations();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message",
      );
    } finally {
      setIsSending(false);
    }
  }, [
    selectedConversation,
    messageText,
    isSending,
    loadMessages,
    loadConversations,
  ]);

  /**
   * Initial load
   */
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /**
   * Scroll to latest message
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  /**
   * Filter conversations
   */
  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const name = conversation.clientName?.toLowerCase() || "";

      const email = conversation.clientEmail?.toLowerCase() || "";

      return name.includes(query) || email.includes(query);
    });
  }, [conversations, searchQuery]);

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      {/* =========================================================
          CONVERSATION SIDEBAR
      ========================================================== */}
      <div
        className={cn(
          "h-full min-h-0 w-full shrink-0 flex-col",
          "border-r border-border bg-muted/20",
          "md:flex md:w-[320px]",
          "lg:w-[360px]",
          selectedConversation ? "hidden md:flex" : "flex",
        )}
      >
        <ConversationSidebar
          conversations={filteredConversations}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedConversationId={selectedConversation?._id ?? null}
          onSelectConversation={selectConversation}
          isLoading={isLoading}
        />
      </div>

      {/* =========================================================
          CHAT AREA
      ========================================================== */}
      <div
        className={cn(
          "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          "bg-background",
          selectedConversation ? "flex" : "hidden md:flex",
        )}
      >
        {selectedConversation ? (
          <>
            {/* =====================================================
                CHAT HEADER
            ====================================================== */}
            <div className="shrink-0">
              <ChatHeader
                conversation={selectedConversation}
                onBack={handleBackToList}
              />
            </div>

            {/* =====================================================
                MESSAGE AREA

                IMPORTANT:
                flex-1 + min-h-0 + overflow-hidden
                prevents messages from pushing composer away.
            ====================================================== */}
            <div className="min-h-0 flex-1 overflow-hidden">
              <MessageList
                messages={messages}
                messagesEndRef={messagesEndRef}
              />
            </div>

            {/* =====================================================
                MESSAGE COMPOSER
            ====================================================== */}
            <div
              className="
                shrink-0
                border-t border-border
                bg-background
                px-2 py-2
                sm:px-3 sm:py-3
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  w-full
                  max-w-5xl
                  items-end
                  gap-2
                "
              >
                {/* EDITOR */}

                <div
                  className="
                    min-w-0
                    flex-1
                    overflow-hidden
                    rounded-md
                  "
                >
                  <SimpleRichTextEditor
                    value={messageText}
                    onChange={setMessageText}
                    placeholder="Type your message..."
                    disabled={isSending}
                    minHeight="40px"
                    maxHeight="180px"
                  />
                </div>

                {/* SEND BUTTON */}

                <Button
                  type="button"
                  onClick={sendMessage}
                  disabled={!messageText.trim() || isSending}
                  size="icon"
                  className="
                    h-10
                    w-10
                    shrink-0
                    self-end
                    rounded-md
                    sm:h-11
                    sm:w-11
                  "
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Select a conversation"
            description="Choose a conversation from the list to view messages"
          />
        )}
      </div>
    </div>
  );
}
