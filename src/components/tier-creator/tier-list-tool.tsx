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
import { Download, RotateCcw, Palette, Share2, Pencil, Link2, Sun, Moon, Trophy } from "lucide-react";
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
  const [rowBgColor, setRowBgColor] = useState("#1e1e1e");
  const [darkMode, setDarkMode] = useState(true);
  const [showRowBgPicker, setShowRowBgPicker] = useState(false);
  const [settingsForTier, setSettingsForTier] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const tierListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const pageBgColor = darkMode ? "#1a1a2e" : "#f0f0f0";
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
    const canvas = await html2canvas(tierListRef.current, {
      backgroundColor: rowBgColor,
      useCORS: true,
      scale: 2,
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

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const blob = await generateTierImage();
      if (!blob) {
        toast({ title: "Erro", description: "Falha ao gerar imagem para compartilhar.", variant: "destructive" });
        return;
      }
      const file = new File([blob], `${title.replace(/\s+/g, "_")}_tierlist.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title,
          text: `Confira minha tier list: ${title}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${title.replace(/\s+/g, "_")}_tierlist.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Imagem gerada!",
          description: "Seu navegador não suporta compartilhamento direto de imagem. O download foi iniciado - compartilhe o arquivo manualmente.",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast({ title: "Erro", description: "Falha ao compartilhar.", variant: "destructive" });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDeletePoolItem = (itemId: string) => {
    setPoolItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const settingsTier = settingsForTier
    ? tiers.find((t) => t.id === settingsForTier)
    : null;

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: pageBgColor }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Trophy className={`w-8 h-8 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
              <span className={`hidden md:inline text-xl font-bold ${textColor}`}>Tier Creator</span>
            </div>
          </div>
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
          <div className="flex-1 flex justify-end">
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
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div ref={tierListRef} className="rounded-md overflow-hidden" style={{ backgroundColor: rowBgColor }}>
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
                className={`inline-flex items-center gap-2 cursor-pointer ${inputBg} hover:opacity-80 transition-colors ${textColor} px-4 py-2 rounded-md text-sm font-medium border ${inputBorder}`}
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
            </div>
            <div className="flex items-center gap-2">
              <input
                data-testid="input-url"
                type="text"
                value={urlInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleAddUrl();
                }}
                placeholder="Cole a URL de uma imagem (https://...)"
                className={`flex-1 max-w-lg ${inputBg} ${inputText} border ${inputBorder} rounded-md px-3 py-2 text-sm outline-none focus:border-opacity-60 transition-colors`}
              />
              <Button
                data-testid="button-add-url"
                variant="outline"
                onClick={handleAddUrl}
                className={btnBg}
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
            className="bg-indigo-600/80 text-white border-indigo-500/50 hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            data-testid="button-share"
            variant="outline"
            onClick={handleShare}
            disabled={isSharing}
            className={btnBg}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isSharing ? "Gerando..." : "Compartilhar"}
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
