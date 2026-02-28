import type {
  Category,
  Task,
  DataSource,
  Trigger,
  Output,
  EscalationTrigger,
  StepMeta,
} from "./types";

// ── Step metadata ──────────────────────────────────────────────────────────────

export const STEPS: StepMeta[] = [
  { number: 1, title: "What part of your job?", subtitle: "Pick the area you spend the most time on" },
  { number: 2, title: "What do you wish was automatic?", subtitle: "Choose a task — or describe your own in plain English" },
  { number: 3, title: "Where does the info live?", subtitle: "Pick every tool this agent should pull data from" },
  { number: 4, title: "When should it run?", subtitle: "Tell us how often you need this done" },
  { number: 5, title: "Where do you want results?", subtitle: "Pick where the finished work should show up" },
  { number: 6, title: "How should it think?", subtitle: "Tell the agent what matters most to you" },
];

// ── Categories (Step 1) ────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    id: "customer-communication",
    label: "Customer Communication",
    description: "Emails, follow-ups, meeting summaries, and outreach",
    icon: "💬",
  },
  {
    id: "data-monitoring",
    label: "Data Monitoring & Alerts",
    description: "Deal changes, ticket spikes, health scores, usage drops",
    icon: "📊",
  },
  {
    id: "reporting",
    label: "Reporting & Summaries",
    description: "Daily briefs, weekly recaps, pipeline reports",
    icon: "📋",
  },
  {
    id: "content-creation",
    label: "Content Creation",
    description: "KB articles, onboarding docs, QBR prep, release notes",
    icon: "✏️",
  },
  {
    id: "research-analysis",
    label: "Research & Analysis",
    description: "Feature request trends, churn patterns, sentiment tracking",
    icon: "🔍",
  },
  {
    id: "workflow-automation",
    label: "Workflow Automation",
    description: "Ticket routing, handoff docs, meeting prep, SLA tracking",
    icon: "⚙️",
  },
];

// ── Tasks (Step 2) — 4 per category ────────────────────────────────────────────

export const TASKS: Task[] = [
  // Customer Communication
  {
    id: "post-meeting-summary",
    categoryId: "customer-communication",
    label: "Post-Meeting Summary & Follow-Up",
    description: "Summarize meeting notes and draft a follow-up email to attendees",
  },
  {
    id: "renewal-outreach",
    categoryId: "customer-communication",
    label: "Renewal Outreach Drafter",
    description: "Draft personalized renewal emails using account health and history",
  },
  {
    id: "escalation-response",
    categoryId: "customer-communication",
    label: "Escalation Response Drafter",
    description: "Draft professional responses to escalated tickets with context from history",
  },
  {
    id: "proactive-checkin",
    categoryId: "customer-communication",
    label: "Proactive Check-In Generator",
    description: "Generate personalized check-in messages based on recent account activity",
  },

  // Data Monitoring
  {
    id: "deal-change-alerts",
    categoryId: "data-monitoring",
    label: "Deal Change Alerts",
    description: "Monitor CRM for deal stage changes and alert the team in real-time",
  },
  {
    id: "ticket-spike-detection",
    categoryId: "data-monitoring",
    label: "Ticket Spike Detection",
    description: "Detect unusual spikes in support tickets and categorize the root cause",
  },
  {
    id: "health-score-monitor",
    categoryId: "data-monitoring",
    label: "Health Score Monitor",
    description: "Track customer health score changes and flag at-risk accounts",
  },
  {
    id: "usage-drop-alerts",
    categoryId: "data-monitoring",
    label: "Usage Drop Alerts",
    description: "Detect significant drops in product usage and alert the CSM",
  },

  // Reporting
  {
    id: "daily-brief",
    categoryId: "reporting",
    label: "Daily Brief",
    description: "Compile a morning briefing of key metrics, new tickets, and action items",
  },
  {
    id: "weekly-recap",
    categoryId: "reporting",
    label: "Weekly Recap",
    description: "Summarize the week — resolved tickets, meetings held, pipeline changes",
  },
  {
    id: "pipeline-report",
    categoryId: "reporting",
    label: "Pipeline Report",
    description: "Generate a current snapshot of the sales/renewal pipeline with trends",
  },
  {
    id: "team-performance",
    categoryId: "reporting",
    label: "Team Performance Summary",
    description: "Compile response times, resolution rates, and CSAT scores for the team",
  },

  // Content Creation
  {
    id: "kb-article-drafter",
    categoryId: "content-creation",
    label: "KB Article Drafter",
    description: "Draft knowledge base articles from resolved tickets or common questions",
  },
  {
    id: "onboarding-doc",
    categoryId: "content-creation",
    label: "Onboarding Doc Generator",
    description: "Create customer onboarding documents from account and product details",
  },
  {
    id: "qbr-prep",
    categoryId: "content-creation",
    label: "QBR Prep Pack",
    description: "Assemble quarterly business review materials from usage and support data",
  },
  {
    id: "release-notes",
    categoryId: "content-creation",
    label: "Release Notes Drafter",
    description: "Draft customer-facing release notes from Jira tickets and PRs",
  },

  // Research & Analysis
  {
    id: "feature-request-trends",
    categoryId: "research-analysis",
    label: "Feature Request Trends",
    description: "Analyze and categorize feature requests to find patterns across accounts",
  },
  {
    id: "churn-pattern-analysis",
    categoryId: "research-analysis",
    label: "Churn Pattern Analysis",
    description: "Identify common factors in recently churned accounts",
  },
  {
    id: "sentiment-tracker",
    categoryId: "research-analysis",
    label: "Sentiment Tracker",
    description: "Analyze communication sentiment trends across your book of business",
  },
  {
    id: "competitive-intel",
    categoryId: "research-analysis",
    label: "Competitive Intel Digest",
    description: "Compile mentions of competitors from calls, tickets, and Slack conversations",
  },

  // Workflow Automation
  {
    id: "ticket-routing",
    categoryId: "workflow-automation",
    label: "Smart Ticket Router",
    description: "Automatically categorize and route incoming tickets to the right team member",
  },
  {
    id: "handoff-doc",
    categoryId: "workflow-automation",
    label: "Customer Handoff Doc",
    description: "Generate comprehensive handoff documents when accounts change owners",
  },
  {
    id: "meeting-prep",
    categoryId: "workflow-automation",
    label: "Meeting Prep Pack",
    description: "Auto-compile account context, recent tickets, and talking points before calls",
  },
  {
    id: "sla-tracker",
    categoryId: "workflow-automation",
    label: "SLA Tracker & Alerter",
    description: "Monitor SLA deadlines and alert before breaches occur",
  },
];

// ── Data Sources (Step 3) ──────────────────────────────────────────────────────

export const DATA_SOURCES: DataSource[] = [
  { id: "hubspot", label: "HubSpot", description: "CRM contacts, deals, tickets, notes", icon: "🟠" },
  { id: "slack", label: "Slack", description: "Channels, messages, threads", icon: "💜" },
  { id: "jira", label: "Jira", description: "Issues, sprints, project boards", icon: "🔵" },
  { id: "confluence", label: "Confluence", description: "Pages, spaces, documentation", icon: "📘" },
  { id: "fireflies", label: "Fireflies", description: "Meeting transcripts and summaries", icon: "🔥" },
  { id: "email", label: "Email", description: "Gmail or Outlook messages and threads", icon: "📧" },
  { id: "github", label: "GitHub", description: "Repos, issues, PRs, commits", icon: "🐙" },
  { id: "bitbucket", label: "Bitbucket", description: "Repos, PRs, pipelines", icon: "🪣" },
  { id: "obsidian", label: "Obsidian", description: "Local notes and knowledge vault", icon: "💎" },
  { id: "other", label: "Other", description: "Custom API or data source", icon: "🔗" },
];

// ── Triggers (Step 4) ──────────────────────────────────────────────────────────

export const TRIGGERS: Trigger[] = [
  {
    id: "schedule",
    label: "On a Schedule",
    description: "Run automatically at set intervals — hourly, daily, or weekly",
    icon: "🕐",
  },
  {
    id: "data-change",
    label: "When Data Changes",
    description: "Run when a specific event occurs — new ticket, deal update, message",
    icon: "⚡",
  },
  {
    id: "manual",
    label: "Manual Trigger",
    description: "Run on-demand when you need it — via CLI or shortcut",
    icon: "👆",
  },
  {
    id: "combination",
    label: "Combination",
    description: "Mix of scheduled runs and event-driven triggers",
    icon: "🔀",
  },
];

// ── Outputs (Step 5) ───────────────────────────────────────────────────────────

export const OUTPUTS: Output[] = [
  { id: "slack", label: "Slack Message", description: "Post results to a Slack channel or DM", icon: "💜" },
  { id: "document", label: "Document / Note", description: "Save to Confluence, Obsidian, or a file", icon: "📄" },
  { id: "email-draft", label: "Email Draft", description: "Create a draft email ready to review and send", icon: "📧" },
  { id: "spreadsheet", label: "Spreadsheet / Report", description: "Output to CSV, JSON, or a formatted report", icon: "📊" },
  { id: "multiple", label: "Multiple Outputs", description: "Send to several destinations at once", icon: "📡" },
];

// ── Escalation Triggers (Step 6) ───────────────────────────────────────────────

export const ESCALATION_TRIGGERS: EscalationTrigger[] = [
  { id: "unexpected-data", label: "When data looks unexpected" },
  { id: "send-message", label: "When it would send a message to someone" },
  { id: "missing-source", label: "When it can't access a data source" },
  { id: "empty-results", label: "When results are empty" },
  { id: "never", label: "Never — just log and continue" },
];
