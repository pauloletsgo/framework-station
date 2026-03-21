import { Mail, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground space-y-3">
        <p>
          Framework Station &mdash; Ferramentas interativas de frameworks de negócios, marketing e estratégia.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="mailto:pauloregisml@gmail.com"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contato
          </a>
          <span className="text-muted-foreground/40">|</span>
          <a
            href="https://www.linkedin.com/in/paulormoreira/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} frameworkstation.com.br
        </p>
      </div>
    </footer>
  );
}
