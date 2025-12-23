# Repo Audit AI - Frontend

This is the frontend application for Repo Audit AI, built with Next.js 15, React 19, and TailwindCSS.

## Overview
The frontend provides a sleek, modern, glassmorphic UI for users to upload their codebase (`.zip`) and receive an AI-powered audit report.

## Architecture & Integrations

### 1. Polling System
When a user uploads a zip file, the frontend receives a `jobId` from the backend. Instead of holding the connection open (which could timeout), the frontend actively polls the backend's `/status/:jobId` endpoint. This allows us to show a real-time progress bar reflecting the background worker's current stage (e.g., "Decompressing...", "Assembling context...", "AI Auditing...").

### 2. UI/UX (TailwindCSS)
The interface is built with raw TailwindCSS, heavily utilizing modern web design principles:
- **Glassmorphism**: Backdrop blurs (`backdrop-blur-xl`), semi-transparent white backgrounds (`bg-white/90`), and subtle borders.
- **Micro-animations**: Ping indicators for server status, smooth scale transitions on active buttons (`active:scale-[0.96]`), and animated progress bars.
- **Typography**: Uses modern sans-serif fonts for a clean, developer-focused aesthetic.

### 3. Dropzone Integration
We use `react-dropzone` for the drag-and-drop file upload area. It is configured to only accept `.zip` files, providing immediate client-side validation before the file even reaches the server.

## Environment Variables
See `.env.example` for required configuration. Set `NEXT_PUBLIC_API_URL` to point to your running backend instance (default: `http://localhost:8000`).
