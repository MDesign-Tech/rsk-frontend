"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSending: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  isSending,
  textareaRef,
}: MessageInputProps) {
  return (
    <div className="shrink-0 border-t border-border px-3 py-2.5">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          className="resize-none min-h-[44px] max-h-[160px] overflow-y-auto text-sm"
          disabled={isSending}
          aria-label="Message input"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isSending}
          size="icon"
          className="shrink-0 self-end"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
