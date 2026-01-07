"use client";

import React, { useState } from "react";
import {
  Shield,
  Zap,
  Search,
  Code,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  FileCode2,
  HardDrive,
  Server,
  Filter,
  Lightbulb,
  AlertOctagon,
  AlertTriangle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Finding {
  id: string;
  severity: "high" | "medium" | "low" | "info";
  category: "Security" | "Performance" | "SEO" | "Code Quality";
  title: string;
  description: string;
  file?: string;
}

interface AuditDashboardProps {
  report: {
    jobId: string;
    status: string;
    results: {
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
      findings: Finding[];
    };
  };
  onReset: () => void;
}

export function AuditDashboard({ report, onReset }: AuditDashboardProps) {
  const { results } = report;
  const { scores, summary, findings } = results;

  const [expandedFinding, setExpandedFinding] = useState<string | null>(findings[0]?.id || null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);

  const overallScore = Math.round(
    (scores.security + scores.performance + scores.seo + scores.codeQuality) / 4
  );

  const toggleFinding = (id: string) => {
    setExpandedFinding(expandedFinding === id ? null : id);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFindings = filterSeverity
    ? findings.filter((f) => f.severity === filterSeverity)
    : findings;

  const severityCounts = {
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    info: findings.filter((f) => f.severity === "info").length,
  };

  const getMetricBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", bar: "from-emerald-500 to-teal-400" };
    if (score >= 75) return { label: "Good", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", bar: "from-amber-500 to-orange-400" };
    return { label: "Needs Work", color: "bg-rose-500/10 text-rose-400 border-rose-500/30", bar: "from-rose-500 to-red-500" };
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          leftBorder: "border-l-rose-500",
          icon: <AlertOctagon className="h-4 w-4 text-rose-400" />,
          label: "Critical",
        };
      case "medium":
        return {
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          leftBorder: "border-l-amber-500",
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
          label: "Warning",
        };
      case "low":
        return {
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          leftBorder: "border-l-blue-500",
          icon: <AlertTriangle className="h-4 w-4 text-blue-400" />,
          label: "Low Risk",
        };
      default:
        return {
          badge: "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
          leftBorder: "border-l-zinc-500",
          icon: <Info className="h-4 w-4 text-zinc-400" />,
          label: "Optimization",
        };
    }
  };

  const metrics = [
    {
      title: "Security",
      score: scores.security,
      icon: <Shield className="h-5 w-5 text-indigo-400" />,
      desc: severityCounts.high > 0 ? `${severityCounts.high} critical issue found` : "No secret key leaks",
    },
    {
      title: "Performance",
      score: scores.performance,
      icon: <Zap className="h-5 w-5 text-amber-400" />,
      desc: "Asset compression & LCP timing",
    },
    {
      title: "SEO",
      score: scores.seo,
      icon: <Search className="h-5 w-5 text-emerald-400" />,
      desc: "Metadata & Viewport tags",
    },
    {
      title: "Code Quality",
      score: scores.codeQuality,
      icon: <Code className="h-5 w-5 text-blue-400" />,
      desc: "AST checks & dead imports",
    },
  ];

  return (
    <div className="flex flex-col gap-12 w-full animate-in fade-in duration-300" style={{ marginTop: "120px" }}>

      {/* Top Executive Header Banner */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">

          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-bold font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AUDIT COMPLETE
              </span>
              <span className="text-sm text-slate-500 font-mono">Job ID: {report.jobId}</span>
            </div>

            <h1 className="text-5xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
              Repository Analysis Report
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl text-pretty">
              Automated static analysis evaluation across security rules, performance optimizations, search indexing, and codebase maintainability.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-6 shrink-0 mt-6 lg:mt-0">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="48" cy="48" r="42" className="stroke-slate-200 fill-transparent" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="42"
                  className={cn(
                    "fill-transparent transition-[stroke-dashoffset,stroke] duration-1000",
                    overallScore >= 80 ? "stroke-indigo-600" : "stroke-amber-500"
                  )}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - overallScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-3xl font-black text-slate-900 font-mono tabular-nums">{overallScore}</span>
            </div>

            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">Overall Health</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {overallScore >= 85 ? "Grade A · Healthy" : "Requires Polish"}
              </div>
              <button
                onClick={onReset}
                className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Audit New Project
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {metrics.map((m) => {
          const config = getMetricBadge(m.score);
          return (
            <div
              key={m.title}
              className=" bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-[box-shadow,border-color] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50">
                      {m.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700 font-sans">{m.title}</span>
                  </div>
                  <span className={cn("text-[10px] px-2.5 py-0.5 rounded-full font-bold border font-mono uppercase", config.color)}>
                    {config.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tight">{m.score}</span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", config.bar)}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 leading-normal font-sans text-pretty">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Layout: Left Sidebar + Right Audit Findings */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" >

        {/* Left Sidebar */}
        <div className="xl:col-span-5 flex flex-col gap-8 ">

          {/* Project Metadata Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Project Metadata Section */}
            <div className="p-4 sm:p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2 font-mono mb-2">
                <Server className="h-4 w-4 text-indigo-500" />
                Project Metadata
              </h3>

              <div className="text-sm font-sans">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 text-slate-400" />
                    Total Files
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{summary.fileCount}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-slate-400" />
                    Repo Size
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{formatSize(summary.sizeBytes)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Code className="h-4 w-4 text-slate-400" />
                    Primary Language
                  </span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[13px]">{summary.primaryLanguage}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-slate-400" />
                    AST Engine
                  </span>
                  <span className="font-mono text-slate-900 font-semibold tabular-nums text-[13px]">v2.4 Core</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter by Severity Section */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2 font-mono mb-2">
              <Filter className="h-4 w-4 text-indigo-500" />
              Filter by Severity
            </h3>

            <div className="space-y-0.5 font-sans">
              <button
                onClick={() => setFilterSeverity(null)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-[background-color,border-color,color] text-sm font-bold flex justify-between items-center cursor-pointer",
                  !filterSeverity
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-transparent text-slate-600 hover:bg-slate-200/50"
                )}
              >
                <span>All Findings</span>
                <span className={cn(
                  "text-[10px] h-5 min-w-[20px] flex items-center justify-center rounded-full font-mono font-bold px-1",
                  !filterSeverity ? "bg-white/20 text-white" : "bg-transparent text-slate-500"
                )}>{findings.length}</span>
              </button>

              {[
                { key: "high", label: "Critical Issues", count: severityCounts.high },
                { key: "medium", label: "Warnings", count: severityCounts.medium },
                { key: "low", label: "Low Risk", count: severityCounts.low },
                { key: "info", label: "Optimizations", count: severityCounts.info },
              ].map((sev) => (
                <button
                  key={sev.key}
                  onClick={() => setFilterSeverity(filterSeverity === sev.key ? null : sev.key)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-semibold flex justify-between items-center cursor-pointer",
                    filterSeverity === sev.key
                      ? "bg-white border border-slate-200 shadow-sm text-slate-900"
                      : "bg-transparent hover:bg-slate-200/50 text-slate-600"
                  )}
                >
                  <span>{sev.label}</span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">{sev.count}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Findings Column */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Audit Findings</h3>
            <span className="text-xs bg-white border border-slate-200 text-slate-500 font-mono px-3 py-1 rounded-full font-semibold tabular-nums shadow-sm">
              Showing {filteredFindings.length} of {findings.length}
            </span>
          </div>

          {filteredFindings.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-slate-900 text-base">All Clear!</p>
              <p className="text-xs text-slate-500 mt-1 text-pretty">No findings matching the selected severity filter.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredFindings.map((finding) => {
                const isExpanded = expandedFinding === finding.id;
                const config = getSeverityConfig(finding.severity);

                return (
                  <div
                    key={finding.id}
                    className={cn(
                      "bg-white border border-slate-200 rounded-2xl transition-colors duration-200 overflow-hidden shadow-sm hover:shadow border-l-4",
                      config.leftBorder,
                      isExpanded ? "ring-2 ring-indigo-500/20" : ""
                    )}
                  >
                    {/* Item Header */}
                    <div
                      onClick={() => toggleFinding(finding.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                        <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border font-mono shrink-0 flex items-center gap-1.5", config.badge)}>
                          {config.icon}
                          {config.label}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono">
                              {finding.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base truncate">
                            {finding.title}
                          </h4>
                        </div>
                      </div>

                      <div className="shrink-0 h-8 w-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* Expanded Drawer Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4">
                        <p className="text-sm text-slate-700 leading-relaxed font-sans text-pretty">{finding.description}</p>

                        {finding.file && (
                          <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 border border-slate-200 p-3 rounded-xl text-slate-700">
                            <FileCode2 className="h-4 w-4 text-indigo-600 shrink-0" />
                            <span className="font-semibold text-indigo-700">{finding.file}</span>
                          </div>
                        )}

                        {/* Recommendation Callout */}
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3 shadow-sm">
                          <Lightbulb className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-indigo-800">
                            <span className="font-bold block mb-0.5 text-indigo-900">Remediation Tip:</span>
                            Inspect affected source file and verify against enterprise AST guidelines. Keep secret credentials out of static bundles and optimize image imports.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
