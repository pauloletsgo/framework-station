import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Tier } from "@/components/tier-creator/tier-list-tool";

interface TierSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: Tier | null;
  colors: string[];
  onColorChange: (color: string) => void;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
  onClearImages: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
}

export function TierSettingsDialog({
  open,
  onOpenChange,
  tier,
  colors,
  onColorChange,
  onLabelChange,
  onDelete,
  onClearImages,
  onAddAbove,
  onAddBelow,
}: TierSettingsDialogProps) {
  if (!tier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-tier-settings">
        <DialogHeader>
          <DialogTitle>Configurar Tier</DialogTitle>
          <DialogDescription>
            Ajuste as configurações desta linha da tier list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap justify-center gap-2">
            {colors.map((color) => (
              <button
                key={color}
                data-testid={`color-option-${color.replace("#", "")}`}
                onClick={() => onColorChange(color)}
                className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shrink-0"
                style={{
                  backgroundColor: color,
                  borderColor: tier.color === color ? "#fff" : "transparent",
                  boxShadow: tier.color === color ? "0 0 0 2px rgba(0,0,0,0.3)" : "none",
                }}
              />
            ))}
          </div>

          <div>
            <textarea
              data-testid="input-tier-label-settings"
              value={tier.label}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onLabelChange(e.target.value)}
              className="w-full border rounded-md p-3 text-sm bg-background text-foreground resize-y min-h-[44px]"
              rows={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              data-testid="button-delete-row"
              variant="outline"
              onClick={onDelete}
              className="text-sm"
            >
              Deletar Linha
            </Button>
            <Button
              data-testid="button-clear-images"
              variant="outline"
              onClick={onClearImages}
              className="text-sm"
            >
              Limpar Imagens
            </Button>
            <Button
              data-testid="button-add-above"
              variant="outline"
              onClick={onAddAbove}
              className="text-sm"
            >
              Adicionar Acima
            </Button>
            <Button
              data-testid="button-add-below"
              variant="outline"
              onClick={onAddBelow}
              className="text-sm"
            >
              Adicionar Abaixo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
