import express, { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Queue } from "bullmq";

const myQueue = new Queue("foo");
const router: Router = Router();
const upload = multer({ dest: "/tmp/uploads/" });

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

export { router as fileUploadRouter };
