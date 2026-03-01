# Agent Builder — LLM Context

## What This Is

A wizard that helps non-technical CS/Support team members describe what they want automated, then generates a structured prompt they paste into Claude Code to build the agent. No backend — runs entirely in the browser.

**Live:** https://beepboopbeepbop.vercel.app
**Repo:** https://github.com/sanderson16/agent-builder

## Architecture

Fully client-side Next.js 15 + React 19 + Tailwind v4. Zero backend, zero database, zero auth. The recommendation engine and prompt generator run in the browser.

### File Map

```
src/lib/types.ts                 — All TypeScript types (WizardState, StackChoice, StackRecommendation, etc.)
src/lib/wizard-data.ts           — Static data: categories, tasks, data sources, triggers, outputs, tones
src/lib/recommendation-engine.ts — 6-stage decision tree: complexity → runtime → brain → integrations → safety → pattern
src/lib/prompt-generator.ts      — Generates the full XML-structured prompt string from wizard state
src/lib/input-quality.ts         — Client-side heuristic: assessProblemDescription() → weak/good/great
src/components/Wizard.tsx         — Main orchestrator: manages WizardState, step navigation, validation
src/components/steps/             — One component per wizard step (CategoryStep through ResultStep)
src/components/OptionCard.tsx     — Reusable card button used by most steps
src/components/PromptDisplay.tsx  — Syntax-highlighted prompt viewer with copy button
src/components/StepIndicator.tsx  — Progress bar (8 numbered circles)
src/components/HelpText.tsx       — Reusable coaching text component for inline guidance
src/app/page.tsx                  — Landing page (server component)
src/app/builder/page.tsx          — Wizard page ("use client", renders <Wizard />)
docs/automation-patterns.md       — Internal reference: triggers, data layers, brain levels, runtimes, patterns
```

### State Flow

All state lives in `Wizard.tsx` as a single `WizardState` object. Every step component receives `state` and `onChange` as props — pure controlled components. No global state, no context providers, no reducers.

### Deployment

Vercel auto-deploys from `master` branch. No vercel.json — uses default Next.js settings. Domain: `beepboopbeepbop.vercel.app`. Vercel project config is in `.vercel/project.json`.

## The Recommendation Engine

`recommendation-engine.ts` is a pure function pipeline — no side effects, no API calls. Each stage is exported individually for testability.

### 6-Stage Decision Tree

**Stage 1 — Complexity Score (0-15):**
- +1 per data source
- +2 if category is research-analysis or workflow-automation
- +2 if task is in COMPLEX_TASKS (qbr-prep, handoff-doc, churn-pattern-analysis, feature-request-trends, competitive-intel, ticket-routing)
- +1 if 3+ outputs selected
- +1 if autonomy is "autonomous"
- +1 if trigger is "data-change" or "combination"

**Stage 2 — Runtime (WHERE it runs):**
- manual trigger → Local CLI (npx tsx)
- obsidian in sources → Local PM2
- schedule (daily/weekly) + bitbucket → Bitbucket Pipelines
- schedule (daily/weekly) → GitHub Actions
- data-change or combination → Railway/Render (always-on)
- hourly schedule → Local PM2

**Stage 3 — Brain (HOW it thinks):**
- GUI keywords detected in problemDescription/manualProcess → Computer Use
- complexity 0-2 → Headless CLI (claude -p --prompt-file)
- complexity 3-5 → Claude Agent SDK (single agent)
- complexity 6+ → Claude Agent SDK + Subagents

GUI keywords (word-boundary regex): click, browser, website, login to, dashboard, portal, ui, gui, screen, mouse, button

**Stage 4 — Integrations (HOW it connects to data):**
- MCP available for: slack, github, obsidian, confluence, jira
- "other" source + Agent SDK brain → Custom MCP Server
- Everything else → Direct API/SDK
- Strategy: "MCP Servers" if all have MCP, "Mixed" if some do, "Direct API" if none

**Stage 5 — Safety Layer:**
- Hooks (PreToolUse + PostToolUse) if: autonomy=cautious OR send-message escalation OR failMode=stop
- null if escalation is only ["never"] AND no other safety signals (cautious/stop)

**Stage 6.5 — Architecture Pattern (Computer Use):**
- Computer Use brain → Sequential GUI Automation (dedicated branch, not fallback)

**Stage 6 — Architecture Pattern:**
- Headless CLI → Single-Pass
- Agent SDK + 1-2 sources → Single-Pass
- Agent SDK + 3+ sources → Multi-Step Pipeline
- Subagents + (research category OR 4+ sources) → Fan-Out
- Subagents otherwise → Autonomous Agent Loop
- " + Human-in-the-Loop" appended when safetyLayer is non-null

### Key Design Decisions

1. **post-meeting-summary is NOT in COMPLEX_TASKS.** It's a sequential pipeline (fetch transcript → enrich → summarize → output), not a parallel/subagent task. Adding it to COMPLEX_TASKS over-recommends subagents.

2. **Fan-Out triggers on 4+ sources, not just research.** Any subagent scenario with 4+ independent data sources benefits from parallel fetch — not just research-analysis category.

3. **The prompt's `<automation_stack>` is concise; the UI is verbose.** The prompt gives Claude Code signal-based rationale (e.g., "trigger=data-change, no local-only data → Runtime: Railway"). The UI panel shows the full "Why" and "Reconsider if" text for the human user. This avoids wasting prompt tokens on marketing copy.

## The Prompt Generator

`prompt-generator.ts` generates a structured XML prompt with these sections:

```
<role>           — Expert automation engineer persona
<task>           — Category, task, user's problem description, trigger, outputs, sources
<context>        — Node.js/TS environment, team context, data sources, alert recipient, gotchas, hard part
<intent>         — Trade-offs, autonomy, fail mode, success criteria, anti-goals, escalation triggers
<acceptance_criteria> — Numbered acceptance tests (includes anti-goal verification when provided)
<requirements>   — Data integration, AI processing, scheduling, output, logging, config, errors
<setup_guidance> — Per-source API setup (credentials, scopes, .env vars)
<automation_stack> — 5-layer stack + <decision_rationale> with signals→decisions and overrides
<architecture>   — Trigger-specific file structure + user's manual workflow
<execution_plan> — (Conditional, complexity 3+) Phased build guidance: 4 phases for medium, 5 for high complexity
<output_specification> — Per-output formatting rules + tone + anti-pattern counter-examples
<output_example> — (Conditional) User's pasted example
<constraints>    — MUSTS, MUST-NOTS, PREFERENCES (includes user prefs), ESCALATION TRIGGERS
<evaluation>     — Test scenarios (dry run, missing key, empty data, category-specific, user-informed, delivery)
```

Setup guides exist for all 10 data sources with exact credential names, required API scopes, .env variable names, and npm packages.

## The Wizard (8 Steps)

| Step | Component | What it collects | Required to advance |
|------|-----------|-----------------|---------------------|
| 0 | CategoryStep | category (1 of 6) | category selected |
| 1 | TaskStep | task (1 of 24 + custom) | task selected, custom text if custom |
| 2 | ContextStep | problemDescription, manualProcess, successDefinition, gotchas, hardPart | problemDescription not empty |
| 3 | DataSourceStep | dataSources[] (multi-select from 10) | at least 1 selected |
| 4 | TriggerStep | trigger + scheduleFrequency if schedule | trigger selected, frequency if schedule |
| 5 | OutputStep | outputs[] (multi-select from 4) | at least 1 selected |
| 6 | GroundRulesStep | tone, mustAlways, neverDo, antiGoals, preferences, alertRecipient, exampleOutput | tone selected |
| 7 | PrioritiesStep | tradeOff, detailLevel, autonomy, failMode, escalationTriggers[] | all 4 toggles set |
| 8 | ResultStep | (displays results) | — |

## Common Modifications

**Adding a new data source:**
1. Add ID to `DataSourceId` union in `types.ts`
2. Add entry to `DATA_SOURCES` array in `wizard-data.ts`
3. Add setup guide to `SETUP_GUIDES` in `prompt-generator.ts`
4. Add to `MCP_AVAILABLE` in `recommendation-engine.ts` if it has an MCP server
5. Add cases to `getMcpSetup()` and `getDirectApiSetup()` in `recommendation-engine.ts`

**Adding a new task:**
1. Add ID to `TaskId` union in `types.ts`
2. Add entry to `TASKS` array in `wizard-data.ts` with the correct `categoryId`
3. If it's genuinely complex (parallel/multi-phase), add to `COMPLEX_TASKS` in `recommendation-engine.ts`

**Adding a new category:**
1. Add ID to `CategoryId` union in `types.ts`
2. Add entry to `CATEGORIES` array in `wizard-data.ts`
3. Add 4 tasks for it to `TASKS`
4. If it's a complex category, add to the complexity scoring check in `calculateComplexity()`
5. Add an evaluation scenario in `getEvaluationScenarios()` in `prompt-generator.ts`

**Changing complexity thresholds:**
- Brain boundaries are in `selectBrain()`: currently 0-2 → CLI, 3-5 → SDK, 6+ → Subagents
- Pattern source threshold: Fan-Out triggers at 4+ sources in `selectPattern()`

## What Doesn't Exist Yet

- No tests (no test runner, no test directory)
- No analytics or usage tracking
- No saved/shareable wizard states (everything is ephemeral in React state)
- No backend API routes
- No authentication
