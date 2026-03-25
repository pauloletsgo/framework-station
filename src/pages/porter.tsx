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
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { PorterIcon } from "@/components/icons/porter-icon";
import { FrameworkStationIcon } from "@/components/icons/framework-station-icon";
import { Button } from "@/components/ui/button";
import { SwotQuadrant } from "@/components/swot/swot-quadrant";
import { SwotCardPool } from "@/components/swot/swot-card-pool";
import { ColorPickerPopover } from "@/components/shared/color-picker-popover";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { SeoFrameworksSection } from "@/components/shared/seo-frameworks-section";
import type { SwotCardItem } from "@/components/swot/swot-card";
import html2canvas from "html2canvas";

interface ForceData {
  id: string;
  items: SwotCardItem[];
}

const FORCE_IDS = [
  "newEntrants",
  "suppliers",
  "rivalry",
  "buyers",
  "substitutes",
] as const;

const FORCE_CONFIG = [
  {
    id: "newEntrants",
    label: "Ameaça de Novos Entrantes",
    sublabel: "",
    watermark: "NE",
    watermarkColor: "#60a5fa",
  },
  {
    id: "suppliers",
    label: "Poder de Barganha dos Fornecedores",
    sublabel: "",
    watermark: "F",
    watermarkColor: "#a78bfa",
  },
  {
    id: "rivalry",
    label: "Rivalidade entre Concorrentes",
    sublabel: "",
    watermark: "RC",
    watermarkColor: "#f87171",
  },
  {
    id: "buyers",
    label: "Poder de Barganha dos Compradores",
    sublabel: "",
    watermark: "C",
    watermarkColor: "#34d399",
  },
  {
    id: "substitutes",
    label: "Ameaça de Produtos Substitutos",
    sublabel: "",
    watermark: "PS",
    watermarkColor: "#fbbf24",
  },
];

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
  return `porter-card-${Date.now()}-${cardCounter++}`;
}

export function PorterPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [forces, setForces] = useState<ForceData[]>(
    FORCE_IDS.map((id) => ({ id, items: [] }))
  );
  const [poolItems, setPoolItems] = useState<SwotCardItem[]>([]);
  const [cardColor, setCardColor] = useState("#2d3748");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "5 Forças de Porter - Framework Station";
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
  const arrowColor = darkMode ? "#64748b" : "#94a3b8";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // ─── Container & Item Finders ───────────────────────
  const findContainer = useCallback(
    (id: UniqueIdentifier): string | null => {
      if (id === "pool" || FORCE_IDS.includes(id as typeof FORCE_IDS[number]))
        return id as string;
      if (poolItems.some((i) => i.id === id)) return "pool";
      for (const f of forces) {
        if (f.items.some((i) => i.id === id)) return f.id;
      }
      return null;
    },
    [forces, poolItems]
  );

  const findItem = useCallback(
    (id: UniqueIdentifier): SwotCardItem | null => {
      const poolItem = poolItems.find((i) => i.id === id);
      if (poolItem) return poolItem;
      for (const f of forces) {
        const item = f.items.find((i) => i.id === id);
        if (item) return item;
      }
      return null;
    },
    [forces, poolItems]
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

    if (FORCE_IDS.includes(over.id as typeof FORCE_IDS[number]) || over.id === "pool") {
      overContainer = over.id as string;
    }

    if (activeContainer === overContainer) return;

    const activeItemObj = findItem(active.id);
    if (!activeItemObj) return;

    // Remove from source
    if (activeContainer === "pool") {
      setPoolItems((prev) => prev.filter((i) => i.id !== active.id));
    } else {
      setForces((prev) =>
        prev.map((f) =>
          f.id === activeContainer
            ? { ...f, items: f.items.filter((i) => i.id !== active.id) }
            : f
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
      setForces((prev) =>
        prev.map((f) => {
          if (f.id !== overContainer) return f;
          if (f.items.some((i) => i.id === activeItemObj.id)) return f;
          const overIndex = f.items.findIndex((i) => i.id === over.id);
          const idx = overIndex === -1 ? f.items.length : overIndex;
          const newItems = [...f.items];
          newItems.splice(idx, 0, activeItemObj);
          return { ...f, items: newItems };
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
      setForces((prev) =>
        prev.map((f) => {
          if (f.id !== activeContainer) return f;
          const oldIndex = f.items.findIndex((i) => i.id === active.id);
          const newIndex = f.items.findIndex((i) => i.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return f;
          return { ...f, items: arrayMove(f.items, oldIndex, newIndex) };
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
    setForces((prev) =>
      prev.map((f) => ({
        ...f,
        items: f.items.map((i) => (i.id === id ? { ...i, text: newText } : i)),
      }))
    );
  };

  const handleDeleteCard = (id: string) => {
    setPoolItems((prev) => prev.filter((i) => i.id !== id));
    setForces((prev) =>
      prev.map((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }))
    );
  };

  const handleReset = () => {
    setForces(FORCE_IDS.map((id) => ({ id, items: [] })));
    setPoolItems([]);
    setNoteInput("");
    setCardColor(darkMode ? "#2d3748" : "#dbeafe");
  };

  const handleDownload = async () => {
    if (!diagramRef.current) return;
    try {
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: darkMode ? "#0f0f1a" : "#f5f5f5",
        useCORS: true,
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
      link.download = "5_forcas_porter.png";
      link.href = url;
      link.click();
    } catch {
      console.error("Erro ao gerar imagem");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentColors = darkMode ? CARD_COLORS_DARK : CARD_COLORS_LIGHT;

  const getForceItems = (id: string) =>
    forces.find((f) => f.id === id)?.items || [];

  const forceConfig = (id: string) =>
    FORCE_CONFIG.find((c) => c.id === id)!;

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
            <PorterIcon className={`w-7 h-5 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
            <span className={`font-bold text-lg hidden sm:inline ${textColor}`}>
              5 Forças de Porter
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
            {/* ─── Porter Diagram ───────────────── */}
            <div
              ref={diagramRef}
              className="print-area"
              style={{ backgroundColor: pageBgColor }}
            >
              {/* Top: Ameaça de Novos Entrantes */}
              <div className="flex justify-center mb-1">
                <div className="w-full max-w-md">
                  <SwotQuadrant
                    id="newEntrants"
                    label={forceConfig("newEntrants").label}
                    sublabel=""
                    watermark={forceConfig("newEntrants").watermark}
                    watermarkColor={forceConfig("newEntrants").watermarkColor}
                    items={getForceItems("newEntrants")}
                    cardColor={cardColor}
                    darkMode={darkMode}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                  />
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center py-1">
                <ChevronDown className="w-8 h-8" style={{ color: arrowColor }} />
              </div>

              {/* Middle Row: Fornecedores → Rivalidade ← Compradores */}
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0">
                {/* Left: Fornecedores */}
                <SwotQuadrant
                  id="suppliers"
                  label={forceConfig("suppliers").label}
                  sublabel=""
                  watermark={forceConfig("suppliers").watermark}
                  watermarkColor={forceConfig("suppliers").watermarkColor}
                  items={getForceItems("suppliers")}
                  cardColor={cardColor}
                  darkMode={darkMode}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />

                {/* Arrow right */}
                <div className="flex items-center px-1">
                  <ChevronRight className="w-8 h-8" style={{ color: arrowColor }} />
                </div>

                {/* Center: Rivalidade */}
                <SwotQuadrant
                  id="rivalry"
                  label={forceConfig("rivalry").label}
                  sublabel=""
                  watermark={forceConfig("rivalry").watermark}
                  watermarkColor={forceConfig("rivalry").watermarkColor}
                  items={getForceItems("rivalry")}
                  cardColor={cardColor}
                  darkMode={darkMode}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />

                {/* Arrow left */}
                <div className="flex items-center px-1">
                  <ChevronLeft className="w-8 h-8" style={{ color: arrowColor }} />
                </div>

                {/* Right: Compradores */}
                <SwotQuadrant
                  id="buyers"
                  label={forceConfig("buyers").label}
                  sublabel=""
                  watermark={forceConfig("buyers").watermark}
                  watermarkColor={forceConfig("buyers").watermarkColor}
                  items={getForceItems("buyers")}
                  cardColor={cardColor}
                  darkMode={darkMode}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              </div>

              {/* Arrow up */}
              <div className="flex justify-center py-1">
                <ChevronUp className="w-8 h-8" style={{ color: arrowColor }} />
              </div>

              {/* Bottom: Ameaça de Produtos Substitutos */}
              <div className="flex justify-center mt-1">
                <div className="w-full max-w-md">
                  <SwotQuadrant
                    id="substitutes"
                    label={forceConfig("substitutes").label}
                    sublabel=""
                    watermark={forceConfig("substitutes").watermark}
                    watermarkColor={forceConfig("substitutes").watermarkColor}
                    items={getForceItems("substitutes")}
                    cardColor={cardColor}
                    darkMode={darkMode}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                  />
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
          <SeoContentSection title="O que são as 5 Forças de Porter?">
            <p>
              O modelo das 5 Forças de Porter é uma ferramenta de análise competitiva que examina cinco
              forças que determinam a intensidade da competição e a atratividade de um mercado ou indústria.
              O modelo ajuda empresas a entender a estrutura do seu setor e a formular estratégias adequadas.
            </p>

            <h3>Origem e História</h3>
            <p>
              O modelo foi desenvolvido por Michael E. Porter, professor da Harvard Business School, e
              publicado pela primeira vez no artigo "How Competitive Forces Shape Strategy" na Harvard
              Business Review em 1979. Porter expandiu o conceito em seu livro "Competitive Strategy:
              Techniques for Analyzing Industries and Competitors" (1980), que se tornou um dos livros
              de negócios mais influentes do século XX.
            </p>

            <h3>As Cinco Forças</h3>
            <ul>
              <li><strong>Rivalidade entre Concorrentes:</strong> A força central. Quanto mais intensa a competição, menor a lucratividade do setor.</li>
              <li><strong>Ameaça de Novos Entrantes:</strong> Novas empresas trazem capacidade adicional e pressão sobre preços. Barreiras de entrada determinam essa ameaça.</li>
              <li><strong>Ameaça de Produtos Substitutos:</strong> Produtos de outros setores que atendem a mesma necessidade limitam os preços e a lucratividade.</li>
              <li><strong>Poder de Barganha dos Fornecedores:</strong> Fornecedores poderosos podem elevar custos ou reduzir a qualidade dos insumos.</li>
              <li><strong>Poder de Barganha dos Compradores:</strong> Clientes poderosos podem forçar preços para baixo ou exigir mais qualidade.</li>
            </ul>

            <h3>Quando Usar</h3>
            <p>
              Use as 5 Forças de Porter ao avaliar a entrada em um novo mercado, analisar a competitividade
              do seu setor atual, ou ao formular estratégias para melhorar a posição competitiva da sua empresa.
            </p>

            <p className="text-xs mt-6">
              Fonte: Porter, Michael E. (1979). "How Competitive Forces Shape Strategy." Harvard
              Business Review. | Porter, Michael E. (1980). Competitive Strategy: Techniques for
              Analyzing Industries and Competitors. Free Press.
            </p>
          </SeoContentSection>
          <SeoFrameworksSection currentSlug="5-forcas-de-porter-framework-template" />
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────── */}
      <Footer />

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
