import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Matrix2x2 } from "@/components/shared/matrix-2x2";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SwotData {
  title: string;
  cells: [string, string, string, string];
}

const defaultData: SwotData = {
  title: "Analise SWOT",
  cells: ["", "", "", ""],
};

export function SwotPage() {
  const [data, setData] = useLocalStorage<SwotData>("fs_swot_data", defaultData);
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Matriz SWOT - Framework Station";
  }, []);

  const handleCellChange = (index: number, value: string) => {
    setData((prev) => {
      const cells = [...prev.cells] as [string, string, string, string];
      cells[index] = value;
      return { ...prev, cells };
    });
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Matrix2x2
          ref={matrixRef}
          title={data.title}
          onTitleChange={(title) => setData((prev) => ({ ...prev, title }))}
          cells={[
            {
              label: "Forcas (Strengths)",
              color: "#22C55E",
              value: data.cells[0],
              placeholder: "Liste os pontos fortes internos...",
            },
            {
              label: "Fraquezas (Weaknesses)",
              color: "#EF4444",
              value: data.cells[1],
              placeholder: "Liste os pontos fracos internos...",
            },
            {
              label: "Oportunidades (Opportunities)",
              color: "#3B82F6",
              value: data.cells[2],
              placeholder: "Liste as oportunidades externas...",
            },
            {
              label: "Ameacas (Threats)",
              color: "#F59E0B",
              value: data.cells[3],
              placeholder: "Liste as ameacas externas...",
            },
          ]}
          onCellChange={handleCellChange}
        />

        <ExportToolbar
          targetRef={matrixRef}
          fileName="analise-swot"
          title="Analise SWOT"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que e a Matriz SWOT?">
        <p>
          A Matriz SWOT (tambem conhecida como Analise SWOT ou FOFA em portugues) e uma
          ferramenta de planejamento estrategico utilizada para identificar Forcas (Strengths),
          Fraquezas (Weaknesses), Oportunidades (Opportunities) e Ameacas (Threats) relacionadas
          a um projeto, negocio ou situacao.
        </p>

        <h3>Origem e Historia</h3>
        <p>
          A analise SWOT foi desenvolvida na decada de 1960 por Albert Humphrey, pesquisador do
          Stanford Research Institute (SRI), durante um projeto de pesquisa financiado pelas 500
          maiores empresas da revista Fortune. O objetivo era entender por que o planejamento
          corporativo falhava consistentemente. O framework original era chamado de SOFT analysis
          (Satisfactory, Opportunity, Fault, Threat) e evoluiu para o formato SWOT que
          conhecemos hoje.
        </p>

        <h3>Como Usar</h3>
        <ul>
          <li><strong>Forcas:</strong> Identifique vantagens internas, recursos unicos, competencias e diferenciais.</li>
          <li><strong>Fraquezas:</strong> Reconheca limitacoes internas, areas de melhoria e desvantagens.</li>
          <li><strong>Oportunidades:</strong> Explore fatores externos favoraveis, tendencias e mudancas de mercado.</li>
          <li><strong>Ameacas:</strong> Mapeie riscos externos, concorrencia, regulacoes e obstaculos.</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          A Matriz SWOT e ideal para planejamento estrategico, analise de viabilidade de novos
          projetos, avaliacao de posicao competitiva e tomada de decisoes que exigem uma visao
          holistica de fatores internos e externos.
        </p>

        <p className="text-xs mt-6">
          Fonte: Humphrey, A. (2005). "SWOT Analysis for Management Consulting." SRI Alumni
          Association Newsletter. | Learned, E.P., Christensen, C.R., Andrews, K.R., Guth, W.D.
          (1965). Business Policy: Text and Cases. Irwin.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
