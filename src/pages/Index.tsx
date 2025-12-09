import { useRef } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ExtractionSection } from "@/components/ExtractionSection";
import { Github } from "lucide-react";

const Index = () => {
  const extractionRef = useRef<HTMLDivElement>(null);

  const scrollToExtraction = () => {
    extractionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSection 
        onSchemaClick={scrollToExtraction} 
        onDataLayerClick={scrollToExtraction} 
      />

      <div ref={extractionRef}>
        <ExtractionSection />
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <a
            href="https://github.com/alaric-visi/datalayer-schema-extraction/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
