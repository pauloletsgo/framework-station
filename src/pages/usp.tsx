import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Textarea } from "@/components/ui/textarea";

interface UspData {
  title: string;
  audience: string;
  need: string;
  product: string;
  benefit: string;
}

const defaultData: UspData = {
  title: "Unique Selling Proposition",
  audience: "",
  need: "",
  product: "",
  benefit: "",
};

export function UspPage() {
  const [data, setData] = useLocalStorage<UspData>("fs_usp_data", defaultData);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "USP Framework - Framework Station";
  }, []);

  const update = (field: keyof UspData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const preview = [
    data.audience && `Para ${data.audience}`,
    data.need && `que ${data.need}`,
    data.product && `${data.product}`,
    data.benefit && `que ${data.benefit}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div ref={canvasRef} className="bg-background p-4 sm:p-8 rounded-xl">
          <input
            type="text"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className="text-xl sm:text-2xl font-bold text-center w-full bg-transparent outline-none mb-6 sm:mb-8 text-foreground"
            placeholder="Título"
          />

          <div className="space-y-6">
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#3B82F615" }}>
              <label className="text-sm font-semibold block mb-2">
                Para <span className="text-muted-foreground font-normal">(público-alvo)</span>
              </label>
              <Textarea
                value={data.audience}
                onChange={(e) => update("audience", e.target.value)}
                placeholder="Descreva quem é o seu público-alvo..."
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0"
                rows={2}
              />
            </div>

            <div className="rounded-lg border p-4" style={{ backgroundColor: "#8B5CF615" }}>
              <label className="text-sm font-semibold block mb-2">
                Que <span className="text-muted-foreground font-normal">(necessidade/problema)</span>
              </label>
              <Textarea
                value={data.need}
                onChange={(e) => update("need", e.target.value)}
                placeholder="Qual problema ou necessidade seu público enfrenta..."
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0"
                rows={2}
              />
            </div>

            <div className="rounded-lg border p-4" style={{ backgroundColor: "#22C55E15" }}>
              <label className="text-sm font-semibold block mb-2">
                O nosso <span className="text-muted-foreground font-normal">(produto/serviço e categoria)</span>
              </label>
              <Textarea
                value={data.product}
                onChange={(e) => update("product", e.target.value)}
                placeholder="Nome do produto ou serviço e sua categoria..."
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0"
                rows={2}
              />
            </div>

            <div className="rounded-lg border p-4" style={{ backgroundColor: "#F59E0B15" }}>
              <label className="text-sm font-semibold block mb-2">
                Que <span className="text-muted-foreground font-normal">(benefício principal / diferencial)</span>
              </label>
              <Textarea
                value={data.benefit}
                onChange={(e) => update("benefit", e.target.value)}
                placeholder="O que torna único e diferente da concorrência..."
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0"
                rows={2}
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 sm:p-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Sua USP
                </p>
                <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                  {preview}.
                </p>
              </div>
            )}
          </div>
        </div>

        <ExportToolbar
          targetRef={canvasRef}
          fileName="usp-framework"
          title="USP Framework"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que é Unique Selling Proposition (USP)?">
        <p>
          A Unique Selling Proposition (USP), ou Proposta Única de Valor, é o fator ou benefício
          que torna um produto ou serviço diferente e melhor que os concorrentes. É a razão principal
          pela qual um cliente deve escolher sua oferta em vez das alternativas.
        </p>

        <h3>Origem e História</h3>
        <p>
          O conceito de USP foi desenvolvido por Rosser Reeves, publicitário americano e presidente
          da agência Ted Bates & Company, na década de 1940. Reeves formalizou a ideia em seu livro
          "Reality in Advertising" (1961), onde argumentou que cada anúncio deve fazer uma proposição
          específica ao consumidor: "Compre este produto e você terá este benefício específico."
        </p>

        <h3>Os Três Princípios da USP</h3>
        <ol>
          <li>Cada anúncio deve fazer uma proposição ao consumidor — não apenas palavras, não apenas exagero, mas um benefício concreto.</li>
          <li>A proposição deve ser única — algo que a concorrência não oferece ou não pode oferecer.</li>
          <li>A proposição deve ser forte o suficiente para mover milhões — atrair novos clientes.</li>
        </ol>

        <h3>Quando Usar</h3>
        <p>
          Use o framework USP ao lançar um novo produto, reposicionar uma marca, criar campanhas
          de marketing, ou quando precisar comunicar claramente por que os clientes devem escolher
          você.
        </p>

        <p className="text-xs mt-6">
          Fonte: Reeves, Rosser (1961). Reality in Advertising. Alfred A. Knopf.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
