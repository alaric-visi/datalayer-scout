import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

interface HeaderProps {
  onSignUp?: () => void;
}

export const Header = ({ onSignUp }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-foreground" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#extract" className="nav-link nav-link-active">Extract</a>
            <a href="#schema" className="nav-link">Schema</a>
            <a href="#datalayer" className="nav-link">DataLayer</a>
          </nav>
        </div>
        <Button variant="outline" size="sm" onClick={onSignUp}>
          Get Started
        </Button>
      </div>
    </header>
  );
};
