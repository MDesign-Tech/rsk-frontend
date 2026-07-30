"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect } from "react";

interface ChatMessageEditorProps {
  value: string;
  onChange: (html: string) => void;
  onSend?: () => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

export function ChatMessageEditor({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  minHeight = "44px",
  maxHeight = "200px",
}: ChatMessageEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-chat-editor focus:outline-none px-3 py-2 rounded-lg border border-input bg-background",
        style: `min-height: ${minHeight}; max-height: ${maxHeight};`,
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSend?.();
          return true;
        }
        return false;
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Update disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div className="flex-1 min-w-0">
      <EditorContent editor={editor} />
    </div>
  );
}
