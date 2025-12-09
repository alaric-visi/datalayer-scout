interface Method {
  name: string;
  found: boolean;
  details?: string;
}

interface DetectionResultsProps {
  methods: Method[];
}

export const DetectionResults = ({ methods }: DetectionResultsProps) => {
  if (methods.length === 0) return null;

  return (
    <div className="glass-card p-5 mb-6 animate-fade-in">
      <h4 className="text-foreground font-semibold mb-4">Extraction Results</h4>
      <div className="space-y-3">
        {methods.map((method, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-secondary/50 rounded-lg p-3"
          >
            <div>
              <span className="text-foreground">{method.name}</span>
              {method.details && (
                <p className="text-xs text-muted-foreground mt-1">
                  {method.details}
                </p>
              )}
            </div>
            <span
              className={`status-badge ${
                method.found ? "status-success" : "status-failed"
              }`}
            >
              {method.found ? "Found" : "Not found"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
