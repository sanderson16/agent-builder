// Category IDs
export type CategoryId =
  | "customer-communication"
  | "data-monitoring"
  | "reporting"
  | "content-creation"
  | "research-analysis"
  | "workflow-automation";

// Task IDs
export type TaskId =
  // Customer Communication
  | "post-meeting-summary"
  | "renewal-outreach"
  | "escalation-response"
  | "proactive-checkin"
  // Data Monitoring
  | "deal-change-alerts"
  | "ticket-spike-detection"
  | "health-score-monitor"
  | "usage-drop-alerts"
  // Reporting
  | "daily-brief"
  | "weekly-recap"
  | "pipeline-report"
  | "team-performance"
  // Content Creation
  | "kb-article-drafter"
  | "onboarding-doc"
  | "qbr-prep"
  | "release-notes"
  // Research & Analysis
  | "feature-request-trends"
  | "churn-pattern-analysis"
  | "sentiment-tracker"
  | "competitive-intel"
  // Workflow Automation
  | "ticket-routing"
  | "handoff-doc"
  | "meeting-prep"
  | "sla-tracker"
  | "custom";

// Data source IDs
export type DataSourceId =
  | "hubspot"
  | "slack"
  | "jira"
  | "confluence"
  | "fireflies"
  | "email"
  | "github"
  | "bitbucket"
  | "obsidian"
  | "other";

// Trigger IDs
export type TriggerId =
  | "schedule"
  | "data-change"
  | "manual"
  | "combination";

// Schedule frequency
export type ScheduleFrequency = "hourly" | "daily" | "weekly";

// Output IDs
export type OutputId =
  | "slack"
  | "document"
  | "email-draft"
  | "spreadsheet"
  | "multiple";

// Trade-off preferences
export type TradeOff = "accuracy" | "speed";
export type DetailLevel = "comprehensive" | "concise";
export type Autonomy = "cautious" | "autonomous";

// Tone IDs (Step 7 — Ground rules)
export type ToneId = "professional" | "friendly" | "casual" | "technical";

// Fail mode (Step 8 — Priorities)
export type FailMode = "stop" | "continue";

// Escalation triggers
export type EscalationTriggerId =
  | "unexpected-data"
  | "send-message"
  | "missing-source"
  | "empty-results"
  | "never";

// Category definition
export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: string;
}

// Task definition
export interface Task {
  id: TaskId;
  categoryId: CategoryId;
  label: string;
  description: string;
}

// Data source definition
export interface DataSource {
  id: DataSourceId;
  label: string;
  description: string;
  icon: string;
}

// Trigger definition
export interface Trigger {
  id: TriggerId;
  label: string;
  description: string;
  icon: string;
}

// Output definition
export interface Output {
  id: OutputId;
  label: string;
  description: string;
  icon: string;
}

// Escalation trigger definition
export interface EscalationTrigger {
  id: EscalationTriggerId;
  label: string;
}

// Tone definition
export interface Tone {
  id: ToneId;
  label: string;
  description: string;
  icon: string;
}

// Full wizard state
export interface WizardState {
  category: CategoryId | null;
  task: TaskId | null;
  customTask: string;
  // Step 3 — Tell us more
  problemDescription: string;
  manualProcess: string;
  successDefinition: string;
  dataSources: DataSourceId[];
  trigger: TriggerId | null;
  scheduleFrequency: ScheduleFrequency | null;
  outputs: OutputId[];
  // Step 7 — Ground rules
  tone: ToneId | null;
  mustAlways: string;
  neverDo: string;
  alertRecipient: string;
  exampleOutput: string;
  // Step 8 — Priorities
  tradeOff: TradeOff | null;
  detailLevel: DetailLevel | null;
  autonomy: Autonomy | null;
  escalationTriggers: EscalationTriggerId[];
  failMode: FailMode | null;
}

// Step props shared interface
export interface StepProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}

// Step metadata
export interface StepMeta {
  number: number;
  title: string;
  subtitle: string;
}
