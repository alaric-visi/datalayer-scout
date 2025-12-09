import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/StatsBar";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-abstract.png";

interface HeroSectionProps {
  onSchemaClick: () => void;
  onDataLayerClick: () => void;
}

export const HeroSection = ({ onSchemaClick, onDataLayerClick }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="relative z-10 animate-fade-in">
          <span className="badge-pill mb-6">Fast & Secure</span>
          
          <h1 className="text-hero text-foreground mb-6">
            Your One-Stop<br />
            <span className="text-muted-foreground">Data Hub</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
            Extract DataLayer implementations and Schema.org structured data from any website with precision.
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={onSchemaClick} className="gap-2">
              Schema Scan
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="secondary" onClick={onDataLayerClick}>
              DataLayer Scan
            </Button>
          </div>

          <StatsBar />
        </div>

        {/* Right Image */}
        <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 animate-fade-in-right">
          <div className="relative h-full min-h-[500px] lg:min-h-full">
            <img 
              src={heroImage} 
              alt="Abstract data visualization" 
              className="w-full h-full object-cover lg:object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent lg:block hidden" />
          </div>
        </div>
      </div>
    </section>
  );
};
