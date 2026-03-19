import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export interface FrameworkInfo {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  tags: string[];
  color: string;
}
