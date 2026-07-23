# 🤖 AgentGrid — AI Agent Marketplace & Orchestration Platform

> Hire AI agents. Ship in minutes. The world's first multi-agent orchestration marketplace.

Describe your goal in plain English — AgentGrid assembles the perfect team of specialized AI agents and orchestrates the entire workflow end-to-end. No more juggling 10 tools. No more context-switching tax. Just outcomes.

![AgentGrid](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8) ![AI](https://img.shields.io/badge/AI-z--ai--web--dev--sdk-purple)

---

## ✨ Features

### 🛒 Agent Marketplace
- **12 specialized AI agents** across 8 categories (Research, Writing, Coding, Design, Marketing, Data, Automation, QA)
- Real-time search, category filters, and 5 sort options
- Agent cards with ratings, success rates, response times, and pricing
- One-click hire with `localStorage` persistence

### ⚡ Orchestrate Workflow
- **Plain-English → multi-agent workflow** powered by the z-ai-web-dev-sdk
- AI picks the optimal agents, sequences them, and estimates cost
- Live execution simulation with per-step status (pending → running → completed)
- Cost breakdown sidebar showing savings vs. a human team

### 🤖 My Agents Dashboard
- Manage your hired agents in one place
- **Real-time chat with each agent** — agents respond in-character using AI
- Usage stats: tasks this month, spend, active agents
- Per-agent task counters

### 📊 Analytics
- KPI cards (total tasks, spend, avg task time, success rate)
- Task volume & cost area chart (last 7 days)
- Task split by category (pie chart)
- Top agents on the grid (bar chart)
- Your personal agent leaderboard

### 🎨 Design
- Modern, dark-first aesthetic with violet/purple accents
- Glass-morphism navbar, animated gradient tabs, grid-background hero
- Fully responsive (mobile-first)
- Framer Motion micro-animations throughout
- Built on shadcn/ui + Tailwind CSS 4

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** |
| UI Motion | **Framer Motion** |
| Charts | **Recharts** |
| Icons | **lucide-react** |
| AI | **z-ai-web-dev-sdk** (GLM-4 chat completions) |
| State | React hooks + `localStorage` |
| Package Manager | **Bun** (also works with npm/pnpm/yarn) |

---

## 📦 Local Development

### Prerequisites
- Node.js 18+ (or Bun 1.1+)
- A z-ai-web-dev-sdk config file (see below)

### Install & Run

```bash
# 1. Install dependencies
npm install
# or: bun install / pnpm install / yarn

# 2. Set up the AI SDK config
#    Create a file named `.z-ai-config` in the project root:
#    {
#      "baseUrl": "https://internal-api.z.ai/v1",
#      "apiKey": "YOUR_API_KEY",
#      "chatId": "optional",
#      "userId": "optional"
#    }

# 3. Start the dev server
npm run dev
# or: bun run dev

# 4. Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel

AgentGrid is 100% Vercel-ready. Two ways to deploy:

### Option A: One-Click via Vercel Dashboard
1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repo.
4. **Framework Preset**: Next.js (auto-detected).
5. **Build Command**: `next build` (auto-detected).
6. **Output Directory**: `.next` (auto-detected).
7. Click **Deploy**. ✨

### Option B: via Vercel CLI
```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

### Environment
No environment variables are required **if** you commit a `.z-ai-config` file at the project root. For production, you may instead set the same JSON as a Vercel secret and load it at runtime — but the SDK also searches `/etc/.z-ai-config` and `~/.z-ai-config` automatically.

---

## 🔼 Push to GitHub

### Step 1: Create a new repo on GitHub
Go to [github.com/new](https://github.com/new), name it `agentgrid`, and **don't** initialize with README (we already have one).

### Step 2: Push from your local machine

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# First commit
git commit -m "🚀 Initial commit: AgentGrid — AI Agent Marketplace & Orchestration Platform"

# Set the branch name (GitHub defaults to 'main')
git branch -M main

# Add your GitHub repo as remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/agentgrid.git

# Push
git push -u origin main
```

### Step 3: Connect to Vercel
After the push, go to [vercel.com/new](https://vercel.com/new) and import the repo. Every future `git push` will automatically trigger a new deployment. 🎉

---

## 📁 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agents/route.ts        # GET /api/agents — list all agents
│   │   │   ├── orchestrate/route.ts   # POST /api/orchestrate — AI workflow planner
│   │   │   └── chat/route.ts          # POST /api/chat — chat with an agent
│   │   ├── globals.css                # AgentGrid theme (dark-first, violet accent)
│   │   ├── layout.tsx                 # Root layout + metadata
│   │   └── page.tsx                   # Main page — tabs + state + localStorage
│   ├── components/
│   │   ├── agentgrid/
│   │   │   ├── Navbar.tsx             # Sticky glass navbar with animated tabs
│   │   │   ├── HeroSection.tsx        # Landing hero with platform stats
│   │   │   ├── AgentCard.tsx          # Agent card with hire button
│   │   │   ├── Marketplace.tsx        # Searchable, filterable agent grid
│   │   │   ├── Orchestrate.tsx        # Goal → AI workflow → execute
│   │   │   ├── MyAgents.tsx           # Hired agents + chat modal
│   │   │   ├── Analytics.tsx          # KPIs + charts + leaderboard
│   │   │   └── Footer.tsx
│   │   └── ui/                        # shadcn/ui components
│   ├── lib/
│   │   ├── data.ts                    # 12 agents, categories, sample workflow
│   │   ├── utils.ts                   # cn() helper
│   │   └── db.ts                      # Prisma client (unused in MVP)
│   └── types/
│       └── agent.ts                   # All TypeScript types
├── public/                            # Logo, robots.txt
├── prisma/schema.prisma               # (Empty — ready for future DB features)
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 🧠 How the AI Works

### Workflow Orchestration (`/api/orchestrate`)
1. User submits a plain-English goal (e.g., *"Build a SaaS landing page with competitor analysis, copy, design, and code"*).
2. The API sends the goal + the agent catalog to **GLM-4** via `z-ai-web-dev-sdk`.
3. The model returns a strict JSON plan: `{ steps: [{ agentId, description, output }] }`.
4. We validate every `agentId` against the catalog and assemble a `Workflow` object.
5. If the AI call fails, a deterministic fallback planner kicks in based on regex matching against the goal.

### Agent Chat (`/api/chat`)
1. User sends a message to a hired agent (e.g., Scout the research agent).
2. The API builds a system prompt that injects the agent's name, role, and personality.
3. GLM-4 responds in-character, in the agent's voice.
4. Fallback replies are ready if the AI call fails.

---

## 🎯 Roadmap

- [ ] Real authentication (NextAuth.js)
- [ ] Persistent agent hires via Prisma + SQLite
- [ ] Streaming AI responses for chat & workflow steps
- [ ] Custom agent builder (let users create their own agents)
- [ ] Team workspaces
- [ ] Webhook integrations (Slack, GitHub, Linear)
- [ ] Real agent execution (currently a simulation)

---

## 📄 License

MIT — build cool things with it.

---

## 🙏 Credits

Built with the [Z.ai fullstack-dev skill](https://chat.z.ai). AI powered by the [z-ai-web-dev-sdk](https://www.npmjs.com/package/z-ai-web-dev-sdk) (GLM-4).
