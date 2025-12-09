interface SchemaData {
  data: Record<string, unknown>;
  context: string;
  type: string;
}

interface DataDisplayProps {
  schemaData: SchemaData[];
  dataLayerData: Record<string, unknown>[];
  mode: "schema" | "dataLayer" | null;
}

export const DataDisplay = ({ schemaData, dataLayerData, mode }: DataDisplayProps) => {
  if (!mode) return null;

  if (mode === "schema" && schemaData.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="text-4xl mb-4 opacity-50">📊</div>
        <p className="text-muted-foreground">No Schema.org JSON-LD data found</p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          This website may not use structured data markup
        </p>
      </div>
    );
  }

  if (mode === "dataLayer" && dataLayerData.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="text-4xl mb-4 opacity-50">📊</div>
        <p className="text-muted-foreground">No DataLayer found</p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          This website may not use Google Tag Manager
        </p>
      </div>
    );
  }

  const getDisplayType = (item: SchemaData) => {
    if (item.data["@type"]) return item.data["@type"] as string;
    if (item.data["type"]) return item.data["type"] as string;
    if (item.type === "microdata") return "Microdata";
    if (item.type === "rdfa") return "RDFa";
    return "Unknown";
  };

  return (
    <div className="glass-card p-5 max-h-[500px] overflow-y-auto animate-fade-in">
      {mode === "schema" &&
        schemaData.map((item, index) => (
          <div key={index} className="schema-item mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-accent font-semibold">
                {getDisplayType(item)}
              </span>
              <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                {item.type.toUpperCase()}
              </span>
            </div>
            <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(item.data, null, 2)}
            </pre>
            {item.context && item.context.length > 10 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground/70">
                  Context: {item.context}
                </p>
              </div>
            )}
          </div>
        ))}

      {mode === "dataLayer" &&
        dataLayerData.map((item, index) => (
          <div key={index} className="data-item mb-4 last:mb-0">
            <div className="text-primary font-semibold mb-2 text-sm">
              {index}:
            </div>
            <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        ))}
    </div>
  );
};
