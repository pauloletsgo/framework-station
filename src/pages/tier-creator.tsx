import { useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { TierListTool } from "@/components/tier-creator/tier-list-tool";
import { SeoContentSection } from "@/components/shared/seo-content-section";

export function TierCreatorPage() {
  useEffect(() => {
    document.title = "Tier Creator - Framework Station";
  }, []);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <TierListTool />
      </div>

      <SeoContentSection title="O que e um Tier Creator?">
        <p>
          Um Tier Creator (criador de tiers ou classificacoes) e uma ferramenta que permite
          organizar itens — como produtos, personagens, opcoes ou qualquer coisa — em niveis
          hierarquicos, geralmente de S (melhor) a D ou F (pior).
        </p>

        <h3>Como Funciona</h3>
        <ul>
          <li>Adicione imagens dos itens que deseja classificar (via upload ou URL)</li>
          <li>Arraste e solte cada item no nivel desejado (S, A, B, C, D)</li>
          <li>Personalize cores, labels e quantidade de niveis</li>
          <li>Exporte sua tier list como imagem PNG para compartilhar</li>
        </ul>

        <h3>Quando Usar</h3>
        <p>
          Tier lists sao populares para comparar e classificar qualquer tipo de item de forma
          visual e intuitiva — desde produtos e servicos ate ideias e prioridades de projeto.
        </p>
      </SeoContentSection>
    </PageLayout>
  );
}
