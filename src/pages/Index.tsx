import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExtractionLog } from "@/components/ExtractionLog";
import { DetectionResults } from "@/components/DetectionResults";
import { DataDisplay } from "@/components/DataDisplay";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAndExtractSchema,
  simulateDataLayerExtraction,
} from "@/lib/schemaExtractor";
import { Tag, Rocket, AlertCircle, CheckCircle, Github } from "lucide-react";
import heroImage from "@/assets/hero-abstract.png";

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
      <Header />

      {/* Main Content with Side Image */}
      <main className="min-h-screen flex pt-16">
        {/* Left Content - Tool */}
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Hero Title */}
            <div className="mb-8 animate-fade-in">
              <span className="badge-pill mb-4 inline-block">Fast & Secure</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight mb-4">
                DataLayer and<br />
                <span className="text-muted-foreground">Schema.Org Extraction</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Extract DataLayer implementations and Schema.org structured data from any website.
              </p>
            </div>

            {/* Instructions */}
            <div className="glass-card p-5 mb-6 border-l-4 border-l-accent">
              <h3 className="text-foreground font-semibold mb-2 text-sm">How to use:</h3>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-sm">
                <li>Enter a website URL below</li>
                <li>Choose your extraction method</li>
                <li>View the extracted DataLayer or Schema.org data</li>
              </ol>
            </div>

            {/* URL Input */}
            <div className="mb-6">
              <label className="block text-foreground font-medium mb-2 text-sm">
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
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="method-card">
                <Tag className="w-7 h-7 text-accent mx-auto mb-3" />
                <h4 className="text-foreground font-semibold mb-2 text-sm">Schema.org Scan</h4>
                <p className="text-muted-foreground text-xs mb-4">
                  Extract JSON-LD structured data from HTML source
                </p>
                <Button
                  variant="outline"
                  onClick={extractSchemaOrg}
                  disabled={isLoading}
                  className="w-full"
                  size="sm"
                >
                  Run Schema Scan
                </Button>
              </div>
              <div className="method-card">
                <Rocket className="w-7 h-7 text-success mx-auto mb-3" />
                <h4 className="text-foreground font-semibold mb-2 text-sm">DataLayer Scan</h4>
                <p className="text-muted-foreground text-xs mb-4">
                  Simulates browser execution to capture DataLayers
                </p>
                <Button
                  variant="success"
                  onClick={extractDataLayer}
                  disabled={isLoading}
                  className="w-full"
                  size="sm"
                >
                  Run DataLayer Scan
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSpinner text={loadingText} />}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in text-sm">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-success/10 border border-success/30 text-success rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in text-sm">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Current URL Display */}
            {currentUrl && !isLoading && (
              <div className="bg-accent/10 rounded-lg p-3 mb-6 font-mono text-xs text-foreground break-all animate-fade-in">
                Scanning: <span className="text-accent">{currentUrl}</span>
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
            <footer className="py-6 mt-8 border-t border-border">
              <a
                href="https://github.com/alaric-visi/datalayer-scout/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </footer>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block w-1/2 relative">
          <img
            src={heroImage}
            alt="Abstract data visualization"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
        </div>
      </main>
    </div>
  );
};

export default Index;
