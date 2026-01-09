# Repo Audit AI - Backend

This is the backend service for the Repo Audit AI platform. It handles file uploads, repository extraction, background processing, and AI-powered codebase auditing.

## Architecture & Integrations

### 1. File Uploads (`multer`)
We use `multer` to handle incoming `.zip` file uploads from the frontend. It automatically writes the uploaded zip files to a temporary directory (`/tmp/uploads/`) and we've added a file filter to ensure only `.zip` files are accepted, preventing malicious or incorrect file types from being processed.

### 2. Background Jobs (`bullmq` & `ioredis`)
Codebase auditing can take anywhere from 10 seconds to several minutes depending on the size of the repository and the LLM's response time. To prevent HTTP timeouts and blockages, we use **BullMQ** backed by **Redis** to enqueue audit jobs. 
- The `/` route instantly returns a `jobId`.
- The frontend polls the `/status/:jobId` route to get real-time progress updates.

### 3. Zip Extraction (`adm-zip`)
We integrated `adm-zip` to extract the uploaded repositories. We chose `adm-zip` because it allows us to read the zip entries *in memory* and filter them out before writing to the disk. We aggressively filter out heavy, unnecessary directories like `node_modules`, `.git`, `.next`, and `dist` using a Regex pattern. This saves massive amounts of disk I/O and speeds up the entire pipeline.

### 4. AI Auditing (Google Gemini 1.5 Flash)
We chose **Gemini 1.5 Flash** (via `@google/genai`) to power the actual code auditing for a few critical reasons:
- **Massive Context Window**: Codebases are huge. Gemini supports up to 1M+ tokens, which allows us to concatenate all the extracted source code into a single prompt without complex chunking or RAG pipelines.
- **Cost Estimation**: The LLM analyzes the complexity of the codebase and provides a monetary estimate for how much it would cost to build the project from scratch.
- **Structured Outputs**: We enforce a strict JSON Schema (`responseSchema`) in our Gemini configuration. This guarantees that the LLM's output perfectly matches our Typescript `AuditReport` interface, ensuring the frontend never crashes from malformed data.

## Environment Variables
See `.env.example` for the required configuration. You MUST provide a `GEMINI_API_KEY` for the worker to function.
