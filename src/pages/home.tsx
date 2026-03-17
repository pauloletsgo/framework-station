import { useState, useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { FrameworkCard } from "@/components/shared/framework-card";
import { SearchFilterBar } from "@/components/shared/search-filter-bar";
import { frameworks } from "@/data/frameworks-catalog";

export function HomePage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return frameworks;
    const term = search.toLowerCase();
    return frameworks.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term) ||
        f.tags.some((t) => t.toLowerCase().includes(term))
    );
  }, [search]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-12 sm:py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Framework Station
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ferramentas interativas dos principais frameworks de negócios,
            marketing e estratégia. Escolha, preencha e exporte &mdash; tudo
            direto no seu navegador.
          </p>
          <div className="pt-4">
            <SearchFilterBar value={search} onChange={setSearch} />
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((framework) => (
              <FrameworkCard key={framework.slug} framework={framework} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhuma ferramenta encontrada para "{search}".
          </p>
        )}
      </section>
    </PageLayout>
  );
}
