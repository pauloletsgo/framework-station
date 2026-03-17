import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { EditableCell } from "@/components/shared/editable-cell";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface BmcData {
  title: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

const defaultData: BmcData = {
  title: "Business Model Canvas",
  keyPartners: "",
  keyActivities: "",
  keyResources: "",
  valuePropositions: "",
  customerRelationships: "",
  channels: "",
  customerSegments: "",
  costStructure: "",
  revenueStreams: "",
};

const blocks: {
  field: keyof BmcData;
  label: string;
  placeholder: string;
  color: string;
  gridArea: string;
}[] = [
  {
    field: "keyPartners",
    label: "Parceiros-Chave",
    placeholder: "Quem são seus parceiros e fornecedores estratégicos?",
    color: "#8B5CF6",
    gridArea: "1 / 1 / 3 / 3",
  },
  {
    field: "keyActivities",
    label: "Atividades-Chave",
    placeholder: "Quais atividades essenciais seu modelo de negócio exige?",
    color: "#3B82F6",
    gridArea: "1 / 3 / 2 / 5",
  },
  {
    field: "keyResources",
    label: "Recursos-Chave",
    placeholder: "Quais recursos essenciais sua proposta de valor exige?",
    color: "#06B6D4",
    gridArea: "2 / 3 / 3 / 5",
  },
  {
    field: "valuePropositions",
    label: "Proposta de Valor",
    placeholder: "Qual valor você entrega ao cliente? Que problema resolve?",
    color: "#22C55E",
    gridArea: "1 / 5 / 3 / 7",
  },
  {
    field: "customerRelationships",
    label: "Relacionamento com Clientes",
    placeholder: "Que tipo de relacionamento seus clientes esperam?",
    color: "#F59E0B",
    gridArea: "1 / 7 / 2 / 9",
  },
  {
    field: "channels",
    label: "Canais",
    placeholder: "Como você alcança e entrega valor aos clientes?",
    color: "#F97316",
    gridArea: "2 / 7 / 3 / 9",
  },
  {
    field: "customerSegments",
    label: "Segmentos de Clientes",
    placeholder: "Para quem você está criando valor? Quem são seus clientes?",
    color: "#EF4444",
    gridArea: "1 / 9 / 3 / 11",
  },
  {
    field: "costStructure",
    label: "Estrutura de Custos",
    placeholder: "Quais são os custos mais importantes do modelo de negócio?",
    color: "#64748B",
    gridArea: "3 / 1 / 4 / 6",
  },
  {
    field: "revenueStreams",
    label: "Fontes de Receita",
    placeholder: "Pelo que os clientes estão realmente dispostos a pagar?",
    color: "#059669",
    gridArea: "3 / 6 / 4 / 11",
  },
];

export function BusinessModelCanvasPage() {
  const [data, setData] = useLocalStorage<BmcData>("fs_bmc_data", defaultData);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Business Model Canvas - Framework Station";
  }, []);

  const update = (field: keyof BmcData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div ref={canvasRef} className="bg-background p-4 sm:p-6 rounded-xl">
          <input
            type="text"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className="text-xl sm:text-2xl font-bold text-center w-full bg-transparent outline-none mb-4 sm:mb-6 text-foreground"
            placeholder="Título"
          />

          {/* Desktop: CSS Grid layout */}
          <div className="hidden md:grid gap-1.5" style={{
            gridTemplateColumns: "repeat(10, 1fr)",
            gridTemplateRows: "minmax(140px, auto) minmax(140px, auto) minmax(120px, auto)",
          }}>
            {blocks.map((block) => (
              <div
                key={block.field}
                className="rounded-lg border overflow-hidden"
                style={{
                  gridArea: block.gridArea,
                  backgroundColor: `${block.color}10`,
                }}
              >
                <EditableCell
                  value={data[block.field]}
                  onChange={(v) => update(block.field, v)}
                  label={block.label}
                  placeholder={block.placeholder}
                  minHeight="80px"
                />
              </div>
            ))}
          </div>

          {/* Mobile: stacked layout */}
          <div className="md:hidden space-y-2">
            {blocks.map((block) => (
              <div
                key={block.field}
                className="rounded-lg border overflow-hidden"
                style={{ backgroundColor: `${block.color}10` }}
              >
                <EditableCell
                  value={data[block.field]}
                  onChange={(v) => update(block.field, v)}
                  label={block.label}
                  placeholder={block.placeholder}
                  minHeight="60px"
                />
              </div>
            ))}
          </div>
        </div>

        <ExportToolbar
          targetRef={canvasRef}
          fileName="business-model-canvas"
          title="Business Model Canvas"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que é o Business Model Canvas?">
        <p>
          O Business Model Canvas (BMC) é uma ferramenta de gestão estratégica que permite
          desenvolver e esboçar modelos de negócios novos ou existentes. Ele organiza os
          elementos essenciais de um negócio em nove blocos interconectados em uma única
          página visual.
        </p>

        <h3>Origem e História</h3>
        <p>
          O Business Model Canvas foi criado por Alexander Osterwalder, teórico de negócios suíço,
          como parte de sua tese de doutorado na Université de Lausanne. O modelo foi popularizado
          no livro "Business Model Generation" (2010), co-escrito com Yves Pigneur e co-criado com
          uma comunidade de 470 praticantes de 45 países. O livro se tornou referência mundial em
          inovação de modelos de negócios.
        </p>

        <h3>Os Nove Blocos</h3>
        <ul>
          <li><strong>Segmentos de Clientes:</strong> Os diferentes grupos de pessoas ou organizações que a empresa pretende servir.</li>
          <li><strong>Proposta de Valor:</strong> O pacote de produtos e serviços que cria valor para um segmento específico.</li>
          <li><strong>Canais:</strong> Como a empresa se comunica e entrega sua proposta de valor.</li>
          <li><strong>Relacionamento com Clientes:</strong> Os tipos de relação estabelecidos com cada segmento.</li>
          <li><strong>Fontes de Receita:</strong> O dinheiro que a empresa gera de cada segmento.</li>
          <li><strong>Recursos-Chave:</strong> Os ativos mais importantes para o funcionamento do modelo.</li>
          <li><strong>Atividades-Chave:</strong> As ações mais importantes para operar com sucesso.</li>
          <li><strong>Parceiros-Chave:</strong> A rede de fornecedores e parceiros essenciais.</li>
          <li><strong>Estrutura de Custos:</strong> Todos os custos envolvidos na operação do modelo.</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          O BMC é ideal para startups validando ideias, empresas repensando seus modelos, equipes
          alinhando visão estratégica, e empreendedores comunicando suas ideias de forma visual
          e objetiva.
        </p>

        <p className="text-xs mt-6">
          Fonte: Osterwalder, Alexander & Pigneur, Yves (2010). Business Model Generation: A
          Handbook for Visionaries, Game Changers, and Challengers. John Wiley & Sons.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
