import { GoogleGenAI, Type } from "@google/genai";
import { AuditResults } from "../types.js";

const USE_MOCK_AI = true; // Toggle this to false when you want to use the real Gemini API

export async function runAIAudit(codebaseContext: string, extractedFileCount: number, extractedSizeBytes: number): Promise<AuditResults> {
  if (USE_MOCK_AI) {
    console.log("Using static mock report due to API quota exhaustion (USE_MOCK_AI = true)...");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResults: AuditResults = {
      scores: {
        security: 60,
        performance: 98,
        seo: 50,
        codeQuality: 95
      },
      summary: {
        fileCount: extractedFileCount,
        sizeBytes: extractedSizeBytes,
        primaryLanguage: "TypeScript",
        estimatedCost: "$10,000 - $15,000"
      },
      findings: [
        {
          id: "finding-1",
          severity: "high",
          category: "Security",
          title: "Committed Git Internal Directory",
          description: "The `.git` directory containing repository configuration, history, and references was tracked and committed to the codebase. If deployed, this can expose sensitive project configurations, commit logs, and author credentials to the public.",
          file: "testing-repo-audit/.git/config"
        },
        {
          id: "finding-2",
          severity: "low",
          category: "Security",
          title: "Committed macOS Metadata Files",
          description: "Found .DS_Store file in the repository. This exposes directory structure metadata and should be excluded via .gitignore.",
          file: ".DS_Store"
        },
        {
          id: "finding-3",
          severity: "medium",
          category: "SEO",
          title: "Default Boilerplate Metadata Used",
          description: "The application is using default Create-React-App or Next.js metadata. This harms SEO as search engines will index the placeholder content.",
          file: "apps/web/app/layout.tsx"
        },
        {
          id: "finding-4",
          severity: "info",
          category: "Code Quality",
          title: "Placeholder Landing Page",
          description: "The landing page contains generic boilerplate code which should be updated with actual project content before production release.",
          file: "apps/web/app/page.tsx"
        }
      ]
    };

    return mockResults;
  }

  // --- REAL GEMINI API CALL LOGIC ---
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a Senior Code Auditor. Analyze the following codebase and provide a comprehensive audit report.
  Evaluate the code on Security, Performance, SEO, and Code Quality.
  Also, provide an estimated cost to build this project from scratch based on its complexity.
  
  CODEBASE:
  ${codebaseContext}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              security: { type: Type.INTEGER, description: "Score out of 100" },
              performance: { type: Type.INTEGER, description: "Score out of 100" },
              seo: { type: Type.INTEGER, description: "Score out of 100" },
              codeQuality: { type: Type.INTEGER, description: "Score out of 100" },
            },
            required: ["security", "performance", "seo", "codeQuality"],
          },
          summary: {
            type: Type.OBJECT,
            properties: {
              fileCount: { type: Type.INTEGER },
              sizeBytes: { type: Type.INTEGER },
              primaryLanguage: { type: Type.STRING },
              estimatedCost: { type: Type.STRING, description: "e.g. '$10,000 - $15,000'" },
            },
            required: ["fileCount", "sizeBytes", "primaryLanguage", "estimatedCost"],
          },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["high", "medium", "low", "info"] },
                category: { type: Type.STRING, enum: ["Security", "Performance", "SEO", "Code Quality", "Cost"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                file: { type: Type.STRING },
              },
              required: ["id", "severity", "category", "title", "description", "file"],
            },
          },
        },
        required: ["scores", "summary", "findings"],
      },
    },
  });

  if (!response.text) {
    throw new Error("AI returned empty response");
  }

  const aiResults: AuditResults = JSON.parse(response.text);

  if (aiResults) {
    aiResults.summary.fileCount = extractedFileCount;
    aiResults.summary.sizeBytes = extractedSizeBytes;
  }

  return aiResults;
}
