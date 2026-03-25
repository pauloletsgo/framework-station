import { useState } from "react";
import { Mail, Linkedin, Heart, Copy, Check } from "lucide-react";

interface FooterProps {
  darkMode?: boolean;
}

export function Footer({ darkMode = true }: FooterProps) {
  const [copied, setCopied] = useState(false);
  const email = "contato.frameworkstation@gmail.com";

  const textColor = darkMode ? "#9ca3af" : "#4b5563";
  const headingColor = darkMode ? "#f3f4f6" : "#111827";
  const hoverColor = darkMode ? "#f3f4f6" : "#111827";
  const borderColor = darkMode ? "rgba(156,163,175,0.3)" : "rgba(75,85,99,0.3)";
  const borderHoverColor = darkMode ? "rgba(156,163,175,0.6)" : "rgba(75,85,99,0.6)";

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
    <footer
      className="border-t mt-auto py-8 px-4"
      style={{
        color: textColor,
        borderColor: borderColor,
      }}
    >
      <div className="max-w-4xl mx-auto text-sm space-y-6">
        {/* Descrição */}
        <p className="text-center">
          Framework Station &mdash; Ferramentas interativas de frameworks de negócios, marketing e estratégia.
        </p>

        {/* Duas colunas: Contato + Apoie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Contato */}
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="font-semibold" style={{ color: headingColor }}>
              Dúvidas ou Sugestões
            </p>
            <div className="space-y-1">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textColor}
              >
                <Mail className="w-4 h-4" />
                {email}
              </a>
              <br />
              <a
                href="https://www.linkedin.com/in/paulormoreira/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textColor}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Apoie */}
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="font-semibold inline-flex items-center gap-1.5" style={{ color: headingColor }}>
              <Heart className="w-4 h-4 text-pink-500" />
              Apoie este projeto
            </p>
            <p className="max-w-xs text-justify">
              Divulgue nosso site ou faça um PIX de qualquer valor para mantê-lo funcionando e evoluindo:
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors text-xs"
              style={{ borderColor: borderColor }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = borderHoverColor; e.currentTarget.style.color = hoverColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textColor; }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {email}
              <span style={{ opacity: 0.6 }}>
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
