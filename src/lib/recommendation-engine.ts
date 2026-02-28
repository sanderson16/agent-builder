import type {
  WizardState,
  DataSourceId,
  StackChoice,
  StackRecommendation,
} from "./types";
import { DATA_SOURCES } from "./wizard-data";

// ── Helpers ──────────────────────────────────────────────────────────────────

function lookup<T extends { id: string }>(items: T[], id: string | null): T | undefined {
  return items.find((i) => i.id === id);
}

const GUI_KEYWORDS = [
  "click", "browser", "website", "login to", "dashboard",
  "portal", "ui", "screen", "mouse", "button",
];

function hasGuiKeywords(state: WizardState): boolean {
  const text = `${state.problemDescription} ${state.manualProcess}`.toLowerCase();
  return GUI_KEYWORDS.some((kw) => text.includes(kw));
}

const MCP_AVAILABLE: DataSourceId[] = ["slack", "github", "obsidian", "confluence", "jira"];

const COMPLEX_TASKS = [
  "post-meeting-summary", "qbr-prep", "handoff-doc",
  "churn-pattern-analysis", "feature-request-trends",
  "competitive-intel", "ticket-routing",
];

// ── Stage 1: Complexity Score ────────────────────────────────────────────────

export function calculateComplexity(state: WizardState): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Data sources count (1-10)
  const srcCount = state.dataSources.length;
  if (srcCount > 0) {
    score += srcCount;
    factors.push(`${srcCount} data source${srcCount > 1 ? "s" : ""} (+${srcCount})`);
  }

  // Complex categories
  if (["research-analysis", "workflow-automation"].includes(state.category ?? "")) {
    score += 2;
    factors.push(`${state.category} category (+2)`);
  }

  // Complex tasks
  if (COMPLEX_TASKS.includes(state.task ?? "")) {
    score += 2;
    factors.push(`${state.task} task type (+2)`);
  }

  // Multiple outputs
  if (state.outputs.includes("multiple") || state.outputs.length >= 3) {
    score += 1;
    factors.push("multiple output destinations (+1)");
  }

  // Autonomous mode
  if (state.autonomy === "autonomous") {
    score += 1;
    factors.push("autonomous mode (+1)");
  }

  // Complex triggers
  if (state.trigger === "combination" || state.trigger === "data-change") {
    score += 1;
    factors.push(`${state.trigger} trigger (+1)`);
  }

  return { score, factors };
}

// ── Stage 2: Select Runtime ──────────────────────────────────────────────────

export function selectRuntime(state: WizardState): StackChoice {
  const hasLocalSources = state.dataSources.includes("obsidian");
  const hasGitHub = state.dataSources.includes("github");
  const hasBitbucket = state.dataSources.includes("bitbucket");
  const isScheduled = state.trigger === "schedule";
  const isManual = state.trigger === "manual";
  const needsAlwaysOn = state.trigger === "data-change" || state.trigger === "combination";

  if (isManual) {
    return {
      name: "Local CLI (npx tsx)",
      reason: "Your task runs on-demand, so a local CLI tool gives you instant startup with zero server overhead.",
      setup: "Run with: npx tsx src/index.ts [options]. No deployment needed — runs directly on your machine.",
      changeIf: "you need this to run unattended on a server, or want to trigger it from a webhook — switch to GitHub Actions or Railway.",
    };
  }

  if (hasLocalSources) {
    return {
      name: "Local PM2 (always-on local process)",
      reason: "Your Obsidian vault is local, so the agent must run on the same machine. PM2 keeps it alive and auto-restarts on failure.",
      setup: "Install PM2 globally (npm i -g pm2), then: pm2 start src/index.ts --interpreter tsx --name my-agent. Use pm2 logs to monitor.",
      changeIf: "you move your vault to a cloud-synced location, or don't need Obsidian — then GitHub Actions or Railway would be simpler.",
    };
  }

  if (isScheduled && state.scheduleFrequency !== "hourly") {
    if (hasBitbucket) {
      return {
        name: "GitLab CI/CD (scheduled pipeline)",
        reason: "Your task runs on a ${state.scheduleFrequency} schedule and you use Bitbucket. GitLab CI handles scheduled pipelines well and integrates with your existing workflow.",
        setup: "Add a .gitlab-ci.yml with a scheduled pipeline. Set environment variables in GitLab CI/CD Settings → Variables.",
        changeIf: "you have a GitHub account you'd prefer to use — GitHub Actions has a more generous free tier. Or if you need sub-minute scheduling, switch to a local PM2 process.",
      };
    }
    return {
      name: "GitHub Actions (scheduled workflow)",
      reason: `Your task runs on a ${state.scheduleFrequency ?? "daily"} schedule and doesn't require local file access. GitHub Actions runs this for free with zero infrastructure.`,
      setup: "Add a .github/workflows/run-agent.yml with a cron schedule. Secrets go in GitHub repo Settings → Secrets → Actions.",
      changeIf: "you don't have a GitHub account, need sub-minute scheduling, or have data on your local machine — switch to local PM2.",
    };
  }

  if (needsAlwaysOn) {
    return {
      name: "Railway or Render (always-on service)",
      reason: "Event-driven and combination triggers need the agent always listening. Railway/Render run Node.js services cheaply with zero DevOps.",
      setup: "Push to GitHub → connect to Railway (railway.app) or Render (render.com) → set env vars in dashboard → auto-deploys on push.",
      changeIf: "your events are actually infrequent (a few times a day) — a scheduled poll via GitHub Actions would be cheaper. Or if you need real-time websocket connections, consider a dedicated VPS.",
    };
  }

  // Hourly schedule fallback
  return {
    name: "Local PM2 (scheduled local process)",
    reason: "Hourly schedules run most reliably as a local process managed by PM2 — fast iteration, easy debugging, no cloud costs.",
    setup: "Install PM2 globally (npm i -g pm2), then: pm2 start src/index.ts --interpreter tsx --name my-agent.",
    changeIf: "you want this running without your machine being on — switch to Railway/Render for always-on cloud hosting.",
  };
}

// ── Stage 3: Select Brain ────────────────────────────────────────────────────

export function selectBrain(state: WizardState, complexityScore: number): StackChoice {
  if (hasGuiKeywords(state)) {
    return {
      name: "Computer Use (GUI automation)",
      reason: "Your workflow involves interacting with a browser or GUI (detected keywords like \"click\", \"dashboard\", \"portal\"). Computer Use can automate these visual interactions.",
      setup: "Use the Anthropic Computer Use API. Requires a display server or headless browser. The agent will take screenshots and interact with UI elements programmatically.",
      changeIf: "the tool you're clicking through actually has an API — direct API access is faster, cheaper, and more reliable than GUI automation.",
    };
  }

  if (complexityScore <= 2) {
    return {
      name: "Headless CLI (claude -p --prompt-file)",
      reason: "This is a straightforward task with low complexity. A single Claude CLI call with a well-crafted prompt file is the simplest and fastest approach.",
      setup: "Create an agent-spec.md prompt file. Run with: claude -p --prompt-file agent-spec.md. No SDK or build step needed.",
      changeIf: "the task turns out to need multi-step tool use (fetching data, then processing, then outputting) — upgrade to Agent SDK.",
    };
  }

  if (complexityScore <= 5) {
    return {
      name: "Claude Agent SDK (TypeScript)",
      reason: `Complexity score of ${complexityScore} means this task needs multi-step tool use but a single agent can handle it. The Agent SDK gives you structured tool definitions and conversation management.`,
      setup: "npm install @anthropic-ai/agent-sdk. Define tools for each data source and output. The SDK handles the conversation loop and tool execution.",
      changeIf: "the task turns out to be simpler than expected (single fetch + format) — downgrade to Headless CLI. If you discover distinct parallel phases, upgrade to Subagents.",
    };
  }

  // complexity 6+
  return {
    name: "Claude Agent SDK + Subagents",
    reason: `Complexity score of ${complexityScore} with multiple data sources and processing phases. Subagents let you split work into focused sub-tasks (e.g., one agent per data source) that run in parallel.`,
    setup: "npm install @anthropic-ai/agent-sdk. Create a main orchestrator agent that delegates to specialized subagents. Each subagent has its own tools and focused prompt.",
    changeIf: "the task turns out to be more sequential than parallel — a single Agent SDK agent with a pipeline pattern may be simpler and cheaper.",
  };
}

// ── Stage 4: Select Integrations ─────────────────────────────────────────────

export function selectIntegrations(
  state: WizardState,
  brain: StackChoice,
): { strategy: StackChoice; perSource: StackChoice[] } {
  const isAgentSdk = brain.name.includes("Agent SDK");
  const mcpCount = state.dataSources.filter((id) => MCP_AVAILABLE.includes(id)).length;
  const totalSources = state.dataSources.length;

  // Overall strategy
  let strategy: StackChoice;
  if (mcpCount === totalSources && totalSources > 0) {
    strategy = {
      name: "MCP Servers (all sources available)",
      reason: "All your data sources have MCP servers available. MCP provides a standardized interface — less custom code, easier maintenance.",
      setup: "Configure each MCP server in your Claude Code or Agent SDK config. Each server handles authentication and API details internally.",
      changeIf: "you need fine-grained control over API calls (pagination, filtering) that the MCP server doesn't expose — switch to Direct API for that source.",
    };
  } else if (mcpCount > 0) {
    strategy = {
      name: "Mixed (MCP + Direct API)",
      reason: `${mcpCount} of ${totalSources} sources have MCP servers. Using MCP where available and Direct API for the rest minimizes custom code.`,
      setup: "Configure MCP servers for supported sources. For the others, use their REST/GraphQL APIs directly via axios or official SDKs.",
      changeIf: "maintaining two integration patterns is confusing — you could standardize on Direct API for everything, or build Custom MCP Servers for unsupported sources.",
    };
  } else {
    strategy = {
      name: "Direct API / SDK",
      reason: "None of your selected data sources have MCP servers yet. Direct API integration gives you full control and is well-documented.",
      setup: "Use the official SDK or REST API for each data source. Install the relevant npm packages and configure credentials in .env.",
      changeIf: "an MCP server becomes available for one of your sources — MCP reduces boilerplate and standardizes the interface.",
    };
  }

  // Per-source details
  const perSource: StackChoice[] = state.dataSources.map((id) => {
    const label = lookup(DATA_SOURCES, id)?.label ?? id;

    if (MCP_AVAILABLE.includes(id)) {
      return {
        name: `${label}: MCP Server`,
        reason: `Use the official ${label} MCP server — standardized interface, no custom API code needed.`,
        setup: getMcpSetup(id),
        changeIf: `you need API features the MCP server doesn't expose — switch to Direct API for ${label}.`,
      };
    }

    if (id === "other" && isAgentSdk) {
      return {
        name: `${label}: Custom MCP Server`,
        reason: "Your custom data source can be wrapped in a purpose-built MCP server, giving the agent a clean tool interface.",
        setup: "Create a custom MCP server using @anthropic-ai/sdk. Define tools for read/write operations on your data source. Register it in the agent config.",
        changeIf: "the custom source is simple (single API call) — a direct fetch in the agent code would be faster to build.",
      };
    }

    return {
      name: `${label}: Direct API`,
      reason: `No MCP server available for ${label}. Use the REST/GraphQL API directly — well-documented and full control.`,
      setup: getDirectApiSetup(id),
      changeIf: `an MCP server for ${label} becomes available — it would reduce boilerplate code.`,
    };
  });

  return { strategy, perSource };
}

// ── Stage 5: Select Safety Layer ─────────────────────────────────────────────

export function selectSafetyLayer(state: WizardState): StackChoice | null {
  const needsSafety =
    state.autonomy === "cautious" ||
    state.escalationTriggers.includes("send-message") ||
    state.failMode === "stop";

  if (state.escalationTriggers.length === 1 && state.escalationTriggers[0] === "never") {
    return null;
  }

  if (needsSafety) {
    const reasons: string[] = [];
    if (state.autonomy === "cautious") reasons.push("you chose cautious autonomy");
    if (state.escalationTriggers.includes("send-message")) reasons.push("outbound messages require approval");
    if (state.failMode === "stop") reasons.push("fail mode is set to stop-and-wait");

    return {
      name: "Hooks (PreToolUse + PostToolUse)",
      reason: `Safety layer enabled because ${reasons.join(", ")}. Hooks intercept tool calls before execution (PreToolUse for approval gates) and after (PostToolUse for logging/audit).`,
      setup: "Define hook functions in your agent config. PreToolUse hooks can block or modify tool calls. PostToolUse hooks log results and can trigger alerts.",
      changeIf: "you trust the agent fully and want maximum speed — remove hooks and rely on output review instead. Or if you need per-user approval flows, consider a web-based approval UI.",
    };
  }

  return null;
}

// ── Stage 6: Select Architecture Pattern ─────────────────────────────────────

export function selectPattern(
  state: WizardState,
  brain: StackChoice,
  safetyLayer: StackChoice | null,
): StackChoice {
  const sourceCount = state.dataSources.length;
  const isHeadlessCli = brain.name.includes("Headless CLI");
  const isAgentSdk = brain.name.includes("Agent SDK") && !brain.name.includes("Subagents");
  const hasSubagents = brain.name.includes("Subagents");
  const isResearch = state.category === "research-analysis";
  const hitlOverlay = safetyLayer ? " + Human-in-the-Loop" : "";

  if (isHeadlessCli) {
    return {
      name: `Single-Pass${hitlOverlay}`,
      reason: "Simple task with a single Claude call — fetch data, process, output. No orchestration needed.",
      setup: "One prompt file that describes the full task. Input data is piped in or fetched inline. Output goes to the configured destination.",
      changeIf: "you need to chain multiple processing steps or the single call hits context limits — upgrade to Multi-Step Pipeline.",
    };
  }

  if (isAgentSdk && sourceCount <= 2) {
    return {
      name: `Single-Pass${hitlOverlay}`,
      reason: "With 1-2 data sources, the agent can fetch everything in one pass and produce output without complex orchestration.",
      setup: "Define tools for data fetching and output delivery. The agent loops through tool calls naturally in a single conversation.",
      changeIf: "the data sources return large volumes that exceed context — switch to Multi-Step Pipeline to process in stages.",
    };
  }

  if (isAgentSdk && sourceCount >= 3) {
    return {
      name: `Multi-Step Pipeline${hitlOverlay}`,
      reason: `${sourceCount} data sources need sequential fetch-process-deliver stages. A pipeline keeps each step focused and debuggable.`,
      setup: "Break the agent into stages: (1) fetch from all sources, (2) process/analyze data, (3) format output, (4) deliver. Each stage passes results to the next.",
      changeIf: "the sources are independent and could run in parallel — upgrade to Fan-Out with Subagents for speed.",
    };
  }

  if (hasSubagents && isResearch) {
    return {
      name: `Fan-Out${hitlOverlay}`,
      reason: "Research tasks with subagents benefit from parallel fan-out — each subagent investigates one source or angle, then results are merged.",
      setup: "Create a coordinator agent that spawns subagents in parallel. Each subagent has focused tools and a narrow prompt. The coordinator merges and synthesizes results.",
      changeIf: "the research is actually sequential (each step depends on the previous) — switch to Autonomous Agent Loop.",
    };
  }

  if (hasSubagents) {
    return {
      name: `Autonomous Agent Loop${hitlOverlay}`,
      reason: "Complex multi-phase task with subagents. The main agent plans, delegates to subagents, evaluates results, and iterates until the task is complete.",
      setup: "Create a main orchestrator agent with planning capabilities. Define specialized subagents for data gathering, analysis, and output. The orchestrator decides when to delegate and when to synthesize.",
      changeIf: "the task has clearly independent parallel phases — switch to Fan-Out for faster execution.",
    };
  }

  // Fallback
  return {
    name: `Multi-Step Pipeline${hitlOverlay}`,
    reason: "General-purpose pattern for tasks that need multiple processing stages.",
    setup: "Break the agent into sequential stages with clear handoffs between each step.",
    changeIf: "the task is simpler than expected — a Single-Pass approach would reduce complexity.",
  };
}

// ── Main entry point ─────────────────────────────────────────────────────────

export function recommendStack(state: WizardState): StackRecommendation {
  const complexity = calculateComplexity(state);
  const runtime = selectRuntime(state);
  const brain = selectBrain(state, complexity.score);
  const { strategy: integrationStrategy, perSource: integrations } = selectIntegrations(state, brain);
  const safetyLayer = selectSafetyLayer(state);
  const pattern = selectPattern(state, brain, safetyLayer);

  return {
    runtime,
    brain,
    integrationStrategy,
    integrations,
    safetyLayer,
    pattern,
    complexity,
  };
}

// ── MCP setup helpers ────────────────────────────────────────────────────────

function getMcpSetup(id: DataSourceId): string {
  switch (id) {
    case "slack": return "Add to MCP config: @anthropic/slack-mcp-server. Needs SLACK_BOT_TOKEN in .env.";
    case "github": return "Add to MCP config: @anthropic/github-mcp-server. Needs GITHUB_TOKEN in .env.";
    case "obsidian": return "Add to MCP config: point to local vault path. No API key needed.";
    case "confluence": return "Add to MCP config: @anthropic/atlassian-mcp-server. Needs Atlassian API token in .env.";
    case "jira": return "Add to MCP config: @anthropic/atlassian-mcp-server. Needs Atlassian API token in .env.";
    default: return "Configure the appropriate MCP server for this data source.";
  }
}

function getDirectApiSetup(id: DataSourceId): string {
  switch (id) {
    case "hubspot": return "npm install @hubspot/api-client. Use the HubSpot Node.js SDK for CRM operations.";
    case "slack": return "npm install @slack/web-api. Use Slack Web API for reading channels and posting messages.";
    case "jira": return "Use Jira REST API v3 with axios. Base URL: https://yourorg.atlassian.net/rest/api/3/";
    case "confluence": return "Use Confluence REST API with axios. Base URL: https://yourorg.atlassian.net/wiki/rest/api/";
    case "fireflies": return "Use Fireflies GraphQL API with axios. Endpoint: https://api.fireflies.ai/graphql";
    case "email": return "npm install googleapis (Gmail) or @microsoft/microsoft-graph-client (Outlook).";
    case "github": return "npm install @octokit/rest. Use Octokit SDK for repos, issues, and PRs.";
    case "bitbucket": return "Use Bitbucket REST API v2 with axios. Base URL: https://api.bitbucket.org/2.0/";
    case "obsidian": return "Use Node.js fs module to read/write markdown files directly from the vault path.";
    case "other": return "Use axios or node-fetch to connect to the custom API endpoint.";
    default: return "Use the appropriate SDK or REST API client.";
  }
}
