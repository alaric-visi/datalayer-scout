import { Database } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-6 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-foreground" />
          <span className="font-semibold text-foreground">DataLayer Extractor</span>
        </div>
      </div>
    </header>
  );
};
