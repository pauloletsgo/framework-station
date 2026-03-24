import { SwotIcon } from "@/components/icons/swot-icon";
import { AnsoffIcon } from "@/components/icons/ansoff-icon";
import { BcgIcon } from "@/components/icons/bcg-icon";
import { PorterIcon } from "@/components/icons/porter-icon";
import { UspIcon } from "@/components/icons/usp-icon";
import { GoldenCircleIcon } from "@/components/icons/golden-circle-icon";
import { BmcIcon } from "@/components/icons/bmc-icon";
import { TrophyIcon } from "@/components/icons/trophy-icon";
import type { FrameworkInfo } from "@/types/frameworks";

export const frameworks: FrameworkInfo[] = [
  {
    slug: "matriz-swot-framework-template",
    name: "Matriz SWOT",
    description:
      "Análise Forças, Fraquezas, Oportunidades e Ameaças do seu negócio ou projeto.",
    icon: SwotIcon,
    tags: ["estratégia", "análise", "planejamento"],
    color: "#3B82F6",
  },
  {
    slug: "matriz-de-ansoff-framework-template",
    name: "Matriz de Ansoff",
    description:
      "Planeje estratégias de crescimento cruzando produtos e mercados existentes e novos.",
    icon: AnsoffIcon,
    tags: ["crescimento", "estratégia", "mercado"],
    color: "#8B5CF6",
  },
  {
    slug: "matriz-bcg-framework-template",
    name: "Matriz BCG",
    description:
      "Classifique seus produtos em Estrelas, Vacas Leiteiras, Interrogações e Abacaxis.",
    icon: BcgIcon,
    tags: ["portfólio", "produto", "investimento"],
    color: "#F59E0B",
  },
  {
    slug: "5-forcas-de-porter-framework-template",
    name: "5 Forças de Porter",
    description:
      "Avalie a competitividade do seu mercado analisando as cinco forças competitivas.",
    icon: PorterIcon,
    tags: ["competição", "mercado", "indústria"],
    color: "#EF31B9",
  },
  {
    slug: "usp-unique-selling-proposition-framework-template",
    name: "Unique Selling Proposition",
    description:
      "Defina a proposta única de valor que diferencia seu produto ou serviço.",
    icon: UspIcon,
    tags: ["marketing", "posicionamento", "diferencial"],
    color: "#58A904",
  },
  {
    slug: "golden-circle-framework-template",
    name: "Golden Circle",
    description:
      "Descubra o propósito do seu negócio com o modelo Por Que, Como e O Que.",
    icon: GoldenCircleIcon,
    tags: ["propósito", "liderança", "comunicação"],
    color: "#FFC800",
  },
  {
    slug: "business-model-canvas-framework-template",
    name: "Business Model Canvas",
    description:
      "Visualize e planeje todos os elementos do seu modelo de negócios em um único canvas.",
    icon: BmcIcon,
    tags: ["modelo de negócios", "startup", "planejamento"],
    color: "#84FC06",
  },
  {
    slug: "tier-creator-framework-template",
    name: "Tier Creator",
    description:
      "Crie listas de classificação (tier lists) arrastando e organizando itens por níveis.",
    icon: TrophyIcon,
    tags: ["classificação", "ranking", "organização"],
    color: "#FFC800",
  },
];
