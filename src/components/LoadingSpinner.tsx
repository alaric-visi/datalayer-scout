interface LoadingSpinnerProps {
  text: string;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <div className="glass-card p-8 text-center animate-fade-in">
      <div className="w-10 h-10 border-3 border-muted border-t-primary rounded-full animate-spin-slow mx-auto mb-4" 
           style={{ borderWidth: '3px' }} />
      <p className="text-foreground">{text}</p>
    </div>
  );
};
