import { Link } from "wouter";
import { frameworks } from "@/data/frameworks-catalog";

interface SeoFrameworksSectionProps {
  currentSlug?: string;
  darkMode?: boolean;
}

export function SeoFrameworksSection({ currentSlug, darkMode = true }: SeoFrameworksSectionProps) {
  // Use exact same color palette as SeoContentSection
  const headingColor = darkMode ? "#f3f4f6" : "#111827";
  const bodyColor = darkMode ? "#d1d5db" : "#374151";
  const strongColor = darkMode ? "#f3f4f6" : "#111827";
  const cardBorder = darkMode
    ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
    : "border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400";
  const cardBorderCurrent = darkMode
    ? "border-white/30 bg-white/10 cursor-default"
    : "border-gray-400 bg-gray-200 cursor-default";
  const cardTitleColor = darkMode ? "#e5e7eb" : "#374151";
  const cardTitleHoverColor = darkMode ? "#ffffff" : "#111827";
  const cardTitleCurrentColor = darkMode ? "#ffffff" : "#111827";
  const cardDescColor = darkMode ? "#9ca3af" : "#6b7280";
  const badgeColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-12">
      {/* O que é o Framework Station? */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: headingColor }}>
          O que é o Framework Station?
        </h2>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: bodyColor }}>
          <p>
            O <strong style={{ color: strongColor }}>Framework Station</strong> é um hub gratuito de
            ferramentas interativas para criação de frameworks de negócios, marketing e
            estratégia. Desenvolvido para <strong style={{ color: strongColor }}>estudantes, acadêmicos
            e profissionais</strong> das áreas de Administração, Marketing, Gestão e
            Empreendedorismo, o site elimina a necessidade de construir layouts complexos no
            PowerPoint, Canva ou Word.
          </p>
          <p>
            <strong style={{ color: strongColor }}>Como funciona?</strong> Basta escolher o framework
            desejado, inserir seu conteúdo diretamente nos campos interativos e fazer o download
            em PNG ou imprimir. Sem cadastro, sem complicação — é preencher e baixar.
          </p>
          <p>
            Ideal para quem precisa entregar trabalhos acadêmicos, montar apresentações
            estratégicas, preparar reuniões de planejamento ou simplesmente organizar ideias
            de forma visual e profissional.
          </p>
        </div>
      </div>

      {/* Frameworks disponíveis */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: headingColor }}>
          Conheça todos os frameworks disponíveis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {frameworks.map((fw) => {
            const Icon = fw.icon;
            const isCurrent = fw.slug === currentSlug;

            return (
              <Link
                key={fw.slug}
                href={`/${fw.slug}`}
                className={`group flex items-start gap-3 rounded-lg border p-4 transition-all ${
                  isCurrent ? cardBorderCurrent : cardBorder
                }`}
              >
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: fw.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-semibold text-sm leading-tight transition-colors"
                    style={{
                      color: isCurrent ? cardTitleCurrentColor : cardTitleColor,
                    }}
                    onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.color = cardTitleHoverColor; }}
                    onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.color = cardTitleColor; }}
                  >
                    {fw.name}
                    {isCurrent && (
                      <span
                        className="ml-1.5 text-[10px] font-normal"
                        style={{ color: badgeColor }}
                      >
                        (você está aqui)
                      </span>
                    )}
                  </h3>
                  <p
                    className="text-xs mt-1 leading-snug"
                    style={{ color: cardDescColor }}
                  >
                    {fw.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
