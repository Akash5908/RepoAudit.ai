import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "RepoAudit.ai | Automated Code Audit & Static Analysis",
  description: "Enterprise static analysis findings, performance insights, and security vulnerability reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white", inter.variable, jetbrainsMono.variable)}>
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
