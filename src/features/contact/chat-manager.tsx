"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { contactService } from "@/services/contact.service";
import type { Conversation, ChatMessage } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./components/chat-header";
import { ConversationSidebar } from "./components/conversation-sidebar";
import { MessageList } from "./components/message-list";
import { MessageInput } from "./components/message-input";
import { EmptyState } from "./components/empty-state";
import { LoadingState } from "./components/loading-state";
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
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getConversations();
      const convs = res.data.conversations;
      setConversations(convs);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await contactService.getConversation(conversationId);
      setMessages(res.data.conversation.messages || []);

      // Update conversation in list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load messages"
      );
    }
  }, []);

  // Select a conversation
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      setSelectedConversation(conversation);
      await loadMessages(conversation._id);
    },
    [loadMessages]
  );

  // Back to conversation list (mobile)
  const handleBackToList = useCallback(() => {
    setSelectedConversation(null);
    setMessages([]);
  }, []);

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!selectedConversation || !messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      // Send rich text content directly, sanitized for safety
      const sanitizedHtml = DOMPurify.sanitize(messageText, {
        ALLOWED_TAGS: ["b", "i", "u", "strong", "em", "br", "p", "span"],
        ALLOWED_ATTR: [],
      });
      await contactService.sendMessage(
        selectedConversation._id,
        sanitizedHtml
      );

      // Reload messages after sending
      await loadMessages(selectedConversation._id);

      // Reload conversations to update last message
      await loadConversations();

      setMessageText("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message"
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
    DOMPurify,
  ]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Memoized filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conv) =>
        conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden md:h-[calc(100vh-10rem)]">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "flex w-full flex-col border-r border-border bg-muted/20 md:flex md:w-[340px] lg:w-[360px]",
            isMobile && selectedConversation ? "hidden" : "flex"
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background min-w-0 min-h-0">
          {selectedConversation ? (
            <>
              <ChatHeader
                conversation={selectedConversation}
                onBack={isMobile ? handleBackToList : undefined}
              />

              <MessageList
                messages={messages}
                messagesEndRef={messagesEndRef}
              />

              <MessageInput
                value={messageText}
                onChange={setMessageText}
                onSend={sendMessage}
                isSending={isSending}
              />
            </>
          ) : (
            <EmptyState
              title="Select a conversation"
              description="Choose a conversation from the list to view messages"
            />
          )}
        </div>
      </div>
    </div>
  );
}
