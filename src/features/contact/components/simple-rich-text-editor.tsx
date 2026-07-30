"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function SimpleRichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  minHeight = "150px",
}: SimpleRichTextEditorProps) {
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: { HTMLAttributes: { className: "rounded-lg bg-muted p-4 font-mono text-sm" } },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
      setCharCount(ed.getText().length);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-content focus:outline-none min-h-[200px] px-4 py-3 rounded-lg border border-input bg-background",
        style: `min-height: ${minHeight};`,
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Update character count
  useEffect(() => {
    if (editor) {
      const updateCount = () => {
        setCharCount(editor.getText().length);
      };
      updateCount();
      editor.on("update", updateCount);
      return () => {
        editor.off("update", updateCount);
      };
    }
  }, [editor]);

  const isDark = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  if (!editor) return null;

  return (
    <div className={`rounded-xl border ${isDark ? "border-border/60 bg-card" : "border-border bg-background"} overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/60 bg-muted/30">
        <ToolbarButton
          icon={<UndoIcon />}
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || disabled}
        />
        <ToolbarButton
          icon={<RedoIcon />}
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
        />
        <div className="w-px h-6 bg-border/60 mx-1" />
        <ToolbarButton
          icon={<BoldIcon />}
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          active={editor.isActive("bold")}
        />
        <ToolbarButton
          icon={<ItalicIcon />}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          active={editor.isActive("italic")}
        />
        <ToolbarButton
          icon={<UnderlineIcon />}
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          active={editor.isActive("underline")}
        />
        <div className="w-px h-6 bg-border/60 mx-1" />
        <HeadingSelect editor={editor} disabled={disabled} />
        <ToolbarButton
          icon={<ParagraphIcon />}
          label="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={disabled}
          active={editor.isActive("paragraph")}
        />
        <div className="w-px h-6 bg-border/60 mx-1" />
        <ToolbarButton
          icon={<BulletListIcon />}
          label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          active={editor.isActive("bulletList")}
        />
        <ToolbarButton
          icon={<OrderedListIcon />}
          label="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          active={editor.isActive("orderedList")}
        />
        <ToolbarButton
          icon={<BlockQuoteIcon />}
          label="Block Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          active={editor.isActive("blockquote")}
        />
        <ToolbarButton
          icon={<CodeBlockIcon />}
          label="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
          active={editor.isActive("codeBlock")}
        />
        <ToolbarButton
          icon={<HorizontalRuleIcon />}
          label="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={disabled}
        />
      </div>

      <EditorContent editor={editor} />

      <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
        <span>{charCount} characters</span>
        <span>Rich Text Editor</span>
      </div>
    </div>
  );
}

// Toolbar Button Component
function ToolbarButton({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={`h-8 w-8 ${active ? "bg-primary/10 text-primary" : ""}`}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

// Heading Select Component
function HeadingSelect({
  editor,
  disabled,
}: {
  editor: ReturnType<typeof useEditor>;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const headings = [
    { label: "Paragraph", level: 0 },
    { label: "Heading 1", level: 1 },
    { label: "Heading 2", level: 2 },
    { label: "Heading 3", level: 3 },
    { label: "Heading 4", level: 4 },
    { label: "Heading 5", level: 5 },
    { label: "Heading 6", level: 6 },
  ];

  const currentLevel = editor.isActive("heading")
    ? (editor.getAttributes("heading").level as number)
    : 0;
  const currentLabel =
    headings.find((h) => h.level === currentLevel)?.label || "Paragraph";

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-auto px-2 text-xs font-medium"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            aria-label="Heading"
          >
            {currentLabel}
            <ChevronDownIcon className="ml-1 h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Heading</TooltipContent>
      </Tooltip>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-40 rounded-lg border border-border/60 bg-background shadow-lg">
          {headings.map((heading) => (
            <button
              key={heading.level}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                currentLevel === heading.level ? "bg-primary/10 text-primary" : ""
              }`}
              onClick={() => {
                if (heading.level === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: heading.level as 1 | 2 | 3 | 4 | 5 | 6 })
                    .run();
                }
                setIsOpen(false);
              }}
            >
              {heading.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Icons
function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9.9 9.9 0 0 0-9.3-15.3A9.9 9.9 0 0 0 3 11.3V7" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9.9 9.9 0 0 1 9.3-15.3A9.9 9.9 0 0 1 21 11.3V7" />
    </svg>
  );
}

function BoldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

function ParagraphIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4v16" />
      <path d="M17 4v16" />
      <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <path d="M3 6h1v4" />
      <path d="M3 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function BlockQuoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 1 1 2v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="m10 10-2 2 2 2" />
      <path d="m14 14 2-2-2-2" />
    </svg>
  );
}

function HorizontalRuleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
