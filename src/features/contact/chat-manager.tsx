"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Send, Mail, Search } from "lucide-react";
import { contactService } from "@/services/contact.service";
import type { Conversation, ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

export function ChatManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getConversations();
      const convs = res.data.conversations;
      setConversations(convs);
      
      // Calculate total unread
      const total = convs.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setTotalUnread(total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load conversations");
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
      setTotalUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load messages");
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

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!selectedConversation || !messageText.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const res = await contactService.sendMessage(selectedConversation._id, messageText.trim());
      
      // Reload all messages after sending
      await loadMessages(selectedConversation._id);
      
      // Reload conversations to update last message
      await loadConversations();
      
      setMessageText("");
      textareaRef.current?.focus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }, [selectedConversation, messageText, isSending, loadMessages, loadConversations]);

  // Handle keyboard shortcut
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

   return (
     <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border border-border overflow-hidden md:h-[calc(100vh-10rem)]">
       {/* Mobile: Conversation list or Chat area */}
       <div className="flex flex-1 overflow-hidden md:flex-row">
         {/* Left Sidebar - Conversations List */}
         <div
           className={cn(
             "flex w-full flex-col border-r border-border bg-muted/20 md:flex md:w-80",
             selectedConversation ? "hidden md:flex" : "flex"
           )}
         >
           {/* Search */}
           <div className="p-3 border-b border-border">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
               <Input
                 placeholder="Search conversations..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9"
               />
             </div>
           </div>

           {/* Conversations List */}
           <ScrollArea className="flex-1">
             {isLoading ? (
               <div className="flex items-center justify-center p-8">
                 <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
               </div>
             ) : filteredConversations.length === 0 ? (
               <div className="p-6 text-center text-muted-foreground">
                 <Mail className="size-12 mx-auto mb-4 opacity-50" />
                 <p className="text-sm font-medium">No conversations yet</p>
                 <p className="text-xs mt-1">Messages from the contact form will appear here</p>
               </div>
             ) : (
               <div className="divide-y divide-border">
                 {filteredConversations.map((conv) => (
                   <button
                     key={conv._id}
                     onClick={() => selectConversation(conv)}
                     className={cn(
                       "w-full text-left p-3 hover:bg-muted/50 transition-colors",
                       selectedConversation?._id === conv._id && "bg-muted"
                     )}
                   >
                     <div className="flex items-start gap-3">
                       <Avatar className="size-9 shrink-0">
                         <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                           {conv.clientName
                             .split(" ")
                             .map((n) => n[0])
                             .join("")
                             .toUpperCase()
                             .slice(0, 2)}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between gap-2">
                           <span className="font-medium truncate text-sm">{conv.clientName}</span>
                           <span className="text-xs text-muted-foreground shrink-0">
                             {formatTime(conv.lastMessageAt)}
                           </span>
                         </div>
                         <p className="text-xs text-muted-foreground truncate mt-0.5">
                           {conv.lastMessage || "No messages yet"}
                         </p>
                         <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs text-muted-foreground truncate">
                             {conv.clientEmail}
                           </span>
                           {conv.unreadCount > 0 && (
                             <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                               {conv.unreadCount}
                             </Badge>
                           )}
                         </div>
                       </div>
                     </div>
                   </button>
                 ))}
               </div>
             )}
           </ScrollArea>
         </div>

         {/* Right Chat Area */}
         <div className="flex-1 flex flex-col bg-background min-w-0">
           {selectedConversation ? (
             <>
               {/* Chat Header */}
               <div className="flex items-center gap-3 p-3 border-b border-border">
                 <button
                   className="md:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground"
                   onClick={() => setSelectedConversation(null)}
                   aria-label="Back to conversations"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 </button>
                 <Avatar className="size-9">
                   <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                     {selectedConversation.clientName
                       .split(" ")
                       .map((n) => n[0])
                       .join("")
                       .toUpperCase()
                       .slice(0, 2)}
                   </AvatarFallback>
                 </Avatar>
                 <div className="flex-1 min-w-0">
                   <h3 className="font-semibold truncate text-sm">{selectedConversation.clientName}</h3>
                   <p className="text-xs text-muted-foreground truncate">
                     {selectedConversation.clientEmail}
                   </p>
                 </div>
                 <div className="flex items-center gap-2">
                   <Badge variant={selectedConversation.status === "open" ? "default" : "secondary"}>
                     {selectedConversation.status}
                   </Badge>
                 </div>
               </div>

               {/* Messages */}
               <ScrollArea className="flex-1 p-3">
                 <div className="space-y-3">
                   {messages.length === 0 ? (
                     <div className="text-center py-8 text-muted-foreground">
                       <p className="text-sm">No messages yet</p>
                       <p className="text-xs mt-1">Start the conversation by sending a message</p>
                     </div>
                   ) : (
                     messages.map((msg) => (
                       <div
                         key={msg._id}
                         className={cn(
                           "flex",
                           msg.sender === "admin" ? "justify-end" : "justify-start"
                         )}
                       >
                         <div
                           className={cn(
                             "max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-2",
                             msg.sender === "admin"
                               ? "bg-primary text-primary-foreground"
                               : "bg-muted text-foreground"
                           )}
                         >
                           <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                           <p
                             className={cn(
                               "text-xs mt-1",
                               msg.sender === "admin"
                                 ? "text-primary-foreground/70"
                                 : "text-muted-foreground"
                             )}
                           >
                             {formatTime(msg.createdAt)}
                           </p>
                         </div>
                       </div>
                     ))
                   )}
                   <div ref={messagesEndRef} />
                 </div>
               </ScrollArea>

               {/* Message Input */}
               <div className="p-3 border-t border-border">
                 <div className="flex gap-2">
                   <Textarea
                     ref={textareaRef}
                     placeholder="Type your message..."
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                     onKeyDown={handleKeyDown}
                     rows={1}
                     className="resize-none min-h-[40px] max-h-24 text-sm"
                     disabled={isSending}
                   />
                   <Button
                     onClick={sendMessage}
                     disabled={!messageText.trim() || isSending}
                     size="icon"
                     className="shrink-0"
                   >
                     <Send className="size-4" />
                   </Button>
                 </div>
                 <p className="text-xs text-muted-foreground mt-1.5">
                   Press Enter to send, Shift+Enter for new line
                 </p>
               </div>
             </>
           ) : (
             <div className="flex-1 flex items-center justify-center text-muted-foreground">
               <div className="text-center px-4">
                 <Mail className="size-14 mx-auto mb-4 opacity-30" />
                 <h3 className="text-base font-medium mb-1">Select a conversation</h3>
                 <p className="text-xs">
                   Choose a conversation from the list to view messages
                 </p>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   );
}
