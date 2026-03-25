import { Link } from "wouter";
import { frameworks } from "@/data/frameworks-catalog";

interface SeoFrameworksSectionProps {
  currentSlug?: string;
}

export function SeoFrameworksSection({ currentSlug }: SeoFrameworksSectionProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-12">
      {/* O que é o Framework Station? */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">
          O que é o Framework Station?
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
          <p>
            O <strong className="text-white">Framework Station</strong> é um hub gratuito de
            ferramentas interativas para criação de frameworks de negócios, marketing e
            estratégia. Desenvolvido para <strong className="text-white">estudantes, acadêmicos
            e profissionais</strong> das áreas de Administração, Marketing, Gestão e
            Empreendedorismo, o site elimina a necessidade de construir layouts complexos no
            PowerPoint, Canva ou Word.
          </p>
          <p>
            <strong className="text-white">Como funciona?</strong> Basta escolher o framework
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
        <h2 className="text-2xl font-bold mb-6 text-white">
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
                  isCurrent
                    ? "border-white/30 bg-white/10 cursor-default"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: fw.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-semibold text-sm leading-tight ${
                    isCurrent ? "text-white" : "text-gray-200 group-hover:text-white"
                  }`}>
                    {fw.name}
                    {isCurrent && (
                      <span className="ml-1.5 text-[10px] font-normal text-gray-400">
                        (você está aqui)
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">
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
