import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, Check, X } from "lucide-react";

export interface SwotCardItem {
  id: string;
  text: string;
}

interface SwotCardProps {
  item: SwotCardItem;
  cardColor: string;
  darkMode: boolean;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export function SwotCard({ item, cardColor, darkMode, onEdit, onDelete, compact }: SwotCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    touchAction: "none",
  };

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(item.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const textColor = isLightColor(cardColor) ? "#1a1a1a" : "#ffffff";

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, backgroundColor: cardColor }}
        className="rounded-md p-3 flex items-start gap-2"
      >
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm"
          style={{ color: textColor }}
          rows={2}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
            if (e.key === "Escape") handleCancel();
          }}
        />
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={handleSave}
            className="w-8 h-8 flex items-center justify-center rounded bg-green-600/80 hover:bg-green-600 text-white transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded bg-red-600/80 hover:bg-red-600 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: cardColor }}
      className={`rounded-md flex items-center gap-2 cursor-grab active:cursor-grabbing select-none group ${compact ? "p-2" : "p-3"}`}
      {...attributes}
      {...listeners}
    >
      <p
        className={`flex-1 ${compact ? "text-xs" : "text-sm"} leading-relaxed`}
        style={{ color: textColor }}
      >
        {item.text}
      </p>
      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-7 h-7 flex items-center justify-center rounded bg-black/40 hover:bg-black/60 text-white transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-7 h-7 flex items-center justify-center rounded bg-black/40 hover:bg-red-600/80 text-white transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}
