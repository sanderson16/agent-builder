import type { WizardState, CategoryId, TaskId, DataSourceId, TriggerId, OutputId } from "./types";
import { CATEGORIES, TASKS, DATA_SOURCES, TRIGGERS, OUTPUTS } from "./wizard-data";

// ── Helpers ────────────────────────────────────────────────────────────────────

function lookup<T extends { id: string }>(items: T[], id: string | null): T | undefined {
  return items.find((i) => i.id === id);
}

function labelList(ids: string[], items: { id: string; label: string }[]): string {
  return ids.map((id) => items.find((i) => i.id === id)?.label ?? id).join(", ");
}

// ── Setup guidance per data source ─────────────────────────────────────────────

const SETUP_GUIDES: Record<DataSourceId, string> = {
  hubspot: `  **HubSpot:**
  - Create a Private App at Settings → Integrations → Private Apps
  - Required scopes: crm.objects.contacts.read, crm.objects.deals.read, crm.objects.companies.read, tickets
  - Save the access token to .env as HUBSPOT_ACCESS_TOKEN
  - Ask the user for their HubSpot portal ID`,

  slack: `  **Slack:**
  - Create a Slack App at api.slack.com/apps → Create New App
  - Add Bot Token Scopes: channels:read, channels:history, chat:write, users:read
  - Install to workspace and copy the Bot User OAuth Token
  - Save to .env as SLACK_BOT_TOKEN
  - Ask the user which channel(s) to post to`,

  jira: `  **Jira:**
  - Generate an API token at id.atlassian.com/manage-profile/security/api-tokens
  - Save to .env as JIRA_API_TOKEN
  - Also need: JIRA_EMAIL (the account email) and JIRA_BASE_URL (e.g., https://yourorg.atlassian.net)
  - Ask the user for their project key(s)`,

  confluence: `  **Confluence:**
  - Uses the same Atlassian API token as Jira
  - Save to .env as CONFLUENCE_API_TOKEN, CONFLUENCE_EMAIL, CONFLUENCE_BASE_URL
  - Ask the user for the space key(s) to read from / write to`,

  fireflies: `  **Fireflies:**
  - Get an API key at app.fireflies.ai/integrations → API & Webhooks
  - Save to .env as FIREFLIES_API_KEY
  - Uses GraphQL API at api.fireflies.ai/graphql`,

  email: `  **Email (Gmail):**
  - Set up a Google Cloud project with Gmail API enabled
  - Create OAuth2 credentials (or use a service account for workspace)
  - Save credentials to .env as GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
  - For Outlook: use Microsoft Graph API with OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, OUTLOOK_TENANT_ID`,

  github: `  **GitHub:**
  - Create a Personal Access Token at github.com/settings/tokens
  - Required scopes: repo, read:org (for org repos)
  - Save to .env as GITHUB_TOKEN
  - Ask the user for the repo(s) to monitor`,

  bitbucket: `  **Bitbucket:**
  - Create an App Password at bitbucket.org/account/settings/app-passwords
  - Required permissions: repository:read, pullrequest:read
  - Save to .env as BITBUCKET_USERNAME and BITBUCKET_APP_PASSWORD
  - Ask the user for the workspace and repo slug(s)`,

  obsidian: `  **Obsidian:**
  - This runs locally — no API key needed
  - Ask the user for the absolute path to their Obsidian vault
  - Save to .env as OBSIDIAN_VAULT_PATH
  - Use the filesystem to read/write markdown files directly`,

  other: `  **Custom Data Source:**
  - Ask the user what API or data source they want to connect
  - Save any required credentials to .env with a descriptive name
  - Document the API endpoint and authentication method in the README`,
};

// ── Task descriptions for the prompt ───────────────────────────────────────────

function getTaskDescription(state: WizardState): string {
  if (state.task === "custom") {
    return state.customTask;
  }
  const task = lookup(TASKS, state.task);
  return task ? `${task.label}: ${task.description}` : "";
}

// ── Trigger architecture guidance ──────────────────────────────────────────────

function getTriggerArchitecture(state: WizardState): string {
  switch (state.trigger) {
    case "schedule":
      return `  This agent runs on a **${state.scheduleFrequency ?? "daily"} schedule**.
  Recommended architecture:
  - Use node-cron or a simple setInterval for scheduling
  - Main entry: src/index.ts with the cron job setup
  - Agent logic: src/agent.ts (pure function, easy to test)
  - Config: src/config.ts (reads .env, exports typed config)
  - Each run should be idempotent — safe to re-run without side effects
  - Log each run with timestamp and summary to stdout`;

    case "data-change":
      return `  This agent runs **when data changes** (event-driven).
  Recommended architecture:
  - Use polling with a configurable interval (start with 5 minutes)
  - Track last-seen state in a local JSON file (src/state.json)
  - Main entry: src/index.ts with the polling loop
  - Agent logic: src/agent.ts (compare current vs. last state, act on diffs)
  - Diff detection: src/diff.ts (isolates change detection logic)
  - Each check should be lightweight — only fetch what changed`;

    case "manual":
      return `  This agent runs **on-demand** via CLI command.
  Recommended architecture:
  - Main entry: src/index.ts (parseargs or simple process.argv handling)
  - Agent logic: src/agent.ts (accepts params, returns result)
  - Support: npx tsx src/index.ts [options]
  - Add a --dry-run flag that shows what would happen without acting
  - Add a --verbose flag for debugging output`;

    case "combination":
      return `  This agent uses a **combination** of scheduled and event-driven triggers.
  Recommended architecture:
  - Main entry: src/index.ts (sets up both cron and polling)
  - Scheduler: src/scheduler.ts (cron jobs for periodic runs)
  - Watcher: src/watcher.ts (polling for data changes)
  - Agent logic: src/agent.ts (shared logic used by both triggers)
  - Both triggers call the same agent function — keeps logic DRY`;

    default:
      return "  Architecture will be determined by the trigger type.";
  }
}

// ── Output specification ───────────────────────────────────────────────────────

function getOutputSpec(state: WizardState): string {
  const outputs = state.outputs.map((id) => lookup(OUTPUTS, id)?.label ?? id);
  const lines = outputs.map((o) => {
    switch (o) {
      case "Slack Message":
        return "  - **Slack**: Post a well-formatted message using Block Kit (sections, dividers, bold headers). Include a summary line at the top.";
      case "Document / Note":
        return "  - **Document**: Write a markdown file with clear headings, timestamps, and structured sections. Save to a configurable output directory.";
      case "Email Draft":
        return "  - **Email Draft**: Generate a complete email with subject line, greeting, body, and sign-off. Save as a draft (do NOT auto-send).";
      case "Spreadsheet / Report":
        return "  - **Spreadsheet/Report**: Output clean CSV or formatted markdown table. Include column headers and a summary row if applicable.";
      case "Multiple Outputs":
        return "  - **Multiple Outputs**: Deliver to all configured destinations. Each output should be formatted appropriately for its medium.";
      default:
        return `  - **${o}**: Format output appropriately for this destination.`;
    }
  });
  return lines.join("\n");
}

// ── Intent section ─────────────────────────────────────────────────────────────

function getIntentSection(state: WizardState): string {
  const tradeOff =
    state.tradeOff === "accuracy"
      ? "Accuracy over speed: Take the time to verify data and cross-reference sources. Getting it right matters more than getting it fast."
      : "Speed over perfection: Deliver a good-enough result quickly. Don't spend extra time polishing — the user needs this promptly.";

  const detail =
    state.detailLevel === "comprehensive"
      ? "Comprehensive over concise: Include all relevant details, context, and supporting data. More information is better than less."
      : "Brief over thorough: Keep output focused and scannable. Highlight only what matters — the user will dig deeper if needed.";

  const autonomy =
    state.autonomy === "cautious"
      ? "Cautious: When uncertain, flag it for human review rather than guessing. It's better to ask than to act on bad assumptions."
      : "Autonomous: Make reasonable decisions and act. Only escalate truly critical issues — the user trusts this agent to handle the routine.";

  const escalation = state.escalationTriggers.length > 0
    ? state.escalationTriggers
        .map((id) => {
          switch (id) {
            case "unexpected-data": return "    - Stop and alert if data looks anomalous or significantly different from historical patterns";
            case "send-message": return "    - Always require human approval before sending any message to a customer or external party";
            case "missing-source": return "    - If a data source is unreachable, log the error and alert the user instead of proceeding with incomplete data";
            case "empty-results": return "    - If results are empty, report that clearly rather than generating placeholder content";
            case "never": return "    - Run fully autonomously — log issues but don't stop for approval";
            default: return "";
          }
        })
        .filter(Boolean)
        .join("\n")
    : "    - Use reasonable judgment about when to proceed vs. when to flag for review";

  return `  **Goals and values:**
  - ${tradeOff}
  - ${detail}
  - ${autonomy}

  **Escalation triggers — stop and ask the user when:**
${escalation}`;
}

// ── Acceptance criteria ────────────────────────────────────────────────────────

function getAcceptanceCriteria(state: WizardState): string {
  const criteria: string[] = [];

  // Always include these
  criteria.push("The agent runs successfully with valid API credentials and produces the expected output format");
  criteria.push("All secrets are loaded from .env — no hardcoded credentials anywhere in the codebase");
  criteria.push("The README explains how to configure, run, and test the agent in plain language");

  // Trigger-specific
  if (state.trigger === "schedule") {
    criteria.push(`The agent runs on a ${state.scheduleFrequency ?? "daily"} schedule and each run is idempotent`);
  } else if (state.trigger === "data-change") {
    criteria.push("The agent correctly detects changes since the last run and only acts on new data");
  } else if (state.trigger === "manual") {
    criteria.push("The agent can be run via a single CLI command with --dry-run and --verbose flags");
  }

  // Output-specific
  if (state.outputs.includes("slack")) {
    criteria.push("Slack messages are well-formatted with Block Kit and include a clear summary");
  }
  if (state.outputs.includes("email-draft")) {
    criteria.push("Email drafts are saved but never auto-sent — the user reviews before sending");
  }

  return criteria.map((c, i) => `  ${i + 1}. ${c}`).join("\n");
}

// ── Evaluation scenarios ───────────────────────────────────────────────────────

function getEvaluationScenarios(state: WizardState): string {
  const scenarios: string[] = [];

  scenarios.push("**Dry run with test data**: Run the agent with sample/mock data. Verify the output matches the expected format and contains reasonable content.");
  scenarios.push("**Missing API key**: Remove one API key from .env and run the agent. It should display a clear, helpful error message — not crash with a stack trace.");
  scenarios.push("**Empty data set**: Run when there's nothing to report. The agent should output a friendly \"nothing to report\" message, not an error.");

  // Task-specific scenario
  const cat = lookup(CATEGORIES, state.category);
  if (cat) {
    switch (state.category) {
      case "customer-communication":
        scenarios.push("**Tone check**: Verify generated messages are professional, warm, and free of AI-sounding language like \"I hope this email finds you well.\"");
        break;
      case "data-monitoring":
        scenarios.push("**Threshold test**: Feed data that's just above and just below the alert threshold. Verify alerts fire correctly and only when they should.");
        break;
      case "reporting":
        scenarios.push("**Date range test**: Run for a period with known data. Verify all numbers match what you'd calculate manually.");
        break;
      case "content-creation":
        scenarios.push("**Quality check**: Review generated content for accuracy, readability, and adherence to your team's style/voice.");
        break;
      case "research-analysis":
        scenarios.push("**Pattern validation**: Run against historical data with known patterns. Verify the agent identifies the same trends a human would.");
        break;
      case "workflow-automation":
        scenarios.push("**Routing accuracy**: Test with 10 sample items. Verify each is routed/categorized correctly based on your team's rules.");
        break;
    }
  }

  scenarios.push("**Output delivery**: Verify the output actually arrives at the configured destination (Slack channel, file, email draft, etc.).");

  return scenarios.map((s, i) => `  ${i + 1}. ${s}`).join("\n");
}

// ── Requirements ───────────────────────────────────────────────────────────────

function getRequirements(state: WizardState): string {
  const reqs: string[] = [];
  let n = 1;

  // Data integration
  const sources = state.dataSources.map((id) => lookup(DATA_SOURCES, id)?.label ?? id);
  reqs.push(`${n++}. **Data Integration**: Connect to ${sources.join(", ")}. Authenticate using credentials from .env. Handle API rate limits and pagination.`);

  // AI processing
  const task = getTaskDescription(state);
  reqs.push(`${n++}. **AI Processing**: ${task}. Use Claude API (or the model available in the environment) for any text generation, summarization, or analysis.`);

  // Trigger/scheduling
  const trigger = lookup(TRIGGERS, state.trigger);
  if (trigger) {
    if (state.trigger === "schedule") {
      reqs.push(`${n++}. **Scheduling**: Run ${state.scheduleFrequency ?? "daily"} using node-cron or equivalent. Each run should be independent and idempotent.`);
    } else if (state.trigger === "data-change") {
      reqs.push(`${n++}. **Change Detection**: Poll for changes at a configurable interval. Track last-seen state to avoid duplicate processing.`);
    } else if (state.trigger === "manual") {
      reqs.push(`${n++}. **CLI Interface**: Accept command-line arguments. Support --dry-run (preview without acting) and --verbose (detailed logging).`);
    } else {
      reqs.push(`${n++}. **Hybrid Trigger**: Support both scheduled runs and event-driven triggers. Share core logic between both paths.`);
    }
  }

  // Output delivery
  const outputs = state.outputs.map((id) => lookup(OUTPUTS, id)?.label ?? id);
  reqs.push(`${n++}. **Output Delivery**: Send results to ${outputs.join(", ")}. Format appropriately for each destination.`);

  // Logging
  reqs.push(`${n++}. **Logging**: Log each run with timestamp, data fetched, actions taken, and any errors. Use structured console output (not a logging library).`);

  // Configuration
  reqs.push(`${n++}. **Configuration**: All settings (API keys, channel IDs, thresholds, schedule) in .env with sensible defaults. Include a .env.example file.`);

  // Error handling
  reqs.push(`${n++}. **Error Handling**: Catch and log errors gracefully. Never crash silently. If a critical error occurs, output a clear message explaining what went wrong and how to fix it.`);

  return reqs.map((r) => `  ${r}`).join("\n");
}

// ── Main generator ─────────────────────────────────────────────────────────────

export function generatePrompt(state: WizardState): string {
  const category = lookup(CATEGORIES, state.category);
  const task = state.task === "custom"
    ? { label: "Custom Task", description: state.customTask }
    : lookup(TASKS, state.task);
  const sources = state.dataSources.map((id) => lookup(DATA_SOURCES, id)?.label ?? id);
  const trigger = lookup(TRIGGERS, state.trigger);
  const outputs = state.outputs.map((id) => lookup(OUTPUTS, id)?.label ?? id);

  const setupSections = state.dataSources
    .map((id) => SETUP_GUIDES[id])
    .filter(Boolean)
    .join("\n\n");

  return `<role>
  You are an expert automation engineer building a production-ready agent for a non-technical CS/Support team.
  Explain everything in plain language. Default to action — build it, don't just suggest.
  When you need information from the user (API keys, preferences), ask interactively.
  Write clean TypeScript, use established packages, and keep the codebase simple enough that a non-developer can maintain it.
</role>

<task>
  Build an automated agent for the "${category?.label}" category.
  Specific task: ${task?.label} — ${task?.description ?? state.customTask}

  This agent is for a CS/Support team member who is not a developer. They need a tool
  that runs ${trigger?.label?.toLowerCase() ?? "as configured"} and delivers results to ${outputs.join(", ")}.
  The agent should work reliably with minimal maintenance and be easy to configure.

  Data sources: ${sources.join(", ")}
  Trigger: ${trigger?.label}${state.scheduleFrequency ? ` (${state.scheduleFrequency})` : ""}
  Output: ${outputs.join(", ")}
</task>

<context>
  **Environment:**
  - Runtime: Node.js with TypeScript (tsx for execution)
  - Package manager: npm
  - This will run on the user's local machine or a simple server
  - All credentials stored in .env (gitignored)

  **Team context:**
  - The user is a CS/Support team member, not a developer
  - They can run CLI commands but shouldn't need to modify code
  - All configuration should happen through .env and simple config files
  - Documentation must be in plain language with step-by-step instructions

  **Data sources in use:**
  ${sources.map((s) => `- ${s}`).join("\n  ")}
</context>

<intent>
${getIntentSection(state)}
</intent>

<acceptance_criteria>
${getAcceptanceCriteria(state)}
</acceptance_criteria>

<requirements>
${getRequirements(state)}
</requirements>

<setup_guidance>
  Walk the user through setting up each data source interactively.
  For each one, ask if they already have credentials. If not, guide them step by step.

${setupSections}

  **General setup:**
  - Create a .env.example with all required variables (values blanked out)
  - Create a README.md with plain-language setup instructions
  - Include a "Quick Start" section that gets them running in under 5 minutes
</setup_guidance>

<architecture>
${getTriggerArchitecture(state)}

  **Shared structure:**
  - src/config.ts — loads .env, exports typed configuration, validates required vars
  - src/sources/ — one file per data source (hubspot.ts, slack.ts, etc.)
  - src/output.ts — handles formatting and delivering results
  - src/agent.ts — core logic that orchestrates fetch → process → deliver
  - src/index.ts — entry point (sets up trigger, calls agent)
  - tests/ — at least one test file that runs the agent with mock data
</architecture>

<output_specification>
${getOutputSpec(state)}

  **General formatting rules:**
  - Use plain language, not technical jargon
  - Include timestamps in a human-readable format
  - Bold key information (names, numbers, status changes)
  - Keep the most important information at the top
  - If output is long, include a TL;DR summary at the beginning
</output_specification>

<constraints>
  **MUSTS:**
  - Use TypeScript for all source files
  - Store all secrets in .env (never hardcode)
  - Include a comprehensive README with setup and usage instructions
  - Handle errors gracefully — log clearly, never crash silently
  - Include a test/dry-run mode that works without making real API calls
  - Include a .env.example file with all required variables

  **MUST-NOTS:**
  - Never hardcode API keys, tokens, or secrets
  - Never output raw JSON to the user — always format for readability
  - Never auto-send emails or messages without explicit user configuration
  - Never silently skip errors — always log what went wrong
  - Never require the user to modify source code for basic configuration

  **PREFERENCES:**
  - Simple over clever — prioritize readability
  - Established packages (axios, node-cron) over custom implementations
  - Single responsibility — each file does one thing well
  - Comments only on non-obvious logic — don't over-document
  - Flat file structure — avoid deep nesting

  **ESCALATION TRIGGERS:**
  - If an API key is missing or invalid → stop and tell the user exactly which key is needed and how to get it
  - If a data source returns unexpected data → log the raw response and continue with a warning
  - If the output destination is unreachable → save output locally as a fallback and alert the user
  - If rate-limited → wait and retry with exponential backoff, log the delay
</constraints>

<evaluation>
  Test the agent against these scenarios before considering it done:

${getEvaluationScenarios(state)}
</evaluation>`;
}
