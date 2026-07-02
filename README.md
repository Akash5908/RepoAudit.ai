# RepoAudit.ai

RepoAudit.ai is a tool for static code analysis and development cost estimation. You can upload a repository folder or a zip file, and it will analyze the project architecture, ignore unnecessary files (like `node_modules`), and evaluate code health, security risks, and technical debt. It also calculates a localized development cost budget based on the complexity of the codebase and regional pricing data.

## Architecture

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Recharts.
- **Backend**: Node.js, NestJS/Express.js, TypeScript.
- **Background Jobs**: Redis + BullMQ (handles file extraction and AI queries).
- **Static Parser**: Custom AST mapping to calculate LOC and dependencies.
- **AI Orchestration**: OpenAI API / Anthropic Claude SDK with JSON-mode parsing.

## Features

- **Efficient Ingestion**: Automatically ignores heavy directories like `node_modules`, `dist`, `build`, `.git`, and lockfiles to save bandwidth and token limits.
- **Scoring System**: Evaluates repository health, outputting an overall score (out of 100) and metrics on readability, architecture, and security.
- **Budget Estimation**: Translates codebase complexity into development budgets (USD, INR, EUR) using regional market data.
- **Analytics Dashboard**: Visualizes file density, language distributions, and code improvement suggestions.

## How it works

1. User uploads a zip or links a repo.
2. BullMQ adds the task to a background queue.
3. The parser strips out unnecessary files (`node_modules`, `dist`, etc.).
4. AST tree mapping calculates LOC, structure, and dependencies.
5. The AI service processes the code map alongside the regional pricing matrix.
6. Results (JSON report and metadata) are stored in Postgres.
7. Next.js dashboard displays the scores, audit details, and budgets.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Redis (running locally or via cloud provider)
- OpenAI or Anthropic API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Akash5908/RepoAudit.ai.git
   cd RepoAudit.ai
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Environment Variables:
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   REDIS_URL=redis://127.0.0.1:6379
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Run locally:
   ```bash
   # Start Redis (if not running)
   redis-server

   # Start backend API and worker
   cd server
   npm run dev

   # Start frontend in a new terminal
   cd ../client
   npm run dev
   ```

## AI Output Format

The backend enforces a strict JSON output from the LLM to populate the dashboard. Here is an example of the schema:

```json
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
```

## License

MIT License. See [LICENSE](LICENSE) for details.