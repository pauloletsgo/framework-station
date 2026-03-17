import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { DraggableItem } from "@/components/tier-creator/draggable-item";
import type { Tier } from "@/components/tier-creator/tier-list-tool";
import { useState } from "react";

interface TierRowProps {
  tier: Tier;
  rowBgColor: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenSettings: () => void;
  onLabelChange: (label: string) => void;
}

export function TierRow({
  tier,
  rowBgColor,
  onMoveUp,
  onMoveDown,
  onOpenSettings,
  onLabelChange,
}: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id });
  const [isEditing, setIsEditing] = useState(false);

  const textColor = isLightColor(tier.color) ? "#000000" : "#FFFFFF";

  return (
    <div className="flex border-b border-black/30" data-testid={`tier-row-${tier.id}`}>
      <div
        className="w-20 min-h-[70px] flex items-center justify-center shrink-0 cursor-pointer select-none"
        style={{ backgroundColor: tier.color, color: textColor }}
        onClick={() => !isEditing && setIsEditing(true)}
        data-testid={`tier-label-${tier.id}`}
      >
        {isEditing ? (
          <input
            type="text"
            value={tier.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onLabelChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") setIsEditing(false);
            }}
            className="w-full text-center bg-transparent outline-none font-bold text-sm border-b border-current"
            style={{ color: textColor }}
            autoFocus
            data-testid={`input-tier-label-${tier.id}`}
          />
        ) : (
          <span className="font-bold text-sm break-all text-center px-1 leading-tight">
            {tier.label}
          </span>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 min-h-[70px] flex flex-wrap items-start content-start gap-1 p-1.5 transition-colors"
        style={{
          backgroundColor: isOver ? lightenColor(rowBgColor, 15) : rowBgColor,
        }}
      >
        <SortableContext items={tier.items.map((i) => i.id)} strategy={rectSortingStrategy}>
          {tier.items.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>

      <div className="flex items-center gap-0.5 px-1 shrink-0" style={{ backgroundColor: darkenColor(rowBgColor, 10) }}>
        <button
          data-testid={`button-settings-${tier.id}`}
          onClick={onOpenSettings}
          className="p-1.5 text-white/70 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <button
            data-testid={`button-move-up-${tier.id}`}
            onClick={onMoveUp}
            className="p-0.5 text-white/70 hover:text-white transition-colors"
            title="Move Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            data-testid={`button-move-down-${tier.id}`}
            onClick={onMoveDown}
            className="p-0.5 text-white/70 hover:text-white transition-colors"
            title="Move Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
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
  return luminance > 0.6;
}

function lightenColor(hex: string, percent: number): string {
  const c = hex.replace("#", "");
  const r = Math.min(255, parseInt(c.substring(0, 2), 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, parseInt(c.substring(2, 4), 16) + Math.round(255 * percent / 100));
  const b = Math.min(255, parseInt(c.substring(4, 6), 16) + Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function darkenColor(hex: string, percent: number): string {
  const c = hex.replace("#", "");
  const r = Math.max(0, parseInt(c.substring(0, 2), 16) - Math.round(255 * percent / 100));
  const g = Math.max(0, parseInt(c.substring(2, 4), 16) - Math.round(255 * percent / 100));
  const b = Math.max(0, parseInt(c.substring(4, 6), 16) - Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
