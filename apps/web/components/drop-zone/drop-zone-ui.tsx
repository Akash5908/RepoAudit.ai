"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileArchive, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  maxSizeInMB?: number;
}

export function FileDropzone({ onFileAccepted, maxSizeInMB = 50 }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const MAX_SIZE = maxSizeInMB * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const reason = rejectedFiles[0].errors[0]?.code;
      if (reason === "file-too-large") {
        setError(`File size exceeds the enterprise limit of ${maxSizeInMB}MB.`);
      } else if (reason === "file-invalid-type") {
        setError("Invalid file type. Please upload a valid .zip archive.");
      } else {
        setError("Something went wrong during file ingestion.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0] as File);
    }
  }, [onFileAccepted, maxSizeInMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_SIZE,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/20 hover:border-primary/50 bg-background"
        )}
      >
        <input {...getInputProps()} />

        <div className={cn(
          "mb-4 rounded-full p-4 transition-transform duration-200 group-hover:scale-110",
          isDragActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {isDragActive ? (
            <UploadCloud className="h-10 w-10 animate-pulse" />
          ) : (
            <FileArchive className="h-10 w-10" />
          )}
        </div>

        <h3 className="mb-1 text-lg font-semibold tracking-tight">
          {isDragActive ? "Drop your archive here..." : "Drag & drop your project file"}
        </h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-xs">
          Supports compressed <code className="font-mono text-xs text-primary font-bold">.zip</code> structural repositories up to {maxSizeInMB}MB.
        </p>

        <Button type="button" variant="outline" className="pointer-events-none">
          Select File
        </Button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive animate-in fade-in-50 duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}