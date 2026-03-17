import { useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ExportToolbar } from "@/components/shared/export-toolbar";
import { SeoContentSection } from "@/components/shared/seo-content-section";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Textarea } from "@/components/ui/textarea";

interface GoldenCircleData {
  title: string;
  why: string;
  how: string;
  what: string;
}

const defaultData: GoldenCircleData = {
  title: "Golden Circle",
  why: "",
  how: "",
  what: "",
};

export function GoldenCirclePage() {
  const [data, setData] = useLocalStorage<GoldenCircleData>("fs_golden-circle_data", defaultData);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Golden Circle - Framework Station";
  }, []);

  const update = (field: keyof GoldenCircleData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

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

          {/* Concentric circles - visual only */}
          <div className="flex items-center justify-center mb-8">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 380, height: 380, backgroundColor: "#3B82F620" }}
            >
              <span className="absolute text-xs font-bold uppercase tracking-wider text-blue-500" style={{ transform: "translateY(-170px)" }}>
                O Que (What)
              </span>
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 250, height: 250, backgroundColor: "#F59E0B20" }}
              >
                <span className="absolute text-xs font-bold uppercase tracking-wider text-amber-500" style={{ transform: "translateY(-105px)" }}>
                  Como (How)
                </span>
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 130, height: 130, backgroundColor: "#EF444420" }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                    Por Que<br /><span className="text-[10px] font-normal">(Why)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="space-y-4">
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#EF444410" }}>
              <label className="text-sm font-semibold block mb-2">
                Por Que <span className="text-muted-foreground font-normal">(Why) — O proposito</span>
              </label>
              <Textarea
                value={data.why}
                onChange={(e) => update("why", e.target.value)}
                placeholder="Qual e o proposito? Por que a organizacao existe? Qual a crenca central?"
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0 text-sm"
                rows={2}
              />
            </div>
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#F59E0B10" }}>
              <label className="text-sm font-semibold block mb-2">
                Como <span className="text-muted-foreground font-normal">(How) — O processo</span>
              </label>
              <Textarea
                value={data.how}
                onChange={(e) => update("how", e.target.value)}
                placeholder="Como voce realiza o proposito? Quais processos, valores e diferenciais?"
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0 text-sm"
                rows={2}
              />
            </div>
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#3B82F610" }}>
              <label className="text-sm font-semibold block mb-2">
                O Que <span className="text-muted-foreground font-normal">(What) — O resultado</span>
              </label>
              <Textarea
                value={data.what}
                onChange={(e) => update("what", e.target.value)}
                placeholder="O que voce faz? Quais produtos ou servicos oferece?"
                className="bg-transparent border-0 resize-none focus-visible:ring-0 p-0 text-sm"
                rows={2}
              />
            </div>
          </div>
        </div>

        <ExportToolbar
          targetRef={canvasRef}
          fileName="golden-circle"
          title="Golden Circle"
          onReset={() => setData(defaultData)}
        />
      </div>

      <SeoContentSection title="O que e o Golden Circle?">
        <p>
          O Golden Circle (Circulo Dourado) e um modelo de lideranca e comunicacao que propoe que
          organizacoes e lideres inspiradores pensam, agem e se comunicam de dentro para fora —
          comecando pelo "Por Que" (proposito), passando pelo "Como" (processo) e terminando no
          "O Que" (produto).
        </p>

        <h3>Origem e Historia</h3>
        <p>
          O conceito foi criado por Simon Sinek, autor e palestrante britanico-americano, e
          apresentado ao mundo em sua palestra TED "How Great Leaders Inspire Action" em setembro
          de 2009, que se tornou uma das palestras TED mais assistidas de todos os tempos. Sinek
          aprofundou o conceito em seu livro "Start with Why: How Great Leaders Inspire Everyone
          to Take Action" (2009).
        </p>

        <h3>Os Tres Niveis</h3>
        <ul>
          <li><strong>Por Que (Why):</strong> O proposito, a causa, a crenca. Por que a organizacao existe? Por que voce faz o que faz? Poucos sabem articular isso claramente.</li>
          <li><strong>Como (How):</strong> O processo, os valores, a proposta diferenciada. Como voce realiza o seu proposito? E o que torna a abordagem unica.</li>
          <li><strong>O Que (What):</strong> Os produtos, servicos e resultados tangíveis. Toda organizacao sabe O QUE faz. E o nivel mais externo e obvio.</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          O Golden Circle e ideal para definir o proposito de uma marca, alinhar equipes em torno
          de uma visao, criar mensagens de marketing inspiradoras e repensar a comunicacao
          estrategica de qualquer organizacao.
        </p>

        <p className="text-xs mt-6">
          Fonte: Sinek, Simon (2009). Start with Why: How Great Leaders Inspire Everyone to Take
          Action. Portfolio/Penguin. | TED Talk: "How Great Leaders Inspire Action" (2009).
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
