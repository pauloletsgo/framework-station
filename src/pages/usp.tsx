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
            placeholder="Titulo"
          />

          <div className="space-y-6">
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#3B82F615" }}>
              <label className="text-sm font-semibold block mb-2">
                Para <span className="text-muted-foreground font-normal">(publico-alvo)</span>
              </label>
              <Textarea
                value={data.audience}
                onChange={(e) => update("audience", e.target.value)}
                placeholder="Descreva quem e o seu publico-alvo..."
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
                placeholder="Qual problema ou necessidade seu publico enfrenta..."
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0"
                rows={2}
              />
            </div>

            <div className="rounded-lg border p-4" style={{ backgroundColor: "#22C55E15" }}>
              <label className="text-sm font-semibold block mb-2">
                O nosso <span className="text-muted-foreground font-normal">(produto/servico e categoria)</span>
              </label>
              <Textarea
                value={data.product}
                onChange={(e) => update("product", e.target.value)}
                placeholder="Nome do produto ou servico e sua categoria..."
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0"
                rows={2}
              />
            </div>

            <div className="rounded-lg border p-4" style={{ backgroundColor: "#F59E0B15" }}>
              <label className="text-sm font-semibold block mb-2">
                Que <span className="text-muted-foreground font-normal">(beneficio principal / diferencial)</span>
              </label>
              <Textarea
                value={data.benefit}
                onChange={(e) => update("benefit", e.target.value)}
                placeholder="O que torna unico e diferente da concorrencia..."
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

      <SeoContentSection title="O que e Unique Selling Proposition (USP)?">
        <p>
          A Unique Selling Proposition (USP), ou Proposta Unica de Valor, e o fator ou beneficio
          que torna um produto ou servico diferente e melhor que os concorrentes. E a razao principal
          pela qual um cliente deve escolher sua oferta em vez das alternativas.
        </p>

        <h3>Origem e Historia</h3>
        <p>
          O conceito de USP foi desenvolvido por Rosser Reeves, publicitario americano e presidente
          da agencia Ted Bates & Company, na decada de 1940. Reeves formalizou a ideia em seu livro
          "Reality in Advertising" (1961), onde argumentou que cada anuncio deve fazer uma proposicao
          especifica ao consumidor: "Compre este produto e voce tera este beneficio especifico."
        </p>

        <h3>Os Tres Principios da USP</h3>
        <ol>
          <li>Cada anuncio deve fazer uma proposicao ao consumidor — nao apenas palavras, nao apenas exagero, mas um beneficio concreto.</li>
          <li>A proposicao deve ser unica — algo que a concorrencia nao oferece ou nao pode oferecer.</li>
          <li>A proposicao deve ser forte o suficiente para mover milhoes — atrair novos clientes.</li>
        </ol>

        <h3>Quando Usar</h3>
        <p>
          Use o framework USP ao lancar um novo produto, reposicionar uma marca, criar campanhas
          de marketing, ou quando precisar comunicar claramente por que os clientes devem escolher
          voce.
        </p>

        <p className="text-xs mt-6">
          Fonte: Reeves, Rosser (1961). Reality in Advertising. Alfred A. Knopf.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
