import { Link } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <p className="text-xl text-muted-foreground mt-4 mb-8">
          Página não encontrada
        </p>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
