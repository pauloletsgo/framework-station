import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SwotCard, type SwotCardItem } from "./swot-card";

interface SwotQuadrantProps {
  id: string;
  label: string;
  sublabel: string;
  watermark: string;
  watermarkColor: string;
  items: SwotCardItem[];
  cardColor: string;
  darkMode: boolean;
  onEditCard: (id: string, text: string) => void;
  onDeleteCard: (id: string) => void;
}

export function SwotQuadrant({
  id,
  label,
  sublabel,
  watermark,
  watermarkColor,
  items,
  cardColor,
  darkMode,
  onEditCard,
  onDeleteCard,
}: SwotQuadrantProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const baseBg = darkMode ? "rgba(30, 30, 46, 0.6)" : "rgba(240, 240, 245, 0.6)";
  const hoverBg = darkMode ? "rgba(40, 40, 60, 0.8)" : "rgba(220, 220, 235, 0.8)";

  return (
    <div
      ref={setNodeRef}
      className="relative flex flex-col border transition-colors overflow-hidden"
      style={{
        backgroundColor: isOver ? hoverBg : baseBg,
        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        minHeight: "200px",
      }}
    >
      {/* Header */}
      <div
        className="text-center py-2 px-3 font-semibold text-sm border-b"
        style={{
          color: darkMode ? "#e2e8f0" : "#1e293b",
          borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
          backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
        }}
      >
        {label}
        <span className="block text-xs font-normal opacity-60">{sublabel}</span>
      </div>

      {/* Watermark letter */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black leading-none"
          style={{
            fontSize: "clamp(120px, 15vw, 220px)",
            color: watermarkColor,
            opacity: darkMode ? 0.07 : 0.06,
          }}
        >
          {watermark}
        </span>
      </div>

      {/* Cards area */}
      <div className="flex-1 p-2 relative" style={{ zIndex: 1 }}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <SwotCard
                key={item.id}
                item={item}
                cardColor={cardColor}
                darkMode={darkMode}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                compact
              />
            ))}
          </div>
        </SortableContext>
        {items.length === 0 && !isOver && (
          <div className="flex items-center justify-center h-full min-h-[120px]">
            <p
              className="text-xs opacity-30 text-center"
              style={{ color: darkMode ? "#fff" : "#000" }}
            >
              Arraste cards aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
