import {
  Grid3X3,
  Shield,
  Swords,
  PieChart,
  Target,
  CircleDot,
  LayoutDashboard,
  Trophy,
} from "lucide-react";
import type { FrameworkInfo } from "@/types/frameworks";

export const frameworks: FrameworkInfo[] = [
  {
    slug: "swot",
    name: "Matriz SWOT",
    description:
      "Analise Forcas, Fraquezas, Oportunidades e Ameacas do seu negocio ou projeto.",
    icon: Shield,
    tags: ["estrategia", "analise", "planejamento"],
    color: "#3B82F6",
  },
  {
    slug: "ansoff",
    name: "Matriz de Ansoff",
    description:
      "Planeje estrategias de crescimento cruzando produtos e mercados existentes e novos.",
    icon: Grid3X3,
    tags: ["crescimento", "estrategia", "mercado"],
    color: "#8B5CF6",
  },
  {
    slug: "bcg",
    name: "Matriz BCG",
    description:
      "Classifique seus produtos em Estrelas, Vacas Leiteiras, Interrogacoes e Abacaxis.",
    icon: PieChart,
    tags: ["portfolio", "produto", "investimento"],
    color: "#F59E0B",
  },
  {
    slug: "porter",
    name: "5 Forcas de Porter",
    description:
      "Avalie a competitividade do seu mercado analisando as cinco forcas competitivas.",
    icon: Swords,
    tags: ["competicao", "mercado", "industria"],
    color: "#EF4444",
  },
  {
    slug: "usp",
    name: "Unique Selling Proposition",
    description:
      "Defina a proposta unica de valor que diferencia seu produto ou servico.",
    icon: Target,
    tags: ["marketing", "posicionamento", "diferencial"],
    color: "#10B981",
  },
  {
    slug: "golden-circle",
    name: "Golden Circle",
    description:
      "Descubra o proposito do seu negocio com o modelo Por Que, Como e O Que.",
    icon: CircleDot,
    tags: ["proposito", "lideranca", "comunicacao"],
    color: "#F97316",
  },
  {
    slug: "business-model-canvas",
    name: "Business Model Canvas",
    description:
      "Visualize e planeje todos os elementos do seu modelo de negocios em um unico canvas.",
    icon: LayoutDashboard,
    tags: ["modelo de negocios", "startup", "planejamento"],
    color: "#06B6D4",
  },
  {
    slug: "tier-creator",
    name: "Tier Creator",
    description:
      "Crie listas de classificacao (tier lists) arrastando e organizando itens por niveis.",
    icon: Trophy,
    tags: ["classificacao", "ranking", "organizacao"],
    color: "#EC4899",
  },
];
