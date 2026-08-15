"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileArchive, AlertCircle, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  maxSizeInMB?: number;
}

export function FileDropzone({
  onFileAccepted,
  maxSizeInMB = 50,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const MAX_SIZE = maxSizeInMB * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0]?.code;
        if (reason === "file-too-large") {
          setError(
            `File size exceeds the enterprise limit of ${maxSizeInMB}MB.`
          );
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
    },
    [onFileAccepted, maxSizeInMB]
  );

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
      {/* Upload Box Card */}
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer bg-white border-slate-200 shadow-xl shadow-slate-200/60 hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-500/10",
          isDragActive
            ? "border-indigo-600 bg-indigo-50/50 scale-[1.02] shadow-indigo-500/20"
            : "hover:bg-slate-50/50"
        )}
      >
        <input {...getInputProps()} />

        {/* Dynamic Glowing Icon Container */}
        <div
          className={cn(
            "mb-6 rounded-2xl p-5 transition-all duration-300 shadow-sm border",
            isDragActive
              ? "bg-indigo-600 text-white border-indigo-600 rotate-6 scale-110 shadow-indigo-500/30"
              : "bg-slate-50 text-indigo-600 border-slate-200/80 group-hover:text-indigo-700 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:-translate-y-1"
          )}
        >
          {isDragActive ? (
            <UploadCloud className="h-10 w-10 animate-bounce" />
          ) : (
            <FileArchive className="h-10 w-10" />
          )}
        </div>

        <h3 className="mb-2 text-xl font-extrabold tracking-tight text-slate-900">
          {isDragActive
            ? "Drop repository archive now"
            : "Drag & drop your repository"}
        </h3>
        <p className="mb-8 text-sm text-slate-500 max-w-xs leading-relaxed">
          Upload compressed{" "}
          <code className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">.zip</code>{" "}
          archive up to {maxSizeInMB}MB.
        </p>

        {/* Tactical action button */}
        <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold tracking-wide shadow-lg shadow-indigo-600/25 group-hover:shadow-indigo-600/35 transition-all duration-300 active:scale-[0.96]">
          Select File from Disk
        </div>
      </div>

      {/* Feature List below the box */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center shadow-sm">
          <ShieldAlert className="h-4 w-4 text-rose-600 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Secret Leaks</span>
          <span className="text-[10px] text-slate-400 mt-0.5">AST scanning</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center shadow-sm">
          <Cpu className="h-4 w-4 text-indigo-600 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Code Quality</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Complexity index</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center shadow-sm">
          <Sparkles className="h-4 w-4 text-emerald-600 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Core SEO</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Metadata check</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-semibold text-rose-700 animate-in fade-in duration-200 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
