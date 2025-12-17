import { GoogleGenAI, Type } from "@google/genai";
import { AuditResults } from "../types.js";

export async function runAIAudit(codebaseContext: string, extractedFileCount: number, extractedSizeBytes: number): Promise<AuditResults> {
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
    model: "gemini-1.5-flash",
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
