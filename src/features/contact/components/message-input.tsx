"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  isSending,
}: MessageInputProps) {
  return (
    <div className="shrink-0 border-t border-border px-3 py-2.5">
      <div className="flex gap-2">
        <RichTextEditor
          value={value}
          onChange={(html) => onChange(html)}
          placeholder="Type your message..."
          disabled={isSending}
          showToolbar={false}
          minHeight="44px"
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
    </div>
  );
}
