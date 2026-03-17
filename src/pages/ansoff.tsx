import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Matrix2x2 } from "@/components/shared/matrix-2x2";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface AnsoffData {
  title: string;
  cells: [string, string, string, string];
}

const defaultData: AnsoffData = {
  title: "Matriz de Ansoff",
  cells: ["", "", "", ""],
};

export function AnsoffPage() {
  const [data, setData] = useLocalStorage<AnsoffData>("fs_ansoff_data", defaultData);
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Matriz de Ansoff - Framework Station";
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
          xAxisLabel="Produtos"
          yAxisLabel="Mercados"
          xAxisValues={["Existentes", "Novos"]}
          yAxisValues={["Existentes", "Novos"]}
          cells={[
            {
              label: "Penetracao de Mercado",
              color: "#22C55E",
              value: data.cells[0],
              placeholder: "Estrategias para vender mais dos produtos atuais nos mercados atuais...",
            },
            {
              label: "Desenvolvimento de Produto",
              color: "#3B82F6",
              value: data.cells[1],
              placeholder: "Estrategias para criar novos produtos para os mercados atuais...",
            },
            {
              label: "Desenvolvimento de Mercado",
              color: "#F59E0B",
              value: data.cells[2],
              placeholder: "Estrategias para levar produtos atuais a novos mercados...",
            },
            {
              label: "Diversificacao",
              color: "#EF4444",
              value: data.cells[3],
              placeholder: "Estrategias para novos produtos em novos mercados...",
            },
          ]}
          onCellChange={handleCellChange}
        />

        <ExportToolbar
          targetRef={matrixRef}
          fileName="matriz-ansoff"
          title="Matriz de Ansoff"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que e a Matriz de Ansoff?">
        <p>
          A Matriz de Ansoff, tambem conhecida como Matriz Produto-Mercado, e uma ferramenta de
          planejamento estrategico que ajuda empresas a definir suas estrategias de crescimento.
          Ela cruza duas dimensoes — produtos (existentes e novos) e mercados (existentes e novos)
          — gerando quatro estrategias possiveis.
        </p>

        <h3>Origem e Historia</h3>
        <p>
          Criada por H. Igor Ansoff, considerado o pai da gestao estrategica, a matriz foi
          publicada pela primeira vez no artigo "Strategies for Diversification" na Harvard
          Business Review em 1957. Ansoff era um matematico e estrategista de negocios
          russo-americano que revolucionou o campo do planejamento estrategico corporativo.
        </p>

        <h3>As Quatro Estrategias</h3>
        <ul>
          <li><strong>Penetracao de Mercado:</strong> Menor risco. Vender mais do mesmo produto no mercado atual (ex: promocoes, fidelizacao).</li>
          <li><strong>Desenvolvimento de Produto:</strong> Risco moderado. Criar novos produtos para o mercado atual (ex: novas funcionalidades, variantes).</li>
          <li><strong>Desenvolvimento de Mercado:</strong> Risco moderado. Expandir produtos atuais para novos mercados (ex: nova regiao, novo segmento).</li>
          <li><strong>Diversificacao:</strong> Maior risco. Novos produtos em novos mercados (ex: entrar em uma industria diferente).</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          A Matriz de Ansoff e ideal quando a empresa precisa definir caminhos de crescimento,
          avaliar riscos de expansao ou decidir entre focar no mercado atual ou explorar novas
          oportunidades.
        </p>

        <p className="text-xs mt-6">
          Fonte: Ansoff, H. Igor (1957). "Strategies for Diversification." Harvard Business
          Review, 35(5), 113-124.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
