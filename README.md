# Venture Nudge 🚀

**Venture Nudge** is an AI-powered co-founder that helps aspiring entrepreneurs brainstorm, plan, and launch their businesses.

## Features
- **AI Brainstorming**: Interactive chat to refine business ideas.
- **Market Intelligence**: Real-time competitor analysis and gap detection.
- **Financial Modeling**: Automated P&L and burn rate projections.
- **Operational Automation**: Legal, licensing, and location scouting.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite (via Drizzle ORM)
- **AI**: Vercel AI SDK + OpenAI / Anthropic
- **Styling**: Tailwind CSS

## getting Started (Self-Hosted)

### Prerequisites
- Docker & Docker Compose
- OpenAI API Key

### Deployment
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/venturenudge.git
   cd venturenudge
   ```

2. **Set Environment Variables**:
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=sk-...
   TAVILY_API_KEY=tvly-...
   ```

3. **Run with Docker**:
   ```bash
   docker-compose up -d --build
   ```

   The app will be available at `http://localhost:3000`.

## Local Development
```bash
npm install
npm run dev
```

Visit `http://localhost:3274` (Port configured in package.json).
