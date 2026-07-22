"use client";

import { useState, useCallback } from "react";
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { ContentBlock, BlockType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

// ---------------------------------------------------------------------------
// Block type definitions for the toolbar
// ---------------------------------------------------------------------------
const BLOCK_TYPES: { type: BlockType; label: string; description: string }[] = [
  { type: "heading", label: "Heading", description: "Section heading" },
  { type: "paragraph", label: "Paragraph", description: "Text block" },
  { type: "image", label: "Image", description: "Single image" },
  { type: "gallery", label: "Gallery", description: "Image gallery" },
  { type: "quote", label: "Quote", description: "Blockquote" },
  { type: "bulletList", label: "Bullet List", description: "Unordered list" },
  { type: "numberedList", label: "Numbered List", description: "Ordered list" },
  { type: "checklist", label: "Checklist", description: "Task checklist" },
  { type: "divider", label: "Divider", description: "Horizontal line" },
  { type: "callout", label: "Callout", description: "Info/warning box" },
  { type: "button", label: "Button", description: "Call-to-action button" },
  { type: "spacer", label: "Spacer", description: "Vertical spacing" },
];

// ---------------------------------------------------------------------------
// Helper to generate unique IDs
// ---------------------------------------------------------------------------
let blockIdCounter = 0;
const generateBlockId = () => `block_${Date.now()}_${++blockIdCounter}`;

// ---------------------------------------------------------------------------
// Default block factory
// ---------------------------------------------------------------------------
function createBlock(type: BlockType): ContentBlock {
  const base = { id: generateBlockId(), type } as ContentBlock;

  switch (type) {
    case "heading":
      return { ...base, level: 2, text: "" } as ContentBlock;
    case "paragraph":
      return { ...base, content: "" } as ContentBlock;
    case "image":
      return {
        ...base,
        src: "",
        alt: "",
        caption: "",
        alignment: "center",
        borderRadius: 8,
        width: 100,
      } as ContentBlock;
    case "gallery":
      return {
        ...base,
        images: [],
        layout: "grid",
      } as ContentBlock;
    case "quote":
      return { ...base, text: "", author: "", position: "" } as ContentBlock;
    case "bulletList":
      return { ...base, items: [""] } as ContentBlock;
    case "numberedList":
      return { ...base, items: [""] } as ContentBlock;
    case "checklist":
      return { ...base, items: [{ text: "", checked: false }] } as ContentBlock;
    case "divider":
      return base as ContentBlock;
    case "callout":
      return {
        ...base,
        variant: "info",
        message: "",
        icon: "info",
      } as ContentBlock;
    case "button":
      return {
        ...base,
        label: "",
        url: "",
        variant: "primary",
      } as ContentBlock;
    case "spacer":
      return { ...base, height: 40 } as ContentBlock;
    default:
      return base as ContentBlock;
  }
}

// ---------------------------------------------------------------------------
// Individual Block Editors
// ---------------------------------------------------------------------------
function HeadingBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "heading" }>;
  onChange: (block: ContentBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        value={String(block.level)}
        onValueChange={(v) => onChange({ ...block, level: Number(v) as 1 | 2 | 3 | 4 })}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">H1</SelectItem>
          <SelectItem value="2">H2</SelectItem>
          <SelectItem value="3">H3</SelectItem>
          <SelectItem value="4">H4</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Heading text..."
        className="text-lg font-semibold"
      />
    </div>
  );
}

function ParagraphBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "paragraph" }>;
  onChange: (block: ContentBlock) => void;
}) {
  return (
    <Textarea
      value={block.content}
      onChange={(e) => onChange({ ...block, content: e.target.value })}
      placeholder="Write your paragraph..."
      rows={4}
    />
  );
}

function ImageBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "image" }>;
  onChange: (block: ContentBlock) => void;
}) {
  const handleImageChange = (file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onChange({ ...block, src: previewUrl, _file: file });
    } else {
      onChange({ ...block, src: "", _file: undefined });
    }
  };

  return (
    <div className="space-y-3">
      <ImageUpload
        value={block.src || null}
        onChange={handleImageChange}
        label="Image"
      />
      <Input
        value={block.alt}
        onChange={(e) => onChange({ ...block, alt: e.target.value })}
        placeholder="Alt text (for accessibility)"
      />
      <Input
        value={block.caption}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder="Caption (optional)"
      />
      <div className="flex gap-4">
        <Select
          value={block.alignment}
          onValueChange={(v) =>
            onChange({ ...block, alignment: v as "left" | "center" | "right" })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={block.borderRadius}
          onChange={(e) =>
            onChange({ ...block, borderRadius: Number(e.target.value) })
          }
          placeholder="Border radius"
          className="w-24"
        />
      </div>
    </div>
  );
}

function GalleryBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "gallery" }>;
  onChange: (block: ContentBlock) => void;
}) {
  const addImage = () => {
    onChange({
      ...block,
      images: [...block.images, { src: "", caption: "" }],
    });
  };

  const updateImage = (index: number, updates: { src?: string; caption?: string }) => {
    const newImages = [...block.images];
    newImages[index] = { ...newImages[index], ...updates };
    onChange({ ...block, images: newImages });
  };

  const removeImage = (index: number) => {
    onChange({
      ...block,
      images: block.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-3">
      <Select
        value={block.layout}
        onValueChange={(v) =>
          onChange({ ...block, layout: v as "grid" | "masonry" })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="grid">Grid</SelectItem>
          <SelectItem value="masonry">Masonry</SelectItem>
        </SelectContent>
      </Select>
      {block.images.map((img, index) => (
        <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
          <div className="flex-1 space-y-2">
            <ImageUpload
              value={img.src || null}
              onChange={(file) => {
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  updateImage(index, { src: previewUrl });
                }
              }}
              label={`Image ${index + 1}`}
            />
            <Input
              value={img.caption}
              onChange={(e) => updateImage(index, { caption: e.target.value })}
              placeholder="Caption (optional)"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeImage(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addImage} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Image
      </Button>
    </div>
  );
}

function QuoteBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "quote" }>;
  onChange: (block: ContentBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <Textarea
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Quote text..."
        rows={3}
      />
      <Input
        value={block.author}
        onChange={(e) => onChange({ ...block, author: e.target.value })}
        placeholder="Author name"
      />
      <Input
        value={block.position}
        onChange={(e) => onChange({ ...block, position: e.target.value })}
        placeholder="Author position/role"
      />
    </div>
  );
}

function ListBlockEditor({
  block,
  onChange,
  isNumbered,
}: {
  block: Extract<ContentBlock, { type: "bulletList" | "numberedList" }>;
  onChange: (block: ContentBlock) => void;
  isNumbered: boolean;
}) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items];
    newItems[index] = value;
    onChange({ ...block, items: newItems });
  };

  const addItem = () => {
    onChange({ ...block, items: [...block.items, ""] });
  };

  const removeItem = (index: number) => {
    onChange({
      ...block,
      items: block.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-2">
      {block.items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <span className="text-muted-foreground w-6 text-right">
            {isNumbered ? `${index + 1}.` : "•"}
          </span>
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}

function ChecklistBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "checklist" }>;
  onChange: (block: ContentBlock) => void;
}) {
  const updateItem = (index: number, updates: { text?: string; checked?: boolean }) => {
    const newItems = [...block.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...block, items: newItems });
  };

  const addItem = () => {
    onChange({ ...block, items: [...block.items, { text: "", checked: false }] });
  };

  const removeItem = (index: number) => {
    onChange({
      ...block,
      items: block.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-2">
      {block.items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => updateItem(index, { checked: e.target.checked })}
            className="h-4 w-4"
          />
          <Input
            value={item.text}
            onChange={(e) => updateItem(index, { text: e.target.value })}
            placeholder={`Task ${index + 1}`}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}

function CalloutBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "callout" }>;
  onChange: (block: ContentBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        value={block.variant}
        onValueChange={(v) =>
          onChange({
            ...block,
            variant: v as "info" | "success" | "warning" | "danger",
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="danger">Danger</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        value={block.message}
        onChange={(e) => onChange({ ...block, message: e.target.value })}
        placeholder="Callout message..."
        rows={3}
      />
    </div>
  );
}

function ButtonBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "button" }>;
  onChange: (block: ContentBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        value={block.label}
        onChange={(e) => onChange({ ...block, label: e.target.value })}
        placeholder="Button text"
      />
      <Input
        value={block.url}
        onChange={(e) => onChange({ ...block, url: e.target.value })}
        placeholder="Button URL"
      />
      <Select
        value={block.variant}
        onValueChange={(v) =>
          onChange({ ...block, variant: v as "primary" | "secondary" | "outline" })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="primary">Primary</SelectItem>
          <SelectItem value="secondary">Secondary</SelectItem>
          <SelectItem value="outline">Outline</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SpacerBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "spacer" }>;
  onChange: (block: ContentBlock) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm text-muted-foreground">Height (px):</label>
      <Input
        type="number"
        value={block.height}
        onChange={(e) => onChange({ ...block, height: Number(e.target.value) })}
        className="w-24"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block Item Editor (single block in the list)
// ---------------------------------------------------------------------------
function BlockItemEditor({
  block,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", block.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId !== block.id) {
      // This will be handled by the parent
      onChange({ ...block, _draggedId: draggedId } as any);
    }
  };

  const blockLabels: Record<BlockType, string> = {
    heading: "Heading",
    paragraph: "Paragraph",
    image: "Image",
    gallery: "Gallery",
    quote: "Quote",
    bulletList: "Bullet List",
    numberedList: "Numbered List",
    checklist: "Checklist",
    divider: "Divider",
    table: "Table",
    callout: "Callout",
    codeBlock: "Code Block",
    video: "Video",
    fileAttachment: "File",
    button: "Button",
    faq: "FAQ",
    timeline: "Timeline",
    statistics: "Statistics",
    card: "Card",
    banner: "Banner",
    twoColumns: "Two Columns",
    threeColumns: "Three Columns",
    spacer: "Spacer",
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`group relative flex gap-3 p-4 border rounded-lg bg-card ${
        isDragging ? "opacity-50 border-primary" : "border-border"
      }`}
    >
      <div className="flex flex-col items-center gap-1 pt-1">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {blockLabels[block.type]}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {block.type === "heading" && (
          <HeadingBlockEditor
            block={block as Extract<ContentBlock, { type: "heading" }>}
            onChange={onChange}
          />
        )}
        {block.type === "paragraph" && (
          <ParagraphBlockEditor
            block={block as Extract<ContentBlock, { type: "paragraph" }>}
            onChange={onChange}
          />
        )}
        {block.type === "image" && (
          <ImageBlockEditor
            block={block as Extract<ContentBlock, { type: "image" }>}
            onChange={onChange}
          />
        )}
        {block.type === "gallery" && (
          <GalleryBlockEditor
            block={block as Extract<ContentBlock, { type: "gallery" }>}
            onChange={onChange}
          />
        )}
        {block.type === "quote" && (
          <QuoteBlockEditor
            block={block as Extract<ContentBlock, { type: "quote" }>}
            onChange={onChange}
          />
        )}
        {block.type === "bulletList" && (
          <ListBlockEditor
            block={block as Extract<ContentBlock, { type: "bulletList" }>}
            onChange={onChange}
            isNumbered={false}
          />
        )}
        {block.type === "numberedList" && (
          <ListBlockEditor
            block={block as Extract<ContentBlock, { type: "numberedList" }>}
            onChange={onChange}
            isNumbered={true}
          />
        )}
        {block.type === "checklist" && (
          <ChecklistBlockEditor
            block={block as Extract<ContentBlock, { type: "checklist" }>}
            onChange={onChange}
          />
        )}
        {block.type === "callout" && (
          <CalloutBlockEditor
            block={block as Extract<ContentBlock, { type: "callout" }>}
            onChange={onChange}
          />
        )}
        {block.type === "button" && (
          <ButtonBlockEditor
            block={block as Extract<ContentBlock, { type: "button" }>}
            onChange={onChange}
          />
        )}
        {block.type === "spacer" && (
          <SpacerBlockEditor
            block={block as Extract<ContentBlock, { type: "spacer" }>}
            onChange={onChange}
          />
        )}
        {block.type === "divider" && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            — Divider —
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Block Editor Component
// ---------------------------------------------------------------------------
interface BlockEditorProps {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  const [selectedType, setSelectedType] = useState<BlockType>("paragraph");

  const addBlock = useCallback(() => {
    const newBlock = createBlock(selectedType);
    onChange([...value, newBlock]);
  }, [selectedType, value, onChange]);

  const updateBlock = useCallback(
    (index: number, updatedBlock: ContentBlock) => {
      const newBlocks = [...value];
      newBlocks[index] = updatedBlock;
      onChange(newBlocks);
    },
    [value, onChange]
  );

  const deleteBlock = useCallback(
    (index: number) => {
      const newBlocks = value.filter((_, i) => i !== index);
      onChange(newBlocks);
    },
    [value, onChange]
  );

  const moveBlock = useCallback(
    (index: number, direction: "up" | "down") => {
      const newBlocks = [...value];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];
      onChange(newBlocks);
    },
    [value, onChange]
  );

  const handleBlockChange = useCallback(
    (index: number) => (updatedBlock: ContentBlock) => {
      updateBlock(index, updatedBlock);
    },
    [updateBlock]
  );

  return (
    <div className="space-y-4">
      {/* Add Block Toolbar */}
      <div className="flex gap-2 p-3 border rounded-lg bg-muted/30">
        <Select
          value={selectedType}
          onValueChange={(v) => setSelectedType(v as BlockType)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_TYPES.map((bt) => (
              <SelectItem key={bt.type} value={bt.type}>
                <div>
                  <div className="font-medium">{bt.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {bt.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addBlock} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {value.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-2">No content blocks yet</p>
            <p className="text-sm text-muted-foreground">
              Select a block type above and click "Add Block" to get
              started.
            </p>
          </div>
        ) : (
          value.map((block, index) => (
            <BlockItemEditor
              key={block.id}
              block={block}
              onChange={handleBlockChange(index)}
              onDelete={() => deleteBlock(index)}
              onMoveUp={() => moveBlock(index, "up")}
              onMoveDown={() => moveBlock(index, "down")}
              isFirst={index === 0}
              isLast={index === value.length - 1}
            />
          ))
        )}
      </div>

      {/* Preview */}
      {value.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/20">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Preview
          </h4>
          <div className="prose prose-sm max-w-none">
            {value.map((block) => (
              <BlockPreview key={block.id} block={block} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block Preview (simplified rendering for preview)
// ---------------------------------------------------------------------------
function BlockPreview({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const levels: Record<number, string> = {
        1: "text-2xl font-bold",
        2: "text-xl font-bold",
        3: "text-lg font-semibold",
        4: "text-base font-semibold",
      };
      return <h3 className={levels[block.level] || "text-xl font-bold"}>{block.text}</h3>;
    }
    case "paragraph":
      return <p>{block.content}</p>;
    case "image":
      return (
        <img
          src={block.src}
          alt={block.alt}
          className="rounded-lg max-w-full h-auto"
        />
      );
    case "gallery":
      return (
        <div className="grid grid-cols-3 gap-2">
          {block.images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.caption}
              className="rounded-lg h-32 w-full object-cover"
            />
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-primary pl-4 italic">
          {block.text}
          {block.author && (
            <cite className="block text-sm text-muted-foreground">
              — {block.author}
            </cite>
          )}
        </blockquote>
      );
    case "bulletList":
      return (
        <ul className="list-disc pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "numberedList":
      return (
        <ol className="list-decimal pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "checklist":
      return (
        <ul className="space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={item.checked} readOnly />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      );
    case "divider":
      return <hr />;
    case "callout":
      return (
        <div
          className={`p-4 rounded-lg ${
            block.variant === "info"
              ? "bg-blue-50 border-blue-200"
              : block.variant === "success"
              ? "bg-green-50 border-green-200"
              : block.variant === "warning"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          {block.message}
        </div>
      );
    case "button":
      return (
        <a
          href={block.url}
          className={`inline-block px-4 py-2 rounded ${
            block.variant === "primary"
              ? "bg-primary text-white"
              : block.variant === "secondary"
              ? "bg-secondary text-secondary-foreground"
              : "border border-primary text-primary"
          }`}
        >
          {block.label}
        </a>
      );
    case "spacer":
      return <div style={{ height: block.height }} />;
    default:
      return null;
  }
}
