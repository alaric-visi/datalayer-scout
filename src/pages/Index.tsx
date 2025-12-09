import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MethodCard } from "@/components/MethodCard";
import { ExtractionLog } from "@/components/ExtractionLog";
import { DetectionResults } from "@/components/DetectionResults";
import { DataDisplay } from "@/components/DataDisplay";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAndExtractSchema,
  simulateDataLayerExtraction,
} from "@/lib/schemaExtractor";
import { Tag, Rocket, Github, AlertCircle, CheckCircle } from "lucide-react";

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

interface SchemaData {
  data: Record<string, unknown>;
  context: string;
  type: string;
}

interface Method {
  name: string;
  found: boolean;
  details?: string;
}

const Index = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [methods, setMethods] = useState<Method[]>([]);
  const [schemaData, setSchemaData] = useState<SchemaData[]>([]);
  const [dataLayerData, setDataLayerData] = useState<Record<string, unknown>[]>([]);
  const [displayMode, setDisplayMode] = useState<"schema" | "dataLayer" | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: "00:00:00",
      message: "DataLayer & Schema.org Extractor Ready",
      type: "info",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addLog = useCallback(
    (message: string, type: "info" | "success" | "error") => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, { timestamp, message, type }]);
    },
    []
  );

  const resetState = () => {
    setError(null);
    setSuccess(null);
    setMethods([]);
    setSchemaData([]);
    setDataLayerData([]);
    setDisplayMode(null);
  };

  const validateUrl = (inputUrl: string): string => {
    if (!inputUrl) throw new Error("Please enter a URL");
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    new URL(formattedUrl);
    return formattedUrl;
  };

  const extractSchemaOrg = async () => {
    resetState();
    setIsLoading(true);
    setLoadingText("Scanning for Schema.org JSON-LD data...");

    try {
      const validUrl = validateUrl(url);
      setCurrentUrl(validUrl);
      addLog(`Starting Schema.org scan: ${validUrl}`, "info");

      const result = await fetchAndExtractSchema(validUrl);

      setMethods(result.methods);
      setSchemaData(result.schemaData);
      setDisplayMode("schema");

      if (result.schemaData.length > 0) {
        setSuccess(`Found ${result.schemaData.length} Schema.org items`);
        addLog(
          `Schema.org scan completed: ${result.schemaData.length} items found`,
          "success"
        );
        toast({
          title: "Success",
          description: `Found ${result.schemaData.length} Schema.org items`,
        });
      } else {
        addLog("Schema.org scan completed: No structured data found", "info");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract schema";
      setError(message);
      addLog(`Schema.org scan error: ${message}`, "error");
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractDataLayer = async () => {
    resetState();
    setIsLoading(true);

    try {
      const validUrl = validateUrl(url);
      setCurrentUrl(validUrl);
      addLog(`Starting DataLayer scan: ${validUrl}`, "info");

      const result = await simulateDataLayerExtraction(
        validUrl,
        setLoadingText,
        addLog
      );

      setMethods(result.methods);
      setDataLayerData(result.dataLayer);
      setDisplayMode("dataLayer");

      if (result.dataLayer.length > 0) {
        setSuccess(`DataLayer scan found ${result.dataLayer.length} items`);
        addLog(
          `DataLayer scan completed: ${result.dataLayer.length} items found`,
          "success"
        );
        toast({
          title: "Success",
          description: `Found ${result.dataLayer.length} DataLayer items`,
        });
      } else {
        addLog("DataLayer scan completed: No DataLayer found", "info");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract DataLayer";
      setError(message);
      addLog(`DataLayer scan error: ${message}`, "error");
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      extractDataLayer();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            DataLayer & Schema.org Extractor
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract DataLayer implementations and Schema.org structured data from any website
          </p>
        </header>

        {/* Instructions */}
        <div className="glass-card p-5 mb-8 border-l-4 border-l-primary">
          <h3 className="text-foreground font-semibold mb-2">How to use:</h3>
          <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-sm">
            <li>Enter a website URL below</li>
            <li>Choose your extraction method</li>
            <li>View the extracted DataLayer or Schema.org data</li>
          </ol>
        </div>

        {/* URL Input */}
        <div className="mb-8">
          <label className="block text-foreground font-semibold mb-2 text-sm">
            Website URL:
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Extraction Methods */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <MethodCard
            icon={<Tag className="w-8 h-8 text-primary mx-auto" />}
            title="Schema.org Scan"
            description="Extract JSON-LD structured data from HTML source"
            buttonText="Run Schema Scan"
            buttonVariant="secondary"
            onClick={extractSchemaOrg}
            disabled={isLoading}
          />
          <MethodCard
            icon={<Rocket className="w-8 h-8 text-accent mx-auto" />}
            title="DataLayer Scan"
            description="Simulates browser execution to capture dynamic DataLayers"
            buttonText="Run DataLayer Scan"
            buttonVariant="success"
            onClick={extractDataLayer}
            disabled={isLoading}
          />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner text={loadingText} />}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-accent/10 border border-accent/30 text-accent rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Current URL Display */}
        {currentUrl && !isLoading && (
          <div className="bg-primary/10 rounded-lg p-4 mb-6 font-mono text-sm text-foreground break-all animate-fade-in">
            Scanning: <span className="text-primary">{currentUrl}</span>
          </div>
        )}

        {/* Detection Results */}
        <DetectionResults methods={methods} />

        {/* Data Display */}
        <DataDisplay
          schemaData={schemaData}
          dataLayerData={dataLayerData}
          mode={displayMode}
        />

        {/* Extraction Log */}
        <ExtractionLog logs={logs} />

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-border">
          <a
            href="https://github.com/alaric-visi/datalayer-schema-extraction/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Index;
