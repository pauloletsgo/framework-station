import { useEffect } from "react";
import { TierListTool } from "@/components/tier-creator/tier-list-tool";

export function TierCreatorPage() {
  useEffect(() => {
    document.title = "Template Gratuito: Tier Creator - Framework Station";
  }, []);

  return <TierListTool />;
}
