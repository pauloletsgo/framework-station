import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Matrix2x2 } from "@/components/shared/matrix-2x2";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface BcgData {
  title: string;
  cells: [string, string, string, string];
}

const defaultData: BcgData = {
  title: "Matriz BCG",
  cells: ["", "", "", ""],
};

export function BcgPage() {
  const [data, setData] = useLocalStorage<BcgData>("fs_bcg_data", defaultData);
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Matriz BCG - Framework Station";
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
          xAxisLabel="Participação de Mercado"
          yAxisLabel="Crescimento do Mercado"
          xAxisValues={["Alta", "Baixa"]}
          yAxisValues={["Alto", "Baixo"]}
          cells={[
            {
              label: "\u2B50 Estrelas (Stars)",
              color: "#F59E0B",
              value: data.cells[0],
              placeholder: "Produtos com alta participação em mercados de alto crescimento...",
            },
            {
              label: "\u2753 Interrogações (Question Marks)",
              color: "#8B5CF6",
              value: data.cells[1],
              placeholder: "Produtos com baixa participação em mercados de alto crescimento...",
            },
            {
              label: "\uD83D\uDCB0 Vacas Leiteiras (Cash Cows)",
              color: "#22C55E",
              value: data.cells[2],
              placeholder: "Produtos com alta participação em mercados de baixo crescimento...",
            },
            {
              label: "\uD83D\uDC3E Abacaxis (Dogs)",
              color: "#EF4444",
              value: data.cells[3],
              placeholder: "Produtos com baixa participação em mercados de baixo crescimento...",
            },
          ]}
          onCellChange={handleCellChange}
        />

        <ExportToolbar
          targetRef={matrixRef}
          fileName="matriz-bcg"
          title="Matriz BCG"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que é a Matriz BCG?">
        <p>
          A Matriz BCG (Boston Consulting Group Matrix), também chamada de Matriz de Crescimento-Participação,
          é uma ferramenta de análise de portfólio que classifica produtos ou unidades de negócio em
          quatro categorias baseadas em duas dimensões: taxa de crescimento do mercado e participação
          relativa de mercado.
        </p>

        <h3>Origem e História</h3>
        <p>
          A Matriz BCG foi criada em 1970 por Bruce Henderson, fundador do Boston Consulting Group.
          Henderson desenvolveu o modelo para ajudar empresas a decidir em quais unidades de negócio
          investir, manter ou desinvestir. O conceito se baseia na ideia de que a participação de mercado
          está diretamente relacionada à geração de caixa, enquanto o crescimento do mercado exige
          investimentos.
        </p>

        <h3>As Quatro Categorias</h3>
        <ul>
          <li><strong>Estrelas:</strong> Alta participação + alto crescimento. Líderes de mercado que precisam de investimento para manter posição. Potencial para se tornarem vacas leiteiras.</li>
          <li><strong>Interrogações:</strong> Baixa participação + alto crescimento. Requerem decisão: investir para crescer ou abandonar.</li>
          <li><strong>Vacas Leiteiras:</strong> Alta participação + baixo crescimento. Geram caixa excedente com pouco investimento. Financiam outras unidades.</li>
          <li><strong>Abacaxis (Dogs):</strong> Baixa participação + baixo crescimento. Candidatos a desinvestimento ou reposicionamento.</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          A Matriz BCG é ideal para análise de portfólio de produtos, alocação de recursos entre
          unidades de negócio e decisões de investimento ou desinvestimento estratégico.
        </p>

        <p className="text-xs mt-6">
          Fonte: Henderson, Bruce D. (1970). "The Product Portfolio." BCG Perspectives. Boston
          Consulting Group.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
