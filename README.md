# Agent Builder

A wizard that helps non-technical CS/Support team members describe what they want automated, then generates a structured prompt to paste into Claude Code. The agent gets built for you — no coding required.

**Live at:** https://beepboopbeepbop.vercel.app

## How It Works

1. **Describe your task** — Pick a category (Customer Communication, Reporting, etc.), choose a specific task or describe your own, and explain the problem in your own words.

2. **Configure the details** — Select your data sources (HubSpot, Slack, Jira, etc.), when it should run (schedule, on data change, manual), where results should go (Slack, email draft, document), and set ground rules (tone, constraints, escalation triggers).

3. **Get your prompt** — The wizard auto-selects the right tech stack (runtime, AI framework, integrations, safety layer, architecture pattern) and generates a detailed prompt.

4. **Paste into Claude Code** — Open your terminal, run `claude`, paste the prompt, and Claude Code builds the agent for you. It'll walk you through API keys and setup interactively.

## What It Recommends

The recommendation engine picks from 10 composable approaches based on your answers:

| Layer | Options |
|-------|---------|
| **Runtime** | GitHub Actions, GitLab CI, Local PM2, Local CLI, Railway/Render |
| **Brain** | Headless CLI, Claude Agent SDK, Agent SDK + Subagents, Computer Use |
| **Integrations** | MCP Servers, Custom MCP, Direct API/SDK |
| **Safety** | Hooks (PreToolUse/PostToolUse) or none |
| **Pattern** | Single-Pass, Multi-Step Pipeline, Fan-Out, Autonomous Agent Loop, + Human-in-the-Loop |

Every recommendation includes a "Reconsider if" note so you know when to override it.

## Development

```bash
npm install
npm run dev        # starts on localhost:3000 with Turbopack
npm run build      # production build
```

Pushes to `master` auto-deploy to Vercel.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript 5.7
- Zero backend — runs entirely in the browser
