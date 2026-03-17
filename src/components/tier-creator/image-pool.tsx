import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { DraggableItem } from "@/components/tier-creator/draggable-item";
import { X, GripVertical } from "lucide-react";
import type { TierItem } from "@/components/tier-creator/tier-list-tool";

interface ImagePoolProps {
  items: TierItem[];
  onDeleteItem: (id: string) => void;
}

export function ImagePool({ items, onDeleteItem }: ImagePoolProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });

  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <GripVertical className="w-4 h-4 text-white/40" />
        <p className="text-white/50 text-xs">
          Clique e arraste as imagens para o centro de uma linha acima. Quando a linha mudar de cor, solte a imagem para posiciona-la naquele tier.
        </p>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-wrap gap-1.5 p-3 rounded-md min-h-[80px] transition-colors"
        style={{
          backgroundColor: isOver ? "rgba(255,255,255,0.08)" : "rgba(30,30,30,0.7)",
        }}
        data-testid="image-pool"
      >
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <DraggableItem item={item} />
              <button
                data-testid={`button-delete-pool-item-${item.id}`}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ visibility: "visible" }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
