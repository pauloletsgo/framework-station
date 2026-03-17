import type { RefObject } from "react";
import { Download, Share2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToPng, shareAsPng } from "@/lib/export";

interface ExportToolbarProps {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName?: string;
  onReset: () => void;
  title?: string;
}

export function ExportToolbar({ targetRef, fileName = "framework-station", onReset, title }: ExportToolbarProps) {
  const handleDownload = () => {
    if (targetRef.current) {
      exportToPng(targetRef.current, fileName);
    }
  };

  const handleShare = () => {
    if (targetRef.current) {
      shareAsPng(targetRef.current, title || fileName);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        Baixar PNG
      </Button>
      <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
        <Share2 className="h-4 w-4" />
        Compartilhar
      </Button>
      <Button onClick={onReset} variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
        <RotateCcw className="h-4 w-4" />
        Limpar
      </Button>
    </div>
  );
}
