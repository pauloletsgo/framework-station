import type { ReactNode } from "react";

interface SeoContentSectionProps {
  title: string;
  children: ReactNode;
}

export function SeoContentSection({ title, children }: SeoContentSectionProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-4 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
        {children}
      </div>
    </section>
  );
}
