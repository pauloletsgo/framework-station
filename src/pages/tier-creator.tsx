import { useEffect } from "react";
import { TierListTool } from "@/components/tier-creator/tier-list-tool";

export function TierCreatorPage() {
  useEffect(() => {
    document.title = "Tier Creator - Framework Station";
  }, []);

  return <TierListTool />;
}
