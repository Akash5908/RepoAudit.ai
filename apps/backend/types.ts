export interface AuditResults {
  scores: {
    security: number;
    performance: number;
    seo: number;
    codeQuality: number;
  };
  summary: {
    fileCount: number;
    sizeBytes: number;
    primaryLanguage: string;
    estimatedCost?: string;
  };
  findings: Array<{
    id: string;
    severity: "high" | "medium" | "low" | "info";
    category: "Security" | "Performance" | "SEO" | "Code Quality" | "Cost";
    title: string;
    description: string;
    file?: string;
  }>;
}

export interface AuditReport {
  jobId: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  currentStage: string;
  results?: AuditResults;
}
