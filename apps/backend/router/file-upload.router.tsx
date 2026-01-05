import express, { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Queue } from "bullmq";
import { Redis } from "ioredis";

const myQueue = new Queue("foo");
const router: Router = Router();
const upload = multer({ dest: "/tmp/uploads/" });
const redis = new Redis({ maxRetriesPerRequest: null });

/** Will define a post endpoint
 * It will receive the file and use multer to store in vps /tmp/uploads folder
 * And will also create a JobID using a UUID
 */
router.post("/", upload.single("file"), async (req, res) => {
  console.log(req.file, req.body);
  // Edge case: Verify a file was actually uploaded
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded. Check your field name." });
    return;
  }

  const jobId = uuidv4();

  await myQueue.add("auditWorker", { jobId: jobId, filePath: req.file.path });

  res.status(202).json({
    message: "File uploaded successfully",
    jobId: jobId,
    fileName: req.file.filename,
    originalName: req.file.originalname,
  });
});

/**
 * Status Polling Endpoint
 * Fetches the audit status and report details for a given jobId.
 */
router.get("/status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const data = await redis.get(`audit:job:${jobId}`);
    if (!data) {
       res.status(404).json({ error: "Audit job not found." });
       return;
    }
    res.json(JSON.parse(data));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as fileUploadRouter };
