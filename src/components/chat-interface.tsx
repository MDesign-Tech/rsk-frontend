"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";
import type { Conversation, ChatMessage } from "@/types";
import {
  X,
  Send,
  User,
  CheckCheck,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { formatDistanceToNow, format } from "date-fns";

/**
 * Truncate a message string to a maximum length, appending an ellipsis if truncated.
 */
function truncateMessage(text: string, maxLength: number = 80): string {
  if (!text) return "No messages yet";
  const stripped = text.replace(/<[^>]*>/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength) + "...";
}

/**
 * Truncate text to a maximum number of words, appending an ellipsis if truncated.
 */
function truncateToWords(text: string, maxWords: number): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

/**
 * Generate avatar initials from a name.
 */
function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

/**
 * Generate a deterministic pastel background color from a name.
 */
function getAvatarColor(name: string): string {
  const colors = [
    "bg-red-100 text-red-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-yellow-100 text-yellow-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-cyan-100 text-cyan-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + hash * 31;
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Strip HTML tags from a message for display.
 */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Format a date string for display in the conversation list.
 */
function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Format a date string for display in the chat message.
 */
function formatMessageTime(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return format(date, "p");
  } catch {
    return "";
  }
}

interface ChatInterfaceProps {
  /** Optional initial conversations to display. If not provided, will fetch from API. */
  initialConversations?: Conversation[];
}

export function ChatInterface({ initialConversations }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations ?? [],
  );
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await contactService.getConversations();
      setConversations(res.data.conversations ?? []);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to load conversations.",
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await contactService.getConversation(conversationId);
      setMessages(res.data.conversation?.messages ?? []);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to load messages.",
      );
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Fetch conversations on mount if not provided
  useEffect(() => {
    if (!initialConversations) {
      fetchConversations();
    }
  }, [initialConversations, fetchConversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChat = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsModalOpen(true);
    fetchMessages(conversation._id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversation(null);
    setMessages([]);
    setNewMessage("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseModal();
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      const res = await contactService.sendMessage(
        selectedConversation._id,
        newMessage.trim(),
      );
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
      // Update the conversation's last message in the list
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selectedConversation._id
            ? {
                ...conv,
                lastMessage: res.data.message.message,
                lastMessageAt: res.data.message.createdAt,
              }
            : conv,
        ),
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-display mb-3">
            Your Conversations
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            View and continue your conversations with our team. Click on any
            conversation to open the chat.
          </p>
        </motion.div>

        {/* Conversation List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
        >
          {isLoadingConversations ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Loading conversations...
              </p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                No conversations yet. Send us a message to get started!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] sm:h-[500px]">
              <div className="divide-y divide-border">
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation._id}
                    whileHover={{
                      backgroundColor: "hsl(var(--accent) / 0.05)",
                    }}
                    className="p-4 cursor-pointer transition-colors group"
                    onClick={() => handleOpenChat(conversation)}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Avatar */}
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                        <AvatarFallback
                          className={`${getAvatarColor(conversation.clientName)} font-semibold text-sm sm:text-base`}
                        >
                          {getInitials(conversation.clientName)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm sm:text-base truncate">
                                {conversation.clientName}
                              </h3>
                              {conversation.isOnline && (
                                <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {conversation.clientEmail}
                            </p>
                          </div>

                          {/* Time and unread badge */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {conversation.lastMessageAt && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(conversation.lastMessageAt)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge
                                variant="default"
                                className="h-5 min-w-[20px] px-1.5 text-xs font-medium"
                              >
                                {conversation.unreadCount > 99
                                  ? "99+"
                                  : conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Last message preview (truncated to 3 words) */}
                        <div className="mt-1">
                          <p
                            className={`text-xs sm:text-sm ${
                              conversation.unreadCount > 0
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            } line-clamp-1 sm:line-clamp-2`}
                            title={stripHtml(conversation.lastMessage ?? "")}
                          >
                            {truncateToWords(
                              stripHtml(conversation.lastMessage ?? ""),
                              3,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </motion.div>
      </div>

      {/* Chat Modal - Bootstrap-style overlay dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="fixed top-[50%] left-[50%] z-50 flex max-h-[90vh] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-xl border border-border bg-background p-0 shadow-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
        >
          {/* Hidden title for accessibility */}
          <DialogTitle className="sr-only">
            {selectedConversation?.clientName ?? "Chat"} Conversation
          </DialogTitle>

          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50 shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                <AvatarFallback
                  className={`${
                    selectedConversation
                      ? getAvatarColor(selectedConversation.clientName)
                      : "bg-muted"
                  } font-semibold text-sm sm:text-base`}
                >
                  {selectedConversation
                    ? getInitials(selectedConversation.clientName)
                    : <User className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">
                  {selectedConversation?.clientName ?? "Chat"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedConversation?.clientEmail ?? ""}
                </p>
              </div>
            </div>

            {/* Close Button (X) in top-right corner */}
            <Button
              variant="ghost"
              size="icon"
              rounded="default"
              onClick={handleCloseModal}
              className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Close chat"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Modal Body - Scrollable Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoadingMessages ? (
              <div className="flex h-full items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  No messages yet.
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender === "admin";
                  return (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] rounded-lg px-3 sm:px-4 py-2 text-sm break-words overflow-wrap-anywhere ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {stripHtml(message.message)}
                        </p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            isOwn
                              ? "text-primary-foreground/70 justify-end"
                              : "text-muted-foreground/70 justify-end"
                          }`}
                        >
                          {message.read && isOwn && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                          <span>
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Modal Footer - Message Input */}
          <div className="p-3 sm:p-4 border-t border-border bg-card/50 shrink-0">
            <div className="flex items-end gap-2 sm:gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isSending || isLoadingMessages}
                className="flex-1 text-sm"
              />
              <Button
                variant="default"
                size="icon"
                rounded="default"
                onClick={handleSendMessage}
                disabled={
                  isSending ||
                  isLoadingMessages ||
                  !newMessage.trim()
                }
                className="shrink-0"
                aria-label="Send message"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
