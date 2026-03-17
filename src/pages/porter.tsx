import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { EditableCell } from "@/components/shared/editable-cell";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";

interface PorterData {
  title: string;
  rivalry: string;
  newEntrants: string;
  substitutes: string;
  suppliers: string;
  buyers: string;
}

const defaultData: PorterData = {
  title: "5 Forcas de Porter",
  rivalry: "",
  newEntrants: "",
  substitutes: "",
  suppliers: "",
  buyers: "",
};

export function PorterPage() {
  const [data, setData] = useLocalStorage<PorterData>("fs_porter_data", defaultData);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "5 Forcas de Porter - Framework Station";
  }, []);

  const update = (field: keyof PorterData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div ref={diagramRef} className="bg-background p-4 sm:p-8 rounded-xl">
          <input
            type="text"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className="text-xl sm:text-2xl font-bold text-center w-full bg-transparent outline-none mb-6 sm:mb-8 text-foreground"
            placeholder="Titulo"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
            {/* Left - Suppliers */}
            <div className="order-2 md:order-1 rounded-lg border overflow-hidden" style={{ backgroundColor: "#8B5CF615" }}>
              <EditableCell
                value={data.suppliers}
                onChange={(v) => update("suppliers", v)}
                label="Poder de Barganha dos Fornecedores"
                placeholder="Analise o poder dos fornecedores..."
                minHeight="120px"
              />
            </div>

            {/* Center column */}
            <div className="order-1 md:order-2 flex flex-col items-center gap-4">
              {/* Top - New Entrants */}
              <div className="w-full rounded-lg border overflow-hidden" style={{ backgroundColor: "#3B82F615" }}>
                <EditableCell
                  value={data.newEntrants}
                  onChange={(v) => update("newEntrants", v)}
                  label="Ameaca de Novos Entrantes"
                  placeholder="Analise as barreiras de entrada..."
                  minHeight="80px"
                />
              </div>

              {/* Arrow down */}
              <ArrowDown className="h-6 w-6 text-muted-foreground hidden md:block" />

              {/* Center - Rivalry */}
              <div className="w-full rounded-lg border-2 border-primary/30 overflow-hidden" style={{ backgroundColor: "#EF444415" }}>
                <EditableCell
                  value={data.rivalry}
                  onChange={(v) => update("rivalry", v)}
                  label="Rivalidade entre Concorrentes"
                  placeholder="Analise a intensidade da competicao..."
                  minHeight="100px"
                />
              </div>

              {/* Arrow up */}
              <ArrowUp className="h-6 w-6 text-muted-foreground hidden md:block" />

              {/* Bottom - Substitutes */}
              <div className="w-full rounded-lg border overflow-hidden" style={{ backgroundColor: "#F59E0B15" }}>
                <EditableCell
                  value={data.substitutes}
                  onChange={(v) => update("substitutes", v)}
                  label="Ameaca de Produtos Substitutos"
                  placeholder="Analise as alternativas disponiveis..."
                  minHeight="80px"
                />
              </div>
            </div>

            {/* Right - Buyers */}
            <div className="order-3 rounded-lg border overflow-hidden" style={{ backgroundColor: "#22C55E15" }}>
              <EditableCell
                value={data.buyers}
                onChange={(v) => update("buyers", v)}
                label="Poder de Barganha dos Compradores"
                placeholder="Analise o poder dos clientes..."
                minHeight="120px"
              />
            </div>
          </div>

          {/* Arrows for desktop */}
          <div className="hidden md:flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Forcas laterais pressionam o centro</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <ExportToolbar
          targetRef={diagramRef}
          fileName="5-forcas-porter"
          title="5 Forcas de Porter"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que sao as 5 Forcas de Porter?">
        <p>
          O modelo das 5 Forcas de Porter e uma ferramenta de analise competitiva que examina cinco
          forcas que determinam a intensidade da competicao e a atratividade de um mercado ou industria.
          O modelo ajuda empresas a entender a estrutura do seu setor e a formular estrategias adequadas.
        </p>

        <h3>Origem e Historia</h3>
        <p>
          O modelo foi desenvolvido por Michael E. Porter, professor da Harvard Business School, e
          publicado pela primeira vez no artigo "How Competitive Forces Shape Strategy" na Harvard
          Business Review em 1979. Porter expandiu o conceito em seu livro "Competitive Strategy:
          Techniques for Analyzing Industries and Competitors" (1980), que se tornou um dos livros
          de negocios mais influentes do seculo XX.
        </p>

        <h3>As Cinco Forcas</h3>
        <ul>
          <li><strong>Rivalidade entre Concorrentes:</strong> A forca central. Quanto mais intensa a competicao, menor a lucratividade do setor.</li>
          <li><strong>Ameaca de Novos Entrantes:</strong> Novas empresas trazem capacidade adicional e pressao sobre precos. Barreiras de entrada determinam essa ameaca.</li>
          <li><strong>Ameaca de Produtos Substitutos:</strong> Produtos de outros setores que atendem a mesma necessidade limitam os precos e a lucratividade.</li>
          <li><strong>Poder de Barganha dos Fornecedores:</strong> Fornecedores poderosos podem elevar custos ou reduzir a qualidade dos insumos.</li>
          <li><strong>Poder de Barganha dos Compradores:</strong> Clientes poderosos podem forcar precos para baixo ou exigir mais qualidade.</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          Use as 5 Forcas de Porter ao avaliar a entrada em um novo mercado, analisar a competitividade
          do seu setor atual, ou ao formular estrategias para melhorar a posicao competitiva da sua empresa.
        </p>

        <p className="text-xs mt-6">
          Fonte: Porter, Michael E. (1979). "How Competitive Forces Shape Strategy." Harvard
          Business Review. | Porter, Michael E. (1980). Competitive Strategy: Techniques for
          Analyzing Industries and Competitors. Free Press.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
