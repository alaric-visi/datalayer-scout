import { useRef, useEffect } from "react";

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

interface ExtractionLogProps {
  logs: LogEntry[];
}

export const ExtractionLog = ({ logs }: ExtractionLogProps) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeClass = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-accent";
      case "error":
        return "text-destructive";
      default:
        return "text-foreground/80";
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Extraction Log</h3>
      <div
        ref={logRef}
        className="bg-secondary/80 rounded-lg p-4 font-mono text-xs max-h-48 overflow-y-auto"
      >
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            <span className="text-primary">[{log.timestamp}]</span>{" "}
            <span className={getTypeClass(log.type)}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
