import { Link } from "wouter";
import { Sun, Moon } from "lucide-react";
import { FrameworkStationIcon } from "@/components/icons/framework-station-icon";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <FrameworkStationIcon className="h-6 w-6 text-red-400" />
          <span className="font-semibold text-lg">Framework Station</span>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="bg-background/50 hover:bg-background/80"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
