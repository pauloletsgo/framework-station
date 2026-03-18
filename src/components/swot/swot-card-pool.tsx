import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SwotCard, type SwotCardItem } from "./swot-card";

interface SwotCardPoolProps {
  items: SwotCardItem[];
  cardColor: string;
  darkMode: boolean;
  onEditCard: (id: string, text: string) => void;
  onDeleteCard: (id: string) => void;
}

export function SwotCardPool({ items, cardColor, darkMode, onEditCard, onDeleteCard }: SwotCardPoolProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });

  return (
    <div className="mt-6">
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}
      >
        Arraste e solte os cards abaixo para o quadrante que desejar.
      </p>
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 rounded-lg p-3 min-h-[60px] transition-colors"
        style={{
          backgroundColor: isOver
            ? darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
            : darkMode ? "rgba(30,30,30,0.5)" : "rgba(0,0,0,0.03)",
        }}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SwotCard
              key={item.id}
              item={item}
              cardColor={cardColor}
              darkMode={darkMode}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <p
            className="text-center text-xs py-4 opacity-40"
            style={{ color: darkMode ? "#fff" : "#000" }}
          >
            Adicione notas usando o campo acima. Elas aparecerão aqui para serem arrastadas para os quadrantes.
          </p>
        )}
      </div>
    </div>
  );
}
