"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Conversation, ChatMessage } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only connect on client side
    if (typeof window === "undefined") return;

    let isMounted = true;

    const connectSocket = async () => {
      try {
        // Get socket token from backend
        const res = await fetch("/api/socket/token", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to get socket token");
          return;
        }

        const data = await res.json();
        const token = data.data?.token;

        if (!token || !isMounted) return;

        const socket = io(SOCKET_URL, {
          auth: { token },
          transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          // Join admin room for contact updates
          socket.emit("join-admin-room");
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });

        socket.on("connect_error", (err: Error) => {
          console.error("Socket connection error:", err.message);
        });
      } catch (err) {
        console.error("Error connecting to socket:", err);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const onNewMessage = useCallback(
    (callback: (data: { conversation: Conversation; message: ChatMessage }) => void) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.on("new-message", callback);
      return () => {
        socket.off("new-message", callback);
      };
    },
    []
  );

  const onUnreadCount = useCallback(
    (callback: (data: { unreadCount: number }) => void) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.on("unread-count", callback);
      return () => {
        socket.off("unread-count", callback);
      };
    },
    []
  );

  const onConversationRead = useCallback(
    (callback: (data: { conversationId: string; unreadCount: number }) => void) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.on("conversation-read", callback);
      return () => {
        socket.off("conversation-read", callback);
      };
    },
    []
  );

  const joinConversation = useCallback((conversationId: string) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("join-conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    const socket = socketRef.current;
    if (!socket) return;
    (socket as any).leave(`conversation-${conversationId}`);
  }, []);

  return {
    socket: socketRef.current,
    onNewMessage,
    onUnreadCount,
    onConversationRead,
    joinConversation,
    leaveConversation,
  };
}
