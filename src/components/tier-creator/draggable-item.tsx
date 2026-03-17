import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TierItem } from "@/components/tier-creator/tier-list-tool";

interface DraggableItemProps {
  item: TierItem;
}

export function DraggableItem({ item }: DraggableItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-16 h-16 cursor-grab active:cursor-grabbing select-none"
      data-testid={`draggable-item-${item.id}`}
    >
      <img
        src={item.dataUrl}
        alt=""
        className="w-full h-full object-cover rounded-sm"
        draggable={false}
      />
    </div>
  );
}
