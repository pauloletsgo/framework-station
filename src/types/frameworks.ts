import type { LucideIcon } from "lucide-react";

export interface FrameworkInfo {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
  color: string;
}
