import { useState, useRef, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Download,
  Printer,
  RotateCcw,
  Palette,
  Sun,
  Moon,
  PenLine,
} from "lucide-react";
import { Link } from "wouter";
import { BcgIcon } from "@/components/icons/bcg-icon";
import { FrameworkStationIcon } from "@/components/icons/framework-station-icon";
import { Button } from "@/components/ui/button";
import { SwotQuadrant } from "@/components/swot/swot-quadrant";
import { SwotCardPool } from "@/components/swot/swot-card-pool";
import { ColorPickerPopover } from "@/components/shared/color-picker-popover";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import type { SwotCardItem } from "@/components/swot/swot-card";
import html2canvas from "html2canvas";

interface BcgQuadrantData {
  id: string;
  items: SwotCardItem[];
}

const QUADRANT_IDS = [
  "star",
  "question-mark",
  "cash-cow",
  "dog",
] as const;

const CARD_COLORS_DARK = [
  "#2d3748", "#334155", "#1e3a5f", "#2d1b69", "#1b2d1b",
  "#3b1f1f", "#1f2937", "#374151", "#4a3728", "#2e2e4a",
  "#1a3a4a", "#3d2b4a", "#2a3a2a", "#4a2a2a", "#2b3a4a",
  "#3a2a3a",
];

const CARD_COLORS_LIGHT = [
  "#dbeafe", "#e0e7ff", "#d1fae5", "#fef3c7", "#fce7f3",
  "#f3e8ff", "#e2e8f0", "#ccfbf1", "#fef9c3", "#ffe4e6",
  "#cffafe", "#fbcfe8", "#d9f99d", "#fed7aa", "#c7d2fe",
  "#bfdbfe",
];

let cardCounter = 0;
function generateCardId() {
  return `bcg-card-${Date.now()}-${cardCounter++}`;
}

export function BcgPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [quadrants, setQuadrants] = useState<BcgQuadrantData[]>(
    QUADRANT_IDS.map((id) => ({ id, items: [] }))
  );
  const [poolItems, setPoolItems] = useState<SwotCardItem[]>([]);
  const [cardColor, setCardColor] = useState("#2d3748");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Matriz BCG - Framework Station";
  }, []);

  useEffect(() => {
    setCardColor(darkMode ? "#2d3748" : "#dbeafe");
  }, [darkMode]);

  const pageBgColor = darkMode ? "#0f0f1a" : "#f5f5f5";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const inputBg = darkMode ? "bg-white/10" : "bg-black/5";
  const inputBorder = darkMode ? "border-white/20" : "border-gray-300";
  const inputText = darkMode
    ? "text-white placeholder-white/40"
    : "text-gray-900 placeholder-gray-400";
  const btnBg = darkMode
    ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
    : "bg-black/5 text-gray-800 border-gray-300 hover:bg-black/10";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // ─── Container & Item Finders ───────────────────────
  const findContainer = useCallback(
    (id: UniqueIdentifier): string | null => {
      if (id === "pool" || QUADRANT_IDS.includes(id as typeof QUADRANT_IDS[number]))
        return id as string;
      if (poolItems.some((i) => i.id === id)) return "pool";
      for (const q of quadrants) {
        if (q.items.some((i) => i.id === id)) return q.id;
      }
      return null;
    },
    [quadrants, poolItems]
  );

  const findItem = useCallback(
    (id: UniqueIdentifier): SwotCardItem | null => {
      const poolItem = poolItems.find((i) => i.id === id);
      if (poolItem) return poolItem;
      for (const q of quadrants) {
        const item = q.items.find((i) => i.id === id);
        if (item) return item;
      }
      return null;
    },
    [quadrants, poolItems]
  );

  const activeItem = activeId ? findItem(activeId) : null;

  // ─── Drag Handlers ─────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    let overContainer = findContainer(over.id);
    if (!activeContainer || !overContainer) return;

    if (QUADRANT_IDS.includes(over.id as typeof QUADRANT_IDS[number]) || over.id === "pool") {
      overContainer = over.id as string;
    }

    if (activeContainer === overContainer) return;

    const activeItemObj = findItem(active.id);
    if (!activeItemObj) return;

    // Remove from source
    if (activeContainer === "pool") {
      setPoolItems((prev) => prev.filter((i) => i.id !== active.id));
    } else {
      setQuadrants((prev) =>
        prev.map((q) =>
          q.id === activeContainer
            ? { ...q, items: q.items.filter((i) => i.id !== active.id) }
            : q
        )
      );
    }

    // Add to target
    if (overContainer === "pool") {
      setPoolItems((prev) => {
        if (prev.some((i) => i.id === activeItemObj.id)) return prev;
        const overIndex =
          over.id === "pool" ? prev.length : prev.findIndex((i) => i.id === over.id);
        const idx = overIndex === -1 ? prev.length : overIndex;
        const newItems = [...prev];
        newItems.splice(idx, 0, activeItemObj);
        return newItems;
      });
    } else {
      setQuadrants((prev) =>
        prev.map((q) => {
          if (q.id !== overContainer) return q;
          if (q.items.some((i) => i.id === activeItemObj.id)) return q;
          const overIndex = q.items.findIndex((i) => i.id === over.id);
          const idx = overIndex === -1 ? q.items.length : overIndex;
          const newItems = [...q.items];
          newItems.splice(idx, 0, activeItemObj);
          return { ...q, items: newItems };
        })
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    if (activeContainer === "pool") {
      setPoolItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    } else {
      setQuadrants((prev) =>
        prev.map((q) => {
          if (q.id !== activeContainer) return q;
          const oldIndex = q.items.findIndex((i) => i.id === active.id);
          const newIndex = q.items.findIndex((i) => i.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return q;
          return { ...q, items: arrayMove(q.items, oldIndex, newIndex) };
        })
      );
    }
  };

  // ─── Actions ────────────────────────────────────────
  const handleAddNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    setPoolItems((prev) => [...prev, { id: generateCardId(), text }]);
    setNoteInput("");
  };

  const handleEditCard = (id: string, newText: string) => {
    setPoolItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, text: newText } : i))
    );
    setQuadrants((prev) =>
      prev.map((q) => ({
        ...q,
        items: q.items.map((i) => (i.id === id ? { ...i, text: newText } : i)),
      }))
    );
  };

  const handleDeleteCard = (id: string) => {
    setPoolItems((prev) => prev.filter((i) => i.id !== id));
    setQuadrants((prev) =>
      prev.map((q) => ({ ...q, items: q.items.filter((i) => i.id !== id) }))
    );
  };

  const handleReset = () => {
    setQuadrants(QUADRANT_IDS.map((id) => ({ id, items: [] })));
    setPoolItems([]);
    setNoteInput("");
    setCardColor(darkMode ? "#2d3748" : "#dbeafe");
  };

  const handleDownload = async () => {
    if (!matrixRef.current) return;
    try {
      const canvas = await html2canvas(matrixRef.current, {
        backgroundColor: darkMode ? "#0f0f1a" : "#f5f5f5",
        useCORS: true,
        allowTaint: true,
        scale: 2,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (_doc: Document, clonedEl: HTMLElement) => {
          clonedEl.querySelectorAll<HTMLElement>("[data-testid^='draggable-item']").forEach(
            (item) => {
              item.style.transform = "none";
              item.style.transition = "none";
            }
          );
        },
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "matriz_bcg.png";
      link.href = url;
      link.click();
    } catch {
      console.error("Erro ao gerar imagem");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ─── Quadrant Config ────────────────────────────────
  const quadrantConfig = [
    {
      id: "star",
      label: "⭐ Estrela",
      sublabel: "Alta × Alto",
      watermark: "E",
      watermarkColor: "#F59E0B",
    },
    {
      id: "question-mark",
      label: "❓ Interrogações",
      sublabel: "Baixa × Alto",
      watermark: "I",
      watermarkColor: "#8B5CF6",
    },
    {
      id: "cash-cow",
      label: "🐄 Vaca Leiteira",
      sublabel: "Alta × Baixo",
      watermark: "VL",
      watermarkColor: "#22C55E",
    },
    {
      id: "dog",
      label: "🍍 Abacaxi",
      sublabel: "Baixa × Baixo",
      watermark: "A",
      watermarkColor: "#EF4444",
    },
  ];

  const currentColors = darkMode ? CARD_COLORS_DARK : CARD_COLORS_LIGHT;

  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: pageBgColor }}>
      {/* ─── Header ──────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: darkMode ? "rgba(15,15,26,0.9)" : "rgba(245,245,245,0.9)",
          borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BcgIcon className={`w-7 h-7 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
            <span className={`font-bold text-lg hidden sm:inline ${textColor}`}>
              Matriz BCG
            </span>
          </div>

          <Link
            href="/"
            className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${textColor}`}
          >
            <FrameworkStationIcon className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-500"}`} />
            <span className="font-semibold text-base hidden sm:inline">Framework Station</span>
          </Link>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className={btnBg}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {/* ─── BCG Matrix ───────────────────── */}
            <div
              ref={matrixRef}
              className="rounded-lg overflow-hidden print-area border"
              style={{
                borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex">
                {/* Vertical "Crescimento do Mercado" label */}
                <div
                  className="flex items-center justify-center border-r"
                  style={{
                    backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                    borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                    width: "28px",
                    minWidth: "28px",
                  }}
                >
                  <span
                    className="font-bold text-xs tracking-wider"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      color: darkMode ? "#94a3b8" : "#475569",
                    }}
                  >
                    Crescimento do Mercado
                  </span>
                </div>

                {/* Main matrix area */}
                <div className="flex-1">
                  {/* Top Headers: Participação Relativa de Mercado > Alta | Baixa */}
                  <div className="grid grid-cols-[auto_1fr_1fr]">
                    <div
                      className="w-10 md:w-12 border-b"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    />
                    <div
                      className="col-span-2 text-center py-1.5 font-bold text-sm border-b"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        color: darkMode ? "#94a3b8" : "#475569",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    >
                      Participação Relativa de Mercado
                    </div>
                  </div>

                  {/* Sub-headers: Alta | Baixa */}
                  <div className="grid grid-cols-[auto_1fr_1fr]">
                    <div
                      className="w-10 md:w-12 border-b"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    />
                    <div
                      className="text-center py-1.5 font-semibold text-xs border-b border-r"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        color: darkMode ? "#94a3b8" : "#475569",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    >
                      Alta
                    </div>
                    <div
                      className="text-center py-1.5 font-semibold text-xs border-b"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        color: darkMode ? "#94a3b8" : "#475569",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    >
                      Baixa
                    </div>
                  </div>

                  {/* Top Row: Alto Crescimento */}
                  <div className="grid grid-cols-[auto_1fr_1fr]">
                    <div
                      className="w-10 md:w-12 flex items-center justify-center border-r border-b"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    >
                      <span
                        className="font-bold text-xs tracking-wider"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          color: darkMode ? "#64748b" : "#64748b",
                        }}
                      >
                        Alto
                      </span>
                    </div>
                    <SwotQuadrant
                      id="star"
                      label={quadrantConfig[0].label}
                      sublabel={quadrantConfig[0].sublabel}
                      watermark={quadrantConfig[0].watermark}
                      watermarkColor={quadrantConfig[0].watermarkColor}
                      items={quadrants.find((q) => q.id === "star")?.items || []}
                      cardColor={cardColor}
                      darkMode={darkMode}
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
                    />
                    <SwotQuadrant
                      id="question-mark"
                      label={quadrantConfig[1].label}
                      sublabel={quadrantConfig[1].sublabel}
                      watermark={quadrantConfig[1].watermark}
                      watermarkColor={quadrantConfig[1].watermarkColor}
                      items={quadrants.find((q) => q.id === "question-mark")?.items || []}
                      cardColor={cardColor}
                      darkMode={darkMode}
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
                    />
                  </div>

                  {/* Bottom Row: Baixo Crescimento */}
                  <div className="grid grid-cols-[auto_1fr_1fr]">
                    <div
                      className="w-10 md:w-12 flex items-center justify-center border-r"
                      style={{
                        backgroundColor: darkMode ? "#0a0a14" : "#e5e5e5",
                        borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      }}
                    >
                      <span
                        className="font-bold text-xs tracking-wider"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          color: darkMode ? "#64748b" : "#64748b",
                        }}
                      >
                        Baixo
                      </span>
                    </div>
                    <SwotQuadrant
                      id="cash-cow"
                      label={quadrantConfig[2].label}
                      sublabel={quadrantConfig[2].sublabel}
                      watermark={quadrantConfig[2].watermark}
                      watermarkColor={quadrantConfig[2].watermarkColor}
                      items={quadrants.find((q) => q.id === "cash-cow")?.items || []}
                      cardColor={cardColor}
                      darkMode={darkMode}
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
                    />
                    <SwotQuadrant
                      id="dog"
                      label={quadrantConfig[3].label}
                      sublabel={quadrantConfig[3].sublabel}
                      watermark={quadrantConfig[3].watermark}
                      watermarkColor={quadrantConfig[3].watermarkColor}
                      items={quadrants.find((q) => q.id === "dog")?.items || []}
                      cardColor={cardColor}
                      darkMode={darkMode}
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Input Area ────────────────────── */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNote();
                  }}
                  placeholder="Escreva o texto aqui e clique em adicionar"
                  className={`flex-1 ${inputBg} ${inputText} border ${inputBorder} rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 transition-all`}
                />
                <Button
                  onClick={handleAddNote}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 h-auto"
                >
                  <PenLine className="w-4 h-4 mr-2" />
                  Adicionar Nota
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handlePrint} className={btnBg}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" onClick={handleReset} className={btnBg}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Resetar
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={btnBg}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Cor da Nota
                  </Button>
                  {showColorPicker && (
                    <ColorPickerPopover
                      colors={currentColors}
                      selectedColor={cardColor}
                      onSelect={(c) => {
                        setCardColor(c);
                        setShowColorPicker(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ─── Card Pool ─────────────────────── */}
            <SwotCardPool
              items={poolItems}
              cardColor={cardColor}
              darkMode={darkMode}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />

            {/* ─── Drag Overlay ──────────────────── */}
            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <div
                  className="rounded-md p-3 shadow-xl max-w-xs"
                  style={{
                    backgroundColor: cardColor,
                    opacity: 0.9,
                    color: isLightColor(cardColor) ? "#1a1a1a" : "#ffffff",
                  }}
                >
                  <p className="text-sm">{activeItem.text}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* ─── SEO Content Section ─────────────── */}
        <div
          style={{
            backgroundColor: darkMode ? "#0f0f1a" : "#f5f5f5",
            color: darkMode ? "#cbd5e1" : "#334155",
          }}
        >
          <SeoContentSection title="O que é a Matriz BCG?">
            <p>
              A Matriz BCG (Boston Consulting Group Matrix), também chamada de Matriz de Crescimento-Participação,
              é uma ferramenta de análise de portfólio que classifica produtos ou unidades de negócio em
              quatro categorias baseadas em duas dimensões: taxa de crescimento do mercado e participação
              relativa de mercado.
            </p>

            <h3>Origem e História</h3>
            <p>
              A Matriz BCG foi criada em 1970 por Bruce Henderson, fundador do Boston Consulting Group.
              Henderson desenvolveu o modelo para ajudar empresas a decidir em quais unidades de negócio
              investir, manter ou desinvestir. O conceito se baseia na ideia de que a participação de mercado
              está diretamente relacionada à geração de caixa, enquanto o crescimento do mercado exige
              investimentos.
            </p>

            <h3>As Quatro Categorias</h3>
            <ul>
              <li><strong>Estrelas:</strong> Alta participação + alto crescimento. Líderes de mercado que precisam de investimento para manter posição. Potencial para se tornarem vacas leiteiras.</li>
              <li><strong>Interrogações:</strong> Baixa participação + alto crescimento. Requerem decisão: investir para crescer ou abandonar.</li>
              <li><strong>Vacas Leiteiras:</strong> Alta participação + baixo crescimento. Geram caixa excedente com pouco investimento. Financiam outras unidades.</li>
              <li><strong>Abacaxis:</strong> Baixa participação + baixo crescimento. Candidatos a desinvestimento ou reposicionamento.</li>
            </ul>

            <h3>Quando Usar</h3>
            <p>
              A Matriz BCG é ideal para análise de portfólio de produtos, alocação de recursos entre
              unidades de negócio e decisões de investimento ou desinvestimento estratégico.
            </p>

            <p className="text-xs mt-6">
              Fonte: Henderson, Bruce D. (1970). "The Product Portfolio." BCG Perspectives. Boston
              Consulting Group.
            </p>
          </SeoContentSection>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────── */}
      <footer
        className="border-t py-6 px-4"
        style={{
          borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          backgroundColor: darkMode ? "#080812" : "#e8e8e8",
        }}
      >
        <div className="max-w-7xl mx-auto text-center text-sm" style={{ color: "#64748b" }}>
          <p>
            Framework Station &mdash; Ferramentas interativas de frameworks de negócios, marketing e
            estratégia.
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()} frameworkstation.com.br</p>
        </div>
      </footer>

      {/* ─── Print Styles ────────────────────────── */}
      <style>{`
        @media print {
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          .print-area, .print-area * {
            visibility: visible !important;
          }

          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          header, footer, button, input, nav {
            display: none !important;
          }

          .print-area img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
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
