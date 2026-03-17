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
            placeholder="Título"
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
                Por Que <span className="text-muted-foreground font-normal">(Why) — O propósito</span>
              </label>
              <Textarea
                value={data.why}
                onChange={(e) => update("why", e.target.value)}
                placeholder="Qual é o propósito? Por que a organização existe? Qual a crença central?"
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
                placeholder="Como você realiza o propósito? Quais processos, valores e diferenciais?"
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
                placeholder="O que você faz? Quais produtos ou serviços oferece?"
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

      <SeoContentSection title="O que é o Golden Circle?">
        <p>
          O Golden Circle (Círculo Dourado) é um modelo de liderança e comunicação que propõe que
          organizações e líderes inspiradores pensam, agem e se comunicam de dentro para fora —
          começando pelo "Por Que" (propósito), passando pelo "Como" (processo) e terminando no
          "O Que" (produto).
        </p>

        <h3>Origem e História</h3>
        <p>
          O conceito foi criado por Simon Sinek, autor e palestrante britânico-americano, e
          apresentado ao mundo em sua palestra TED "How Great Leaders Inspire Action" em setembro
          de 2009, que se tornou uma das palestras TED mais assistidas de todos os tempos. Sinek
          aprofundou o conceito em seu livro "Start with Why: How Great Leaders Inspire Everyone
          to Take Action" (2009).
        </p>

        <h3>Os Três Níveis</h3>
        <ul>
          <li><strong>Por Que (Why):</strong> O propósito, a causa, a crença. Por que a organização existe? Por que você faz o que faz? Poucos sabem articular isso claramente.</li>
          <li><strong>Como (How):</strong> O processo, os valores, a proposta diferenciada. Como você realiza o seu propósito? É o que torna a abordagem única.</li>
          <li><strong>O Que (What):</strong> Os produtos, serviços e resultados tangíveis. Toda organização sabe O QUE faz. É o nível mais externo e óbvio.</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          O Golden Circle é ideal para definir o propósito de uma marca, alinhar equipes em torno
          de uma visão, criar mensagens de marketing inspiradoras e repensar a comunicação
          estratégica de qualquer organização.
        </p>

        <p className="text-xs mt-6">
          Fonte: Sinek, Simon (2009). Start with Why: How Great Leaders Inspire Everyone to Take
          Action. Portfolio/Penguin. | TED Talk: "How Great Leaders Inspire Action" (2009).
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
