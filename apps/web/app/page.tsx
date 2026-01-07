"use client";

import { useState } from "react";
import { DropZone } from "@/components/drop-zone/drop-zone";
import { Navbar } from "@/components/navbar/navbar";
import { CheckCircle, GitBranch } from "lucide-react";
import { AuditDashboard } from "@/components/drop-zone/audit-dashboard";

export default function Home() {
  const [report, setReport] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      {report ? (
        <div className="flex-1 w-full flex justify-center relative z-10 pt-16 lg:pt-24 pb-12">
          <main className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <AuditDashboard report={report} onReset={() => setReport(null)} />
          </main>
        </div>
      ) : (
        <div className="flex-1 w-full flex justify-center relative z-10">
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-12 md:py-20 items-center justify-center">

            {/* Left Side: Product Intro */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold font-mono tracking-wide shadow-sm">
                <GitBranch className="h-3.5 w-3.5 text-indigo-500" />
                <span>STATIC CODE ANALYZER v2.4</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Audit your codebase <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600">
                  with AI accuracy.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg font-sans">
                Upload your repository to run enterprise-grade AST rules. Detect hardcoded API tokens, unoptimized layouts, security vulnerabilities, and code bloat instantly.
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-200 max-w-md w-full text-left">
                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 mt-0.5 shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">AST Rule Diagnostics</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">Deep AST scan to flag exposed keys, secret variables, and dangerous dependencies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 mt-0.5 shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Performance & SEO Auditing</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">Identify uncompressed imagery, missing viewports, broken imports, and high LCP candidates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: DropZone */}
            <div className="flex justify-center w-full">
              <DropZone onAuditComplete={setReport} />
            </div>

          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white z-10 font-mono">
        <p>© 2026 RepoAudit.ai. Enterprise-grade static code & security analysis.</p>
      </footer>
    </div>
  );
}
