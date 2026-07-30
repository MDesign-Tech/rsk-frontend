"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { CloudinaryImage } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string, editorImages: CloudinaryImage[]) => void;
  editorImages?: CloudinaryImage[];
  placeholder?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
  showToolbar?: boolean;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  editorImages = [],
  placeholder = "Start writing...",
  disabled = false,
  onUploadingChange,
  showToolbar = true,
  minHeight = "200px",
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);

  const editorImagesMap = useMemo(() => {
    const map = new Map<string, CloudinaryImage>();
    editorImages.forEach((img) => map.set(img.url, img));
    return map;
  }, [editorImages]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: { HTMLAttributes: { className: "rounded-lg bg-muted p-4 font-mono text-sm" } },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph", "bulletList", "orderedList", "listItem"] }),
      Underline,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      const images: CloudinaryImage[] = [];
      ed.state.doc.descendants((node: any) => {
        if (node.type.name === "image") {
          const src = node.attrs.src as string;
          if (src && editorImagesMap.has(src)) {
            images.push(editorImagesMap.get(src)!);
          }
        }
      });
      onChange(html, images);
      setCharCount(ed.getText().length);
    },
    editorProps: {
      handleDrop: (view: any, event: DragEvent, slice: any, moved: boolean) => {
        const files = Array.from(event.dataTransfer?.files || []).filter((f: File) =>
          f.type.startsWith("image/")
        );
        if (files.length > 0) {
          event.preventDefault();
          files.forEach((file: File) => {
            handleImageUpload(file);
          });
          return true;
        }
        return false;
      },
      handlePaste: (view: any, event: ClipboardEvent, slice: any) => {
        const files = Array.from(event.clipboardData?.files || []).filter((f: File) =>
          f.type.startsWith("image/")
        );
        if (files.length > 0) {
          event.preventDefault();
          files.forEach((file: File) => {
            handleImageUpload(file);
          });
          return true;
        }
        return false;
      },
      attributes: {
        class:
          "tiptap-editor-content focus:outline-none min-h-[200px] px-4 py-3 rounded-lg border border-input bg-background",
      },
    },
  });

  editorRef.current = editor;

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (isUploading || !editorRef.current) return;
      setIsUploading(true);
      setUploadProgress(0);
      onUploadingChange?.(true);
      try {
        const result = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        });
        editorRef.current.chain().focus().setImage({ src: result.url }).run();
        const images: CloudinaryImage[] = [];
        editorRef.current.state.doc.descendants((node: any) => {
          if (node.type.name === "image") {
            const src = node.attrs.src as string;
            if (src && editorImagesMap.has(src)) {
              images.push(editorImagesMap.get(src)!);
            } else if (src === result.url) {
              images.push({ url: result.url, publicId: result.publicId });
            }
          }
        });
        onChange(editorRef.current.getHTML(), images);
        toast.success("Image uploaded");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to upload image");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadingChange?.(false);
      }
    },
    [isUploading, onChange, onUploadingChange, editorImagesMap]
  );

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

  const addLink = useCallback(() => {
    if (!linkUrl.trim() || !editor) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setIsLinkDialogOpen(false);
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkDialogOpen(false);
  }, [editor]);

  const isDark = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  if (!editor) return null;

  return (
    <div className={`rounded-xl border ${isDark ? "border-border/60 bg-card" : "border-border bg-background"} overflow-hidden`}>
      {showToolbar && (
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
          <div className="w-px h-6 bg-border/60 mx-1" />
          <AlignButton editor={editor} disabled={disabled} />
          <ToolbarButton
            icon={<LinkIcon />}
            label="Add Link"
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href || "";
              setLinkUrl(previousUrl);
              setIsLinkDialogOpen(true);
            }}
            disabled={disabled}
            active={editor.isActive("link")}
          />
          <ToolbarButton
             icon={<ImageIcon />}
             label="Insert Image"
             onClick={() => {
               const input = document.createElement("input");
               input.type = "file";
               input.accept = "image/*";
               input.onchange = async (e) => {
                 const file = (e.target as HTMLInputElement).files?.[0];
                 if (file) await handleImageUpload(file);
               };
               input.click();
             }}
             disabled={disabled || isUploading}
           />
           <ToolbarButton
             icon={<TrashIcon />}
             label="Delete Image"
             onClick={() => {
               if (!editor || !editor.isActive("image")) return;
               editor.chain().focus().deleteSelection().run();
             }}
             disabled={disabled || !editor?.isActive("image")}
           />
          {isUploading && (
            <span className="text-xs text-muted-foreground ml-2">Uploading... {uploadProgress}%</span>
          )}
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Footer */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
          <span>{charCount} characters</span>
          <span>TipTap Editor</span>
        </div>
      )}

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
          />
          <DialogFooter className="gap-2">
            {editor.isActive("link") && (
              <Button variant="destructive" onClick={removeLink}>
                Remove Link
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

// Alignment Button Component
function AlignButton({
  editor,
  disabled,
}: {
  editor: ReturnType<typeof useEditor>;
  disabled: boolean;
}) {
  const aligns = [
    { icon: <AlignLeftIcon />, label: "Align Left", action: () => editor.chain().focus().setTextAlign("left").run() },
    { icon: <AlignCenterIcon />, label: "Align Center", action: () => editor.chain().focus().setTextAlign("center").run() },
    { icon: <AlignRightIcon />, label: "Align Right", action: () => editor.chain().focus().setTextAlign("right").run() },
    { icon: <AlignJustifyIcon />, label: "Align Justify", action: () => editor.chain().focus().setTextAlign("justify").run() },
  ];

  return (
    <>
      {aligns.map((align) => (
        <ToolbarButton
          key={align.label}
          icon={align.icon}
          label={align.label}
          onClick={align.action}
          disabled={disabled}
          active={editor.isActive({ textAlign: align.label.toLowerCase().replace("align ", "") })}
        />
      ))}
    </>
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
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
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

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function AlignLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="10" x2="6" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="18" y1="18" x2="6" y2="18" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="10" x2="7" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="7" y2="18" />
    </svg>
  );
}

function AlignJustifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="3" y2="18" />
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

  function TrashIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    );
  }
