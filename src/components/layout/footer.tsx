import { useState } from "react";
import { Mail, Linkedin, Heart, Copy, Check } from "lucide-react";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "contato.frameworkstation@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t mt-auto py-8 px-4">
      <div className="max-w-4xl mx-auto text-sm text-muted-foreground space-y-6">
        {/* Descrição */}
        <p className="text-center">
          Framework Station &mdash; Ferramentas interativas de frameworks de negócios, marketing e estratégia.
        </p>

        {/* Duas colunas: Contato + Apoie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Contato */}
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="font-semibold text-foreground">
              Dúvidas ou Sugestões
            </p>
            <div className="space-y-1">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                {email}
              </a>
              <br />
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
          </div>

          {/* Apoie */}
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="font-semibold text-foreground inline-flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-500" />
              Apoie este projeto
            </p>
            <p className="max-w-xs text-justify">
              Divulgue nosso site ou faça um PIX de qualquer valor para mantê-lo funcionando e evoluindo:
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-muted-foreground/30 hover:border-muted-foreground/60 hover:text-foreground transition-colors text-xs"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {email}
              <span className="text-muted-foreground/60">
                {copied ? "copiado!" : "copiar"}
              </span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center">
          &copy; {new Date().getFullYear()} frameworkstation.com.br
        </p>
      </div>
    </footer>
  );
}
