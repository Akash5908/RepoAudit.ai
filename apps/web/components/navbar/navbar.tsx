import { Shield, LayoutDashboard, HelpCircle, FileText } from "lucide-react";

export const Navbar = () => {
    return (
        <header className="sticky top-0 w-full flex justify-center border-b border-slate-200 bg-white/90 backdrop-blur-xl z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between w-full">
                {/* Left: Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                            RepoAudit<span className="text-indigo-600">.ai</span>
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5 font-mono">Automated Scanner</span>
                    </div>
                </div>

                {/* Center: Clean Nav Links */}
                <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-500">
                    <a href="#" className="text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm transition-all active:scale-[0.96]">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Scanner
                    </a>
                    <a href="#" className="hover:text-slate-900 hover:bg-white hover:shadow-sm px-3.5 py-1.5 rounded-full flex items-center gap-2 transition-all active:scale-[0.96]">
                        <FileText className="h-3.5 w-3.5 text-slate-500" />
                        Audit History
                    </a>
                    <a href="#" className="hover:text-slate-900 hover:bg-white hover:shadow-sm px-3.5 py-1.5 rounded-full flex items-center gap-2 transition-all active:scale-[0.96]">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                        Docs
                    </a>
                </nav>

                {/* Right: Status & Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] sm:text-xs font-bold tracking-wide font-mono shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>CORE ACTIVE</span>
                    </div>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-[0.96] shadow-sm"
                        aria-label="GitHub Repository"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                    </a>
                </div>
            </div>
        </header>
    );
};