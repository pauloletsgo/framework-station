import { useState, useRef, useCallback } from "react";
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
import { Download, Printer, RotateCcw, Palette, Pencil, Link2, Sun, Moon } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { TrophyIcon } from "@/components/icons/trophy-icon";
import { FrameworkStationIcon } from "@/components/icons/framework-station-icon";
import { Button } from "@/components/ui/button";
import { TierRow } from "@/components/tier-creator/tier-row";
import { ImagePool } from "@/components/tier-creator/image-pool";
import { TierSettingsDialog } from "@/components/tier-creator/tier-settings-dialog";
import { ColorPickerPopover } from "@/components/shared/color-picker-popover";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

export interface TierItem {
  id: string;
  dataUrl: string;
}

export interface Tier {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}

const DEFAULT_TIERS: Tier[] = [
  { id: "tier-s", label: "S", color: "#FF7F7F", items: [] },
  { id: "tier-a", label: "A", color: "#FFBF7F", items: [] },
  { id: "tier-b", label: "B", color: "#FFDF7F", items: [] },
  { id: "tier-c", label: "C", color: "#FFFF7F", items: [] },
  { id: "tier-d", label: "D", color: "#BFFF7F", items: [] },
];

const TIER_COLORS = [
  "#FF7F7F", "#FFBF7F", "#FFDF7F", "#FFFF7F", "#BFFF7F",
  "#7FFF7F", "#7FFFFF", "#7FBFFF", "#7F7FFF", "#FF7FFF",
  "#BF7FBF", "#000000", "#555555", "#999999", "#CCCCCC", "#FFFFFF",
];

const ROW_BG_COLORS = [
  "#1e1e1e", "#2a2a2a", "#333333", "#3d3d3d", "#1a1a2e",
  "#16213e", "#0f3460", "#2d1b69", "#1b2d1b", "#2d1b1b",
  "#1b1b2d", "#0a0a0a", "#444444", "#555555",
  "#FFFFFF", "#E8E8E8", "#D0D0D0", "#B0B0B0",
];

let itemCounter = 0;
function generateId() {
  return `item-${Date.now()}-${itemCounter++}`;
}

export function TierListTool() {
  const [title, setTitle] = useState("My Tier List");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [poolItems, setPoolItems] = useState<TierItem[]>([]);
  const [rowBgColor, setRowBgColor] = useState("#1e293b");
  const [darkMode, setDarkMode] = useState(true);
  const [showRowBgPicker, setShowRowBgPicker] = useState(false);
  const [settingsForTier, setSettingsForTier] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const tierListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const pageBgColor = darkMode ? "#0f0f1a" : "#f5f5f5";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const textMuted = darkMode ? "text-white/70" : "text-gray-500";
  const textMutedStrong = darkMode ? "text-white/90" : "text-gray-700";
  const inputBg = darkMode ? "bg-white/10" : "bg-black/5";
  const inputBorder = darkMode ? "border-white/20" : "border-gray-300";
  const inputText = darkMode ? "text-white placeholder-white/40" : "text-gray-900 placeholder-gray-400";
  const btnBg = darkMode ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : "bg-black/5 text-gray-800 border-gray-300 hover:bg-black/10";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const findContainer = useCallback((id: UniqueIdentifier): string | null => {
    if (id === "pool" || tiers.some((t) => t.id === id)) return id as string;
    if (poolItems.some((i) => i.id === id)) return "pool";
    for (const tier of tiers) {
      if (tier.items.some((i) => i.id === id)) return tier.id;
    }
    return null;
  }, [tiers, poolItems]);

  const findItem = useCallback((id: UniqueIdentifier): TierItem | null => {
    const poolItem = poolItems.find((i) => i.id === id);
    if (poolItem) return poolItem;
    for (const tier of tiers) {
      const item = tier.items.find((i) => i.id === id);
      if (item) return item;
    }
    return null;
  }, [tiers, poolItems]);

  const activeItem = activeId ? findItem(activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    let overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    if (tiers.some((t) => t.id === over.id) || over.id === "pool") {
      overContainer = over.id as string;
    }

    if (activeContainer === overContainer) return;

    const activeItemObj = findItem(active.id);
    if (!activeItemObj) return;

    if (activeContainer === "pool") {
      setPoolItems((prev) => prev.filter((i) => i.id !== active.id));
    } else {
      setTiers((prev) =>
        prev.map((t) =>
          t.id === activeContainer
            ? { ...t, items: t.items.filter((i) => i.id !== active.id) }
            : t
        )
      );
    }

    if (overContainer === "pool") {
      setPoolItems((prev) => {
        if (prev.some((i) => i.id === activeItemObj.id)) return prev;
        const overIndex = over.id === "pool" ? prev.length : prev.findIndex((i) => i.id === over.id);
        const idx = overIndex === -1 ? prev.length : overIndex;
        const newItems = [...prev];
        newItems.splice(idx, 0, activeItemObj);
        return newItems;
      });
    } else {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id !== overContainer) return t;
          if (t.items.some((i) => i.id === activeItemObj.id)) return t;
          const overIndex = t.items.findIndex((i) => i.id === over.id);
          const idx = overIndex === -1 ? t.items.length : overIndex;
          const newItems = [...t.items];
          newItems.splice(idx, 0, activeItemObj);
          return { ...t, items: newItems };
        })
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    if (active.id === over.id) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;
    if (activeContainer !== overContainer) return;

    if (activeContainer === "pool") {
      setPoolItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    } else {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id !== activeContainer) return t;
          const oldIndex = t.items.findIndex((i) => i.id === active.id);
          const newIndex = t.items.findIndex((i) => i.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return t;
          return { ...t, items: arrayMove(t.items, oldIndex, newIndex) };
        })
      );
    }
  };

  const handleImportImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const dataUrl = ev.target?.result as string;
        setPoolItems((prev) => [...prev, { id: generateId(), dataUrl }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast({ title: "URL inválida", description: "A URL precisa começar com http:// ou https://", variant: "destructive" });
      return;
    }
    setPoolItems((prev) => [...prev, { id: generateId(), dataUrl: url }]);
    setUrlInput("");
    toast({ title: "Imagem adicionada", description: "Imagem da URL foi adicionada ao pool." });
  };

  const moveTier = (tierId: string, direction: "up" | "down") => {
    setTiers((prev) => {
      const index = prev.findIndex((t) => t.id === tierId);
      if (index === -1) return prev;
      if (direction === "up" && index === 0) return prev;
      if (direction === "down" && index === prev.length - 1) return prev;
      const newTiers = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newTiers[index], newTiers[swapIndex]] = [newTiers[swapIndex], newTiers[index]];
      return newTiers;
    });
  };

  const updateTierLabel = (tierId: string, label: string) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, label } : t))
    );
  };

  const updateTierColor = (tierId: string, color: string) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, color } : t))
    );
  };

  const deleteTier = (tierId: string) => {
    setTiers((prev) => {
      const tier = prev.find((t) => t.id === tierId);
      if (tier && tier.items.length > 0) {
        setPoolItems((p) => [...p, ...tier.items]);
      }
      return prev.filter((t) => t.id !== tierId);
    });
    setSettingsForTier(null);
  };

  const clearTierImages = (tierId: string) => {
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id !== tierId) return t;
        if (t.items.length > 0) {
          setPoolItems((p) => [...p, ...t.items]);
        }
        return { ...t, items: [] };
      })
    );
  };

  const addTierAbove = (tierId: string) => {
    setTiers((prev) => {
      const index = prev.findIndex((t) => t.id === tierId);
      if (index === -1) return prev;
      const newTier: Tier = {
        id: generateId(),
        label: "New",
        color: TIER_COLORS[Math.floor(Math.random() * TIER_COLORS.length)],
        items: [],
      };
      const newTiers = [...prev];
      newTiers.splice(index, 0, newTier);
      return newTiers;
    });
    setSettingsForTier(null);
  };

  const addTierBelow = (tierId: string) => {
    setTiers((prev) => {
      const index = prev.findIndex((t) => t.id === tierId);
      if (index === -1) return prev;
      const newTier: Tier = {
        id: generateId(),
        label: "New",
        color: TIER_COLORS[Math.floor(Math.random() * TIER_COLORS.length)],
        items: [],
      };
      const newTiers = [...prev];
      newTiers.splice(index + 1, 0, newTier);
      return newTiers;
    });
    setSettingsForTier(null);
  };

  const handleReset = () => {
    setTiers(DEFAULT_TIERS.map((t) => ({ ...t, items: [] })));
    setPoolItems([]);
    setTitle("My Tier List");
    setRowBgColor("#1e1e1e");
  };

  const generateTierImage = async (): Promise<Blob | null> => {
    if (!tierListRef.current) return null;
    const el = tierListRef.current;

    // Wait for all images inside the tier list to finish loading
    const images = el.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalHeight > 0) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    );

    // Use onclone to modify the CLONED DOM (not the live page)
    const canvas = await html2canvas(el, {
      backgroundColor: rowBgColor,
      useCORS: true,
      allowTaint: true,
      scale: 2,
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: (_doc: Document, clonedEl: HTMLElement) => {
        // Hide settings columns in the clone
        clonedEl.querySelectorAll<HTMLElement>("[data-settings-col]").forEach(
          (col) => (col.style.display = "none")
        );
        // Remove CSS transforms from draggable items (dnd-kit adds translate3d)
        clonedEl.querySelectorAll<HTMLElement>("[data-testid^='draggable-item']").forEach(
          (item) => {
            item.style.transform = "none";
            item.style.transition = "none";
          }
        );
      },
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const handleDownload = async () => {
    try {
      const blob = await generateTierImage();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}_tierlist.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: "Download iniciado", description: "Sua tier list foi salva como imagem." });
    } catch {
      toast({ title: "Erro", description: "Falha ao gerar imagem.", variant: "destructive" });
    }
  };

  const handleDeletePoolItem = (itemId: string) => {
    setPoolItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const settingsTier = settingsForTier
    ? tiers.find((t) => t.id === settingsForTier)
    : null;

  const handlePrint = () => {
    window.print();
  };

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
          {/* Left: Page identity */}
          <div className="flex items-center gap-2">
            <TrophyIcon className={`w-6 h-6 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
            <span className={`font-bold text-lg hidden sm:inline ${textColor}`}>
              Tier Creator
            </span>
          </div>

          {/* Center: Framework Station logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${textColor}`}
          >
            <FrameworkStationIcon className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-500"}`} />
            <span className="font-semibold text-base hidden sm:inline">Framework Station</span>
          </Link>

          {/* Right: Dark/Light toggle */}
          <Button
            data-testid="button-toggle-mode"
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
        {/* Title */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                data-testid="input-title"
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") setIsEditingTitle(false);
                }}
                className={`text-2xl md:text-3xl font-bold text-center bg-transparent border-b-2 ${darkMode ? "border-white/40 text-white" : "border-gray-400 text-gray-900"} outline-none px-2 py-1 min-w-[200px]`}
                autoFocus
              />
            ) : (
              <button
                data-testid="button-edit-title"
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-2 group"
              >
                <h1 className={`text-2xl md:text-3xl font-bold ${textColor}`}>
                  {title}
                </h1>
                <Pencil className={`w-4 h-4 ${darkMode ? "text-white/50 group-hover:text-white/80" : "text-gray-400 group-hover:text-gray-600"} transition-colors`} />
              </button>
            )}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div ref={tierListRef} className="print-area rounded-md overflow-hidden" style={{ backgroundColor: rowBgColor }}>
            <div className="mb-0.5 flex items-center justify-center py-2">
              <h2 className="text-lg font-bold" style={{ color: isLightColor(rowBgColor) ? "#1a1a1a" : "#ffffffE6" }}>{title}</h2>
            </div>
            {tiers.map((tier) => (
              <TierRow
                key={tier.id}
                tier={tier}
                rowBgColor={rowBgColor}
                onMoveUp={() => moveTier(tier.id, "up")}
                onMoveDown={() => moveTier(tier.id, "down")}
                onOpenSettings={() => setSettingsForTier(tier.id)}
                onLabelChange={(label: string) => updateTierLabel(tier.id, label)}
              />
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <p className={`${textMuted} text-sm`}>
              <span className={`font-semibold ${textMutedStrong}`}>Envie imagens para usar na sua tier list.</span>{" "}
              Nenhuma imagem é salva no servidor.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <label
                data-testid="button-upload-images"
                className="inline-flex items-center gap-2 cursor-pointer bg-violet-600 hover:bg-violet-700 transition-colors text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImportImages}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                Escolher arquivos
              </label>
              <span className={`text-sm ${textMuted}`}>ou</span>
              <input
                data-testid="input-url"
                type="text"
                value={urlInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleAddUrl();
                }}
                placeholder="Cole a URL de uma imagem (https://...)"
                className={`flex-1 min-w-[200px] ${inputBg} ${inputText} border ${inputBorder} rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 transition-colors`}
              />
              <Button
                data-testid="button-add-url"
                variant="outline"
                onClick={handleAddUrl}
                className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Adicionar URL
              </Button>
            </div>
          </div>

          <ImagePool items={poolItems} onDeleteItem={handleDeletePoolItem} />

          <DragOverlay dropAnimation={null}>
            {activeItem ? (
              <img
                src={activeItem.dataUrl}
                alt=""
                className="w-16 h-16 object-cover rounded-md shadow-xl"
                style={{ opacity: 0.85 }}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            data-testid="button-download"
            variant="outline"
            onClick={handleDownload}
            className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            data-testid="button-print"
            variant="outline"
            onClick={handlePrint}
            className={btnBg}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button
            data-testid="button-reset"
            variant="outline"
            onClick={handleReset}
            className={btnBg}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <div className="relative">
            <Button
              data-testid="button-row-bg-color"
              variant="outline"
              onClick={() => setShowRowBgPicker(!showRowBgPicker)}
              className={btnBg}
            >
              <Palette className="w-4 h-4 mr-2" />
              {showRowBgPicker ? "Fechar Cor de Fundo" : "Cor de Fundo"}
            </Button>
            {showRowBgPicker && (
              <ColorPickerPopover
                colors={ROW_BG_COLORS}
                selectedColor={rowBgColor}
                onSelect={(c: string) => {
                  setRowBgColor(c);
                  setShowRowBgPicker(false);
                }}
              />
            )}
          </div>
        </div>

        <TierSettingsDialog
          open={!!settingsForTier}
          onOpenChange={(open: boolean) => {
            if (!open) setSettingsForTier(null);
          }}
          tier={settingsTier ?? null}
          colors={TIER_COLORS}
          onColorChange={(color: string) =>
            settingsForTier && updateTierColor(settingsForTier, color)
          }
          onLabelChange={(label: string) =>
            settingsForTier && updateTierLabel(settingsForTier, label)
          }
          onDelete={() => settingsForTier && deleteTier(settingsForTier)}
          onClearImages={() =>
            settingsForTier && clearTierImages(settingsForTier)
          }
          onAddAbove={() => settingsForTier && addTierAbove(settingsForTier)}
          onAddBelow={() => settingsForTier && addTierBelow(settingsForTier)}
        />
      </div>

        {/* ─── SEO Content Section ─────────────── */}
        <div
          style={{
            backgroundColor: darkMode ? "#0f0f1a" : "#f5f5f5",
            color: darkMode ? "#cbd5e1" : "#334155",
          }}
        >
          <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
              O que é o Tier Creator?
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                O Tier Creator (criador de tiers ou classificações) é uma ferramenta que permite
                organizar itens — como produtos, personagens, opções ou qualquer coisa — em níveis
                hierárquicos, geralmente de S (melhor) a D ou F (pior).
              </p>

              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                Como Funciona
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Adicione imagens dos itens que deseja classificar (via upload ou URL)</li>
                <li>Arraste e solte cada item no nível desejado (S, A, B, C, D)</li>
                <li>Personalize cores, labels e quantidade de níveis</li>
                <li>Exporte sua tier list como imagem PNG para compartilhar</li>
              </ul>

              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                Quando Usar
              </h3>
              <p>
                Tier lists são populares para comparar e classificar qualquer tipo de item de forma
                visual e intuitiva — desde produtos e serviços até ideias e prioridades de projeto.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────── */}
      <Footer />

      {/* ─── Print Styles ────────────────────────── */}
      <style>{`
        @media print {
          /* Force browser to print background colors and images */
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

          /* Hide non-printable elements */
          header, footer, nav {
            display: none !important;
          }

          /* Hide settings/controls inside tier rows */
          .print-area button {
            display: none !important;
          }
          .print-area [data-testid^="button-settings"],
          .print-area [data-testid^="button-move"] {
            display: none !important;
          }
          .print-area .flex > div:last-child:has(button) {
            display: none !important;
          }

          /* Ensure images print properly */
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
  return luminance > 0.6;
}
