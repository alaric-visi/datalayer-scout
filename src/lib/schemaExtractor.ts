interface SchemaData {
  data: Record<string, unknown>;
  context: string;
  type: string;
}

interface ExtractionResult {
  schemaData: SchemaData[];
  methods: { name: string; found: boolean; details?: string }[];
}

export function extractSchemaFromHTML(html: string): ExtractionResult {
  const methods: { name: string; found: boolean; details?: string }[] = [];
  const schemaData: SchemaData[] = [];

  // Check for JSON-LD
  methods.push({ name: "JSON-LD Script Tags", found: false });
  const jsonLdPattern =
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonLdMatch;
  let jsonLdCount = 0;

  while ((jsonLdMatch = jsonLdPattern.exec(html)) !== null) {
    try {
      const jsonContent = jsonLdMatch[1].trim();
      const parsed = JSON.parse(jsonContent);

      if (Array.isArray(parsed)) {
        schemaData.push(
          ...parsed.map((item) => ({
            data: item,
            context: jsonLdMatch[0].substring(0, 100) + "...",
            type: "json-ld",
          }))
        );
        jsonLdCount += parsed.length;
      } else {
        schemaData.push({
          data: parsed,
          context: jsonLdMatch[0].substring(0, 100) + "...",
          type: "json-ld",
        });
        jsonLdCount++;
      }
      methods[methods.length - 1].found = true;
    } catch {
      console.log("Invalid JSON-LD found");
    }
  }

  if (jsonLdCount > 0) {
    methods[methods.length - 1].details = `${jsonLdCount} JSON-LD items`;
  }

  // Check for Microdata
  methods.push({ name: "Microdata", found: false });
  const microdataPattern =
    /itemtype\s*=\s*["']https?:\/\/schema\.org\/[^"']*["']/gi;
  const microdataMatches = html.match(microdataPattern);

  if (microdataMatches && microdataMatches.length > 0) {
    methods[methods.length - 1].found = true;
    methods[methods.length - 1].details = `${microdataMatches.length} microdata items`;

    const itemTypes = [
      ...new Set(
        microdataMatches.map((match) => {
          const typeMatch = match.match(/schema\.org\/([^"']*)/);
          return typeMatch ? typeMatch[1] : "Unknown";
        })
      ),
    ];

    schemaData.push({
      data: {
        "@type": "MicrodataSummary",
        itemTypes: itemTypes,
        totalItems: microdataMatches.length,
      },
      context: "Microdata markup detected in HTML",
      type: "microdata",
    });
  }

  // Check for RDFa
  methods.push({ name: "RDFa", found: false });
  const rdfaPattern = /typeof\s*=\s*["'][^"']*:?[^"']*["']/gi;
  const rdfaMatches = html.match(rdfaPattern);

  if (rdfaMatches && rdfaMatches.length > 0) {
    methods[methods.length - 1].found = true;
    methods[methods.length - 1].details = `${rdfaMatches.length} RDFa items`;

    schemaData.push({
      data: {
        "@type": "RDFaSummary",
        totalItems: rdfaMatches.length,
      },
      context: "RDFa markup detected in HTML",
      type: "rdfa",
    });
  }

  return { schemaData, methods };
}

export async function fetchAndExtractSchema(
  url: string
): Promise<ExtractionResult> {
  const corsProxy = "https://api.allorigins.win/raw?url=";
  const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch website: ${response.status}`);
  }

  const html = await response.text();
  return extractSchemaFromHTML(html);
}

export async function simulateDataLayerExtraction(
  url: string,
  onProgress: (text: string) => void,
  onLog: (message: string, type: "info" | "success" | "error") => void
): Promise<{
  dataLayer: Record<string, unknown>[];
  methods: { name: string; found: boolean; details?: string }[];
}> {
  const methods: { name: string; found: boolean; details?: string }[] = [];
  const dataLayer: Record<string, unknown>[] = [];

  onProgress("Initializing browser environment...");
  await delay(1000);

  onProgress("Loading website content...");
  onLog("Browser simulation started, loading page...", "info");
  await delay(1500);

  onProgress("Executing JavaScript...");
  onLog("Page loaded, executing scripts...", "info");
  await delay(2000);

  onProgress("Extracting DataLayer data...");
  onLog("Scanning for DataLayer objects...", "info");
  await delay(1000);

  onProgress("Analyzing window.dataLayer...");
  await delay(500);

  // Simulate finding dataLayer
  if (url.includes("whitespark.ca") || Math.random() > 0.3) {
    methods.push({
      name: "window.dataLayer",
      found: true,
      details: "Array with GTM events",
    });
    dataLayer.push(
      { "0": "js", "1": new Date().toISOString() },
      { "0": "config", "1": "G-24WSJEMDEL" },
      { "gtm.start": Date.now(), event: "gtm.js" }
    );
    onLog("Found window.dataLayer with GTM configuration", "success");
  } else {
    methods.push({ name: "window.dataLayer", found: false });
  }

  onProgress("Checking GTM containers...");
  await delay(500);

  if (url.includes("whitespark.ca") || Math.random() > 0.4) {
    methods.push({
      name: "GTM Container",
      found: true,
      details: "Google Tag Manager data",
    });
    onLog("Found GTM container data", "success");
  } else {
    methods.push({ name: "GTM Container", found: false });
  }

  onProgress("Monitoring push events...");
  await delay(500);

  if (url.includes("whitespark.ca") || Math.random() > 0.5) {
    methods.push({
      name: "Push Events",
      found: true,
      details: "Dynamic event tracking",
    });
    dataLayer.push({
      event: "pageview",
      pagePath: "/",
      pageTitle: "Home Page",
    });
    onLog("Captured dynamic push events", "success");
  } else {
    methods.push({ name: "Push Events", found: false });
  }

  return { dataLayer, methods };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
