import { Worker } from "bullmq";
import { Redis } from "ioredis";
import * as fs from "fs/promises";
import { AuditReport } from "./types.js";
import { extractZipFile } from "./services/zip.service.js";
import { readCodebase } from "./services/codebase.service.js";
import { runAIAudit } from "./services/ai.service.js";

const connection = new Redis({ maxRetriesPerRequest: null });

const updateProgress = async (jobId: string, progress: number, currentStage: string) => {
  const report: AuditReport = {
    jobId,
    status: "processing",
    progress,
    currentStage,
  };
  await connection.set(`audit:job:${jobId}`, JSON.stringify(report), "EX", 3600);
  console.log(`Job ${jobId}: ${currentStage} (${progress}%)`);
};

const worker = new Worker(
  "foo",
  async (job) => {
    const { jobId, filePath } = job.data;
    console.log(`Starting audit job for ID: ${jobId}, File: ${filePath}`);

    let tempExtractionDir = "";

    try {
      // Stage 1: Decompression
      await updateProgress(jobId, 15, "Decompressing repository...");
      const { tempDir, extractedFileCount, extractedSizeBytes } = await extractZipFile(jobId, filePath);
      tempExtractionDir = tempDir;
      console.log(`Job ${jobId}: Extracted ${extractedFileCount} files (${extractedSizeBytes} bytes) to ${tempDir}`);

      // Stage 2: Reading Codebase Context
      await updateProgress(jobId, 40, "Assembling codebase context...");
      const codebaseContext = await readCodebase(tempDir);

      // Stage 3: AI Analysis
      await updateProgress(jobId, 60, "AI Auditing with Gemini 3.5...");
      const aiResults = await runAIAudit(codebaseContext, extractedFileCount, extractedSizeBytes);

      // Finalizing Report
      await updateProgress(jobId, 95, "Generating comprehensive audit report...");

      const finalReport: AuditReport = {
        jobId,
        status: "completed",
        progress: 100,
        currentStage: "Audit complete",
        results: aiResults,
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
      if (tempExtractionDir) {
        try {
          await fs.rm(tempExtractionDir, { recursive: true, force: true });
          console.log(`Job ${jobId}: Cleaned up temporary directory ${tempExtractionDir}`);
        } catch (cleanupErr) {
          console.error(`Job ${jobId}: Failed to clean up ${tempExtractionDir}`, cleanupErr);
        }
      }
    }
  },
  { connection: connection as any }
);
