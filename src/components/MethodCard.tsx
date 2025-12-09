import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface MethodCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "success" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  onClick: () => void;
  disabled?: boolean;
}

export const MethodCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonVariant = "default",
  onClick,
  disabled,
}: MethodCardProps) => {
  return (
    <div className="method-card">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-foreground font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <Button
        variant={buttonVariant}
        onClick={onClick}
        disabled={disabled}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
};
