import * as path from "path";
import * as fs from "fs/promises";

export async function readCodebase(dirPath: string): Promise<string> {
  let context = "";
  async function traverse(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else {
        // Skip binary and lock files
        if (entry.name.match(/\.(png|jpg|jpeg|gif|svg|ico|mp4|mp3|zip|pdf|lock)$/i)) continue;
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          // Skip extremely huge files to save tokens
          if (content.length > 500000) continue;

          const relativePath = path.relative(dirPath, fullPath);
          context += `\n\n=== File: ${relativePath} ===\n\n`;
          context += content;
        } catch (e) {
          // ignore read errors
        }
      }
    }
  }
  await traverse(dirPath);
  return context;
}
