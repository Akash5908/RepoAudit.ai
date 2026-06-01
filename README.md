# 🚀 RepoAudit.ai
RepoAudit.ai is an AI-powered static code analysis and financial estimation platform. It ingests repository folders or compressed .zip files, maps project architecture, cleans out unnecessary clutter, and runs an intelligent audit to grade code health, security risks, and technical debt. Additionally, it leverages a regional developer-pricing matrix paired with AI inference to calculate a localized development cost budget based on the codebase's complexity.

## 🛠️ Tech Stack & Architecture
Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Recharts (for analytics visualization).
Backend: Node.js, NestJS/Express.js, TypeScript.
Background Jobs / Worker: Redis + BullMQ (Handles file extraction and long-running AI streaming queries asynchronously).
Static Parser: Custom AST mapping tool to calculate exact Lines of Code (LOC) and dependency distributions.
AI Orchestration: OpenAI API / Anthropic Claude SDK with JSON-mode structure parsing.

📦 Features
Zero-Clutter Ingestion: Automatically filters out heavy environment directories (node_modules, dist, build, .git, and lockfiles) during file extraction to preserve bandwidth and optimize token limits.
Multi-Dimensional Scoring: Evaluates repository health dynamically, outputting an overall score out of 100 alongside structured metrics on Readability, Architecture Stability, and Security Vector Risks.
Regional Budget Engine: Translates calculated codebase complexity into real-world project costs, generating localized development budget tiers (e.g., USD, INR, EUR) mapped against regional market data.
Interactive Analytics Dashboard: Renders clean, visual graphs displaying file density, language distributions, and actionable code improvement workflows.

🗺️ System Architecture Flow
[ User Uploads .zip / Links Repo ] 
                │
                ▼
      [ BullMQ Background Queue ]
                │
                ▼
   [ File Stripping & Token Filter ]  ──► (Removes node_modules, dist, etc.)
                │
                ▼
     [ AST Tree Mapping Engine ]      ──► (Calculates LOC, Tree Map, Dependencies)
                │
                ▼
     [ AI Context Prompter Service ]  ──► (Blends Code Map with Regional Matrix)
                │
                ▼
      [ Database Sync (Postgres) ]    ──► (Stores parsed metadata and JSON report)
                │
                ▼
      [ Next.js UI Dashboard ]        ──► (Visualizes Scores, Audits & Budgets)

🚀 Getting Started
Prerequisites
Node.js (v18.x or higher)
Redis (Running locally or via cloud instance for the background processing queue)
OpenAI or Anthropic API Key
Installation
Clone the repository:
Bash
git clone https://github.com/Akash5908/RepoAudit.ai.git
cd RepoAudit.ai
Install dependencies for both the client and server:
Bash
# Install server modules
cd server && npm install

# Install frontend modules
cd ../client && npm install
Configure your Environment Variables:
Create a .env file in the /server directory:
Code snippet
PORT=5000
REDIS_URL=redis://127.0.0.1:6379
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_postgresql_connection_string
Run the development environment:
Bash
# Start Redis server locally (if not running)
redis-server

# Start Backend Worker & API Server
cd server && npm run dev

# Start Frontend Dev Server
cd ../client && npm run dev
🤖 AI Prompt Definition (JSON Spec)
The backend workflow parser enforces a rigid JSON output contract from the LLM. The schema utilizes the following layout to populate the system visualization engine:
JSON
{
  "overallScore": 84,
  "breakdown": {
    "readability": 88,
    "architecture": 80,
    "securityRisk": "Medium"
  },
  "technicalDebtSummary": "Codebase displays modular architecture but relies on deep conditional nesting inside controller layers. Missing comprehensive unit testing profiles.",
  "estimatedHoursToBuildFromScratch": 140,
  "budgetInference": {
    "US_USD": "$12,000 - $18,000",
    "IN_INR": "₹3,50,000 - ₹5,00,000",
    "EU_EUR": "€10,500 - €15,000"
  }
}
📄 License
Distributed under the MIT License. See LICENSE for more information.