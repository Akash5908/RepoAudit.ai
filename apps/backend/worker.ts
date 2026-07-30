import { Worker } from "bullmq";
import { Redis } from "ioredis";
import AdmZip from "adm-zip";
import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";

const connection = new Redis({ maxRetriesPerRequest: null });

interface AuditReport {
  jobId: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  currentStage: string;
  results?: {
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
    };
    findings: Array<{
      id: string;
      severity: "high" | "medium" | "low" | "info";
      category: "Security" | "Performance" | "SEO" | "Code Quality";
      title: string;
      description: string;
      file?: string;
    }>;
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
  "foo",
  async (job) => {
    const { jobId, filePath } = job.data;
    console.log(`Starting audit job for ID: ${jobId}, File: ${filePath}`);

    let tempDir = "";
    let extractedFileCount = 0;
    let extractedSizeBytes = 0;

    try {
      let progressReport: AuditReport = {
        jobId,
        status: "processing",
        progress: 15,
        currentStage: "Decompressing repository...",
      };
      await connection.set(`audit:job:${jobId}`, JSON.stringify(progressReport), "EX", 3600);
      console.log(`Job ${jobId}: Decompressing repository... (15%)`);

      // 1. Decompressing and filtering
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `repo-audit-${jobId}-`));
      
      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();
      
      const ignorePattern = /(?:^|\/)(node_modules|\.git|\.next|dist|build|\.DS_Store|__MACOSX)(?:\/|$)/i;
      
      for (const entry of zipEntries) {
        if (entry.entryName.match(ignorePattern)) {
          continue;
        }

        if (!entry.isDirectory) {
          extractedFileCount++;
          extractedSizeBytes += entry.header.size;
        }
        
        // Extract to tempDir
        zip.extractEntryTo(entry, tempDir, true, true);
      }

      console.log(`Job ${jobId}: Extracted ${extractedFileCount} files (${extractedSizeBytes} bytes) to ${tempDir}`);
      
      const remainingStages = [
        { name: "Performing static security scanning...", progress: 40 },
        { name: "Auditing code patterns and readability...", progress: 65 },
        { name: "Analyzing SEO and bundle optimization...", progress: 85 },
        { name: "Generating comprehensive audit report...", progress: 95 },
      ];

      for (const stage of remainingStages) {
        progressReport = {
          jobId,
          status: "processing",
          progress: stage.progress,
          currentStage: stage.name,
        };
        await connection.set(`audit:job:${jobId}`, JSON.stringify(progressReport), "EX", 3600);
        console.log(`Job ${jobId}: ${stage.name} (${stage.progress}%)`);
        await sleep(1500); // Wait 1.5 seconds per stage
      }

      // Completed with mock audit report details
      const finalReport: AuditReport = {
        jobId,
        status: "completed",
        progress: 100,
        currentStage: "Audit complete",
        results: {
          scores: {
            security: 78,
            performance: 89,
            seo: 92,
            codeQuality: 82,
          },
          summary: {
            fileCount: extractedFileCount || 42,
            sizeBytes: extractedSizeBytes || 1240500,
            primaryLanguage: "TypeScript",
          },
          findings: [
            {
              id: "sec-1",
              severity: "high",
              category: "Security",
              title: "Exposed API Keys or Secret Tokens",
              description: "A hardcoded development credentials pattern matches in \`.env.development\`. Revoke credentials immediately.",
              file: ".env.development:L12",
            },
            {
              id: "perf-1",
              severity: "medium",
              category: "Performance",
              title: "Uncompressed High-Res Imagery",
              description: "Large landing page assets are in PNG format. Convert them to modern WebP format to reduce LCP overhead by up to 74%.",
              file: "public/assets/hero.png",
            },
            {
              id: "seo-1",
              severity: "low",
              category: "SEO",
              title: "Missing Metadata and Viewport Definitions",
              description: "Root HTML layout lacks semantic search metadata description tags, diminishing search engine visibility.",
              file: "app/layout.tsx:L8",
            },
            {
              id: "code-1",
              severity: "info",
              category: "Code Quality",
              title: "Dangling Import and Unused Functions",
              description: "Unreferenced variables or imports found in application utilities file.",
              file: "lib/utils.ts:L3",
            },
          ],
        },
      };

      await connection.set(`audit:job:${jobId}`, JSON.stringify(finalReport), "EX", 3600);
      console.log(`Job ${jobId} completed successfully.`);
    } catch (err: any) {
      console.error(`Job ${jobId} failed:`, err);
      const failedReport: AuditReport = {
        jobId,
        status: "failed",
        progress: 100,
        currentStage: `Failed: ${err.message}`,
      };
      await connection.set(`audit:job:${jobId}`, JSON.stringify(failedReport), "EX", 3600);
    } finally {
      if (tempDir) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
          console.log(`Job ${jobId}: Cleaned up temporary directory ${tempDir}`);
        } catch (cleanupErr) {
          console.error(`Job ${jobId}: Failed to clean up ${tempDir}`, cleanupErr);
        }
      }
    }
  },
  { connection },
);
