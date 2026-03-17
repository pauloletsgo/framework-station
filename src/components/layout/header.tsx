import { Link } from "wouter";
import { LayoutGrid } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Framework Station</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Ferramentas
          </Link>
        </nav>
      </div>
    </header>
  );
}
