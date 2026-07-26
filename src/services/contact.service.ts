import api from "./api";
import type { ApiResponse, ContactMessage, Conversation, ChatMessage } from "@/types";

export const contactService = {
  create: (data: { name: string; email: string; message: string }) =>
    api
      .post<ApiResponse<{ message: ContactMessage; conversation: Conversation }>>("/contact", data)
      .then((res) => res.data),

  // Legacy endpoints - kept for backward compatibility
  getAll: () =>
    api.get<ApiResponse<{ messages: ContactMessage[] }>>("/contact").then((res) => res.data),

  get: (id: string) =>
    api
      .get<ApiResponse<{ message: ContactMessage }>>(`/contact/${id}`)
      .then((res) => res.data),

  remove: (id: string) =>
    api
      .delete<ApiResponse<Record<string, never>>>(`/contact/${id}`)
      .then((res) => res.data),

  // Send an admin reply to a contact message.
  reply: (id: string, reply: string) =>
    api
      .post<ApiResponse<{ message: ContactMessage }>>(`/contact/${id}/reply`, {
        reply,
      })
      .then((res) => res.data),

  // Toggle the public visibility of a contact message.
  toggleVisibility: (id: string, visible: boolean) =>
    api
      .patch<ApiResponse<{ message: ContactMessage }>>(
        `/contact/${id}/visibility`,
        { visible }
      )
      .then((res) => res.data),

  // New conversation-based endpoints
  getConversations: () =>
    api.get<ApiResponse<{ conversations: Conversation[] }>>("/contact/conversations").then((res) => res.data),

  getConversation: (id: string) =>
    api
      .get<ApiResponse<{ conversation: Conversation & { messages: ChatMessage[] } }>>(`/contact/conversations/${id}`)
      .then((res) => res.data),

  sendMessage: (conversationId: string, message: string) =>
    api
      .post<ApiResponse<{ message: ChatMessage; conversation: Conversation }>>(
        `/contact/conversations/${conversationId}/messages`,
        { message }
      )
      .then((res) => res.data),
};
