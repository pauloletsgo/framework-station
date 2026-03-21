import { useState, type ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
