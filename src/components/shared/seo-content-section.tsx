import type { ReactNode } from "react";

interface SeoContentSectionProps {
  title: string;
  children: ReactNode;
  darkMode?: boolean;
}

export function SeoContentSection({ title, children, darkMode = true }: SeoContentSectionProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
      >
        {title}
      </h2>
      <div
        className="prose prose-sm sm:prose-base max-w-none space-y-4 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        style={{
          color: darkMode ? "#d1d5db" : "#374151",
          ["--heading-color" as string]: darkMode ? "#f3f4f6" : "#111827",
          ["--strong-color" as string]: darkMode ? "#f3f4f6" : "#111827",
        }}
      >
        <style>{`
          .seo-content-body h3 { color: var(--heading-color) !important; }
          .seo-content-body strong { color: var(--strong-color) !important; }
        `}</style>
        <div className="seo-content-body">
          {children}
        </div>
      </div>
    </section>
  );
}
