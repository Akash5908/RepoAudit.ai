import AdmZip from "adm-zip";
import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";

export async function extractZipFile(
  jobId: string,
  filePath: string
): Promise<{ tempDir: string; extractedFileCount: number; extractedSizeBytes: number }> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `repo-audit-${jobId}-`));
  let extractedFileCount = 0;
  let extractedSizeBytes = 0;

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

    zip.extractEntryTo(entry, tempDir, true, true);
  }

  return { tempDir, extractedFileCount, extractedSizeBytes };
}
