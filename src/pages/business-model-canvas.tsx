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
import { Footer } from "@/components/layout/footer";
import { BmcIcon } from "@/components/icons/bmc-icon";
import { FrameworkStationIcon } from "@/components/icons/framework-station-icon";
import { Button } from "@/components/ui/button";
import { SwotQuadrant } from "@/components/swot/swot-quadrant";
import { SwotCardPool } from "@/components/swot/swot-card-pool";
import { ColorPickerPopover } from "@/components/shared/color-picker-popover";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { SeoFrameworksSection } from "@/components/shared/seo-frameworks-section";
import type { SwotCardItem } from "@/components/swot/swot-card";
import html2canvas from "html2canvas";

const QUADRANT_IDS = [
  "key-partners",
  "key-activities",
  "key-resources",
  "value-propositions",
  "customer-relationships",
  "channels",
  "customer-segments",
  "cost-structure",
  "revenue-streams",
] as const;

interface BmcQuadrantData {
  id: string;
  items: SwotCardItem[];
}

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
  return `bmc-card-${Date.now()}-${cardCounter++}`;
}

const quadrantConfig = [
  {
    id: "key-partners",
    label: "Parceiros-Chave",
    watermark: "PC",
    watermarkColor: "#8B5CF6",
    headerColor: "#8B5CF6",
    gridArea: "1 / 1 / 3 / 3",
  },
  {
    id: "key-activities",
    label: "Atividades-Chave",
    watermark: "AC",
    watermarkColor: "#EF4444",
    headerColor: "#EF4444",
    gridArea: "1 / 3 / 2 / 5",
  },
  {
    id: "key-resources",
    label: "Recursos-Chave",
    watermark: "RC",
    watermarkColor: "#F97316",
    headerColor: "#F97316",
    gridArea: "2 / 3 / 3 / 5",
  },
  {
    id: "value-propositions",
    label: "Proposta de Valor",
    watermark: "PV",
    watermarkColor: "#22C55E",
    headerColor: "#22C55E",
    gridArea: "1 / 5 / 3 / 7",
  },
  {
    id: "customer-relationships",
    label: "Relacionamento com Clientes",
    watermark: "RL",
    watermarkColor: "#F59E0B",
    headerColor: "#F59E0B",
    gridArea: "1 / 7 / 2 / 9",
  },
  {
    id: "channels",
    label: "Canais",
    watermark: "CN",
    watermarkColor: "#A47B00",
    headerColor: "#A47B00",
    gridArea: "2 / 7 / 3 / 9",
  },
  {
    id: "customer-segments",
    label: "Segmentos de Clientes",
    watermark: "SC",
    watermarkColor: "#EC4899",
    headerColor: "#EC4899",
    gridArea: "1 / 9 / 3 / 11",
  },
  {
    id: "cost-structure",
    label: "Estrutura de Custos",
    watermark: "EC",
    watermarkColor: "#3B82F6",
    headerColor: "#3B82F6",
    gridArea: "3 / 1 / 4 / 6",
  },
  {
    id: "revenue-streams",
    label: "Fontes de Receita",
    watermark: "FR",
    watermarkColor: "#EF4444",
    headerColor: "#EF4444",
    gridArea: "3 / 6 / 4 / 11",
  },
];

export function BusinessModelCanvasPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [title, setTitle] = useState("My Business Model Canvas");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [quadrants, setQuadrants] = useState<BmcQuadrantData[]>(
    QUADRANT_IDS.map((id) => ({ id, items: [] }))
  );
  const [poolItems, setPoolItems] = useState<SwotCardItem[]>([]);
  const [cardColor, setCardColor] = useState("#2d3748");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const matrixRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Template Gratuito: Business Model Canvas - Framework Station";
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
    setTitle("My Business Model Canvas");
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
      link.download = "business_model_canvas.png";
      link.href = url;
      link.click();
    } catch {
      console.error("Erro ao gerar imagem");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
      titleInputRef.current?.blur();
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BmcIcon className="w-6 h-6" style={{ color: "#84FC06" }} />
            <span className={`font-bold text-lg hidden sm:inline ${textColor}`}>
              Business Model Canvas
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {/* ─── BMC Canvas ───────────────────── */}
            <div
              ref={matrixRef}
              className="rounded-lg overflow-hidden print-area"
              style={{ padding: "16px" }}
            >
              {/* Editable Title */}
              <div className="flex items-center justify-center mb-4 gap-2">
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={handleTitleKeyDown}
                    autoFocus
                    className={`text-xl sm:text-2xl font-bold text-center bg-transparent outline-none border-b-2 border-violet-500 ${textColor}`}
                    style={{ maxWidth: "600px" }}
                  />
                ) : (
                  <h2
                    className={`text-xl sm:text-2xl font-bold text-center cursor-pointer hover:opacity-80 ${textColor}`}
                    onClick={() => setIsEditingTitle(true)}
                    title="Clique para editar o título"
                  >
                    {title}
                    <PenLine className="inline-block w-4 h-4 ml-2 opacity-40" />
                  </h2>
                )}
              </div>

              {/* Responsive Grid layout */}
              <div
                className="grid gap-1.5"
                style={{
                  gridTemplateColumns: "repeat(10, 1fr)",
                  gridTemplateRows: "minmax(180px, auto) minmax(180px, auto) minmax(140px, auto)",
                }}
              >
                {quadrantConfig.map((config) => (
                  <div key={config.id} style={{ gridArea: config.gridArea, display: "flex", flexDirection: "column" }}>
                    <SwotQuadrant
                      id={config.id}
                      label={config.label}
                      watermark={config.watermark}
                      watermarkColor={config.watermarkColor}
                      headerColor={config.headerColor}
                      items={quadrants.find((q) => q.id === config.id)?.items || []}
                      cardColor={cardColor}
                      darkMode={darkMode}
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
                      minHeight="0"
                    />
                  </div>
                ))}
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
          <SeoContentSection title="O que é o Business Model Canvas?">
            <p>
              O Business Model Canvas (BMC) é uma ferramenta de gestão estratégica que permite
              desenvolver e esboçar modelos de negócios novos ou existentes. Ele organiza os
              elementos essenciais de um negócio em nove blocos interconectados em uma única
              página visual.
            </p>

            <h3>Origem e História</h3>
            <p>
              O Business Model Canvas foi criado por Alexander Osterwalder, teórico de negócios suíço,
              como parte de sua tese de doutorado na Université de Lausanne. O modelo foi popularizado
              no livro "Business Model Generation" (2010), co-escrito com Yves Pigneur e co-criado com
              uma comunidade de 470 praticantes de 45 países. O livro se tornou referência mundial em
              inovação de modelos de negócios.
            </p>

            <h3>Os Nove Blocos</h3>
            <ul>
              <li><strong>Segmentos de Clientes:</strong> Os diferentes grupos de pessoas ou organizações que a empresa pretende servir.</li>
              <li><strong>Proposta de Valor:</strong> O pacote de produtos e serviços que cria valor para um segmento específico.</li>
              <li><strong>Canais:</strong> Como a empresa se comunica e entrega sua proposta de valor.</li>
              <li><strong>Relacionamento com Clientes:</strong> Os tipos de relação estabelecidos com cada segmento.</li>
              <li><strong>Fontes de Receita:</strong> O dinheiro que a empresa gera de cada segmento.</li>
              <li><strong>Recursos-Chave:</strong> Os ativos mais importantes para o funcionamento do modelo.</li>
              <li><strong>Atividades-Chave:</strong> As ações mais importantes para operar com sucesso.</li>
              <li><strong>Parceiros-Chave:</strong> A rede de fornecedores e parceiros essenciais.</li>
              <li><strong>Estrutura de Custos:</strong> Todos os custos envolvidos na operação do modelo.</li>
            </ul>

            <h3>Quando Usar</h3>
            <p>
              O BMC é ideal para startups validando ideias, empresas repensando seus modelos, equipes
              alinhando visão estratégica, e empreendedores comunicando suas ideias de forma visual
              e objetiva.
            </p>

            <p className="text-xs mt-6">
              Fonte: Osterwalder, Alexander & Pigneur, Yves (2010). Business Model Generation: A
              Handbook for Visionaries, Game Changers, and Challengers. John Wiley & Sons.
            </p>
          </SeoContentSection>
          <SeoFrameworksSection currentSlug="business-model-canvas-framework-template" />
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
