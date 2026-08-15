"use client";

import { useState, useEffect } from "react";
import { FileDropzone } from "./drop-zone-ui";
import { ProcessFile } from "./process-file";
import { AuditDashboard } from "./audit-dashboard";
import { SpinnerCustom } from "../ui/custom-spinner";
import { AlertCircle, Terminal } from "lucide-react";

interface DropZoneProps {
  onAuditComplete?: (report: any) => void;
}

export const DropZone = ({ onAuditComplete }: DropZoneProps) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileAccept = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
    setError(null);
  };

  const handleFileUpload = async () => {
    if (selectedFile == undefined) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`http://localhost:5001/api/v1/file-upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload the file to the auditing server.");
      }

      const data = await res.json();
      setJobId(data.jobId);
      setProgress(5);
      setStage("Queuing audit task...");
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
      setLoading(false);
    }
  };

  // Status Polling Effect
  useEffect(() => {
    if (!jobId) return;

    let timer: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/v1/file-upload/status/${jobId}`);
        if (!res.ok) {
          throw new Error("Could not fetch the status of the audit job.");
        }
        const data = await res.json();
        
        setProgress(data.progress || 0);
        setStage(data.currentStage || "Analyzing...");

        if (data.status === "completed") {
          setReport(data);
          if (onAuditComplete) {
            onAuditComplete(data);
          }
          setLoading(false);
          setJobId(null);
        } else if (data.status === "failed") {
          setError(data.currentStage || "Audit job failed.");
          setLoading(false);
          setJobId(null);
        } else {
          // Continue polling
          timer = setTimeout(pollStatus, 800);
        }
      } catch (err: any) {
        setError(err.message || "Failed to poll job status.");
        setLoading(false);
        setJobId(null);
      }
    };

    pollStatus();

    return () => clearTimeout(timer);
  }, [jobId]);

  const handleReset = () => {
    setSelectedFile(undefined);
    setLoading(false);
    setJobId(null);
    setReport(null);
    setProgress(0);
    setStage("");
    setError(null);
  };

  // Rendering report when done inside DropZone (fallback if onAuditComplete is not provided)
  if (report && !onAuditComplete) {
    return <AuditDashboard report={report} onReset={handleReset} />;
  }

  // Rendering loading screen with high-tech progress bars
  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600">
            <SpinnerCustom />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Analyzing Repository</h2>
          <p className="text-sm text-slate-500 max-w-xs">{stage}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{progress}% Completed</span>
            <span>Static Analysis Engine v1.0.0</span>
          </div>
        </div>

        {/* Pseudo Terminal Logs */}
        <div className="p-4 bg-slate-900 border border-slate-950 rounded-xl text-left font-mono text-[11px] text-emerald-450 space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-1.5 text-slate-500 border-b border-slate-800 pb-1 mb-2">
            <Terminal className="h-3.5 w-3.5 text-slate-500" />
            <span>ANALYSIS CONSOLE LOGS</span>
          </div>
          <p className="truncate text-slate-500">&gt; [OK] Connected to task runner queue.</p>
          {progress >= 15 && <p className="truncate text-indigo-300">&gt; [DECOMPRESS] Repository unpacked successfully.</p>}
          {progress >= 40 && <p className="truncate text-rose-350">&gt; [SECURITY] Scanning AST for secrets and dependencies...</p>}
          {progress >= 65 && <p className="truncate text-amber-200">&gt; [QUALITY] Verifying complexity and styling metrics...</p>}
          {progress >= 85 && <p className="truncate text-sky-200">&gt; [SEO] Inspecting layouts, accessibility, and bundle meta...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto space-y-6">
      {selectedFile ? (
        <ProcessFile
          handleRemoveFile={handleRemoveFile}
          handleFileUpload={handleFileUpload}
          selectedFile={selectedFile}
          loading={loading}
        />
      ) : (
        <FileDropzone onFileAccepted={handleFileAccept} />
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-semibold text-rose-600 animate-in fade-in duration-200 w-full max-w-xl">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
