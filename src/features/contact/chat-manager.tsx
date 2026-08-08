"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
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

  /* ============================================================
     LOAD CONVERSATIONS
  ============================================================ */

  const loadConversations = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await contactService.getConversations();

      setConversations(res.data.conversations || []);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to load conversations"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ============================================================
     LOAD MESSAGES
  ============================================================ */

  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        const res =
          await contactService.getConversation(conversationId);

        const loadedMessages =
          res.data.conversation.messages || [];

        setMessages(loadedMessages);

        // Mark conversation as read
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  unreadCount: 0,
                }
              : conversation
          )
        );
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to load messages"
        );
      }
    },
    []
  );

  /* ============================================================
     SELECT CONVERSATION
  ============================================================ */

  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      setSelectedConversation(conversation);

      setMessages([]);
      setMessageText("");

      await loadMessages(conversation._id);
    },
    [loadMessages]
  );

  /* ============================================================
     BACK TO LIST - MOBILE
  ============================================================ */

  const handleBackToList = useCallback(() => {
    setSelectedConversation(null);
    setMessages([]);
    setMessageText("");
  }, []);

  /* ============================================================
     SEND MESSAGE
  ============================================================ */

  const sendMessage = useCallback(async () => {
    if (
      !selectedConversation ||
      !messageText.trim() ||
      isSending
    ) {
      return;
    }

    setIsSending(true);

    try {
      const sanitizedHtml = DOMPurify.sanitize(
        messageText,
        {
          ALLOWED_TAGS: [
            "b",
            "i",
            "u",
            "strong",
            "em",
            "br",
            "p",
            "span",
          ],
          ALLOWED_ATTR: [],
        }
      );

      await contactService.sendMessage(
        selectedConversation._id,
        sanitizedHtml
      );

      // Clear editor
      setMessageText("");

      // Reload messages
      await loadMessages(
        selectedConversation._id
      );

      // Reload sidebar
      await loadConversations();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send message"
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

  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ============================================================
     AUTO SCROLL
  ============================================================ */

  useEffect(() => {
    if (!messages.length) return;

    const timer = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [messages]);

  /* ============================================================
     FILTER CONVERSATIONS
  ============================================================ */

  const filteredConversations = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter(
      (conversation) => {
        const name =
          conversation.clientName
            ?.toLowerCase() || "";

        const email =
          conversation.clientEmail
            ?.toLowerCase() || "";

        return (
          name.includes(query) ||
          email.includes(query)
        );
      }
    );
  }, [conversations, searchQuery]);

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        overflow-hidden
        bg-background
      "
    >
      {/* ========================================================
          SIDEBAR
      ========================================================= */}

      <div
        className={cn(
          `
          h-full
          min-h-0
          w-full
          shrink-0
          flex-col
          overflow-hidden
          border-r
          border-border
          bg-muted/20
          `,
          `
          md:flex
          md:w-[320px]
          lg:w-[360px]
          `,
          selectedConversation
            ? "hidden md:flex"
            : "flex"
        )}
      >
        <ConversationSidebar
          conversations={filteredConversations}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedConversationId={
            selectedConversation?._id ?? null
          }
          onSelectConversation={
            selectConversation
          }
          isLoading={isLoading}
        />
      </div>

      {/* ========================================================
          CHAT AREA
      ========================================================= */}

      <div
        className={cn(
          `
          h-full
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-background
          `,
          selectedConversation
            ? "flex"
            : "hidden md:flex"
        )}
      >
        {selectedConversation ? (
          <>
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="shrink-0">
              <ChatHeader
                conversation={
                  selectedConversation
                }
                onBack={handleBackToList}
              />
            </div>

            {/* ==================================================
                MESSAGES

                THIS MUST BE min-h-0
            ================================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-hidden
              "
            >
              <MessageList
                messages={messages}
                messagesEndRef={
                  messagesEndRef
                }
              />
            </div>

            {/* ==================================================
                COMPOSER

                NEVER ALLOW IT TO SHRINK AWAY
            ================================================== */}

            <div
              className="
                shrink-0
                border-t
                border-border
                bg-background
                p-2
                sm:p-3
              "
            >
              <div
                className="
                  flex
                  w-full
                  min-w-0
                  items-end
                  gap-2
                "
              >
                {/* EDITOR */}

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <SimpleRichTextEditor
                    value={messageText}
                    onChange={
                      setMessageText
                    }
                    placeholder="Type your message..."
                    disabled={isSending}
                    minHeight="44px"
                  />
                </div>

                {/* SEND */}

                <Button
                  type="button"
                  onClick={sendMessage}
                  disabled={
                    !messageText.trim() ||
                    isSending
                  }
                  size="icon"
                  className="
                    h-11
                    w-11
                    shrink-0
                    rounded-lg
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