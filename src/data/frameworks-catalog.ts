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
      "Análise Forças, Fraquezas, Oportunidades e Ameaças do seu negócio ou projeto.",
    icon: Shield,
    tags: ["estratégia", "análise", "planejamento"],
    color: "#3B82F6",
  },
  {
    slug: "ansoff",
    name: "Matriz de Ansoff",
    description:
      "Planeje estratégias de crescimento cruzando produtos e mercados existentes e novos.",
    icon: Grid3X3,
    tags: ["crescimento", "estratégia", "mercado"],
    color: "#8B5CF6",
  },
  {
    slug: "bcg",
    name: "Matriz BCG",
    description:
      "Classifique seus produtos em Estrelas, Vacas Leiteiras, Interrogações e Abacaxis.",
    icon: PieChart,
    tags: ["portfólio", "produto", "investimento"],
    color: "#F59E0B",
  },
  {
    slug: "porter",
    name: "5 Forças de Porter",
    description:
      "Avalie a competitividade do seu mercado analisando as cinco forças competitivas.",
    icon: Swords,
    tags: ["competição", "mercado", "indústria"],
    color: "#EF4444",
  },
  {
    slug: "usp",
    name: "Unique Selling Proposition",
    description:
      "Defina a proposta única de valor que diferencia seu produto ou serviço.",
    icon: Target,
    tags: ["marketing", "posicionamento", "diferencial"],
    color: "#10B981",
  },
  {
    slug: "golden-circle",
    name: "Golden Circle",
    description:
      "Descubra o propósito do seu negócio com o modelo Por Que, Como e O Que.",
    icon: CircleDot,
    tags: ["propósito", "liderança", "comunicação"],
    color: "#F97316",
  },
  {
    slug: "business-model-canvas",
    name: "Business Model Canvas",
    description:
      "Visualize e planeje todos os elementos do seu modelo de negócios em um único canvas.",
    icon: LayoutDashboard,
    tags: ["modelo de negócios", "startup", "planejamento"],
    color: "#06B6D4",
  },
  {
    slug: "tier-creator",
    name: "Tier Creator",
    description:
      "Crie listas de classificação (tier lists) arrastando e organizando itens por níveis.",
    icon: Trophy,
    tags: ["classificação", "ranking", "organização"],
    color: "#EC4899",
  },
];
