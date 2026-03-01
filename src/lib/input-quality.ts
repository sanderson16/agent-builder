type Quality = "weak" | "good" | "great";

const TOOL_WORDS = [
  "hubspot", "slack", "jira", "confluence", "fireflies", "email",
  "github", "bitbucket", "obsidian", "salesforce", "zendesk",
  "spreadsheet", "google doc", "excel", "notion", "asana",
];
const TIME_WORDS = [
  "hour", "minute", "daily", "weekly", "monday", "friday",
  "morning", "afternoon", "every week", "each day", "per week",
  "takes me", "spend", "waste",
];
const OUTPUT_WORDS = [
  "summary", "report", "message", "email", "doc", "document",
  "alert", "notification", "update", "draft", "post",
];

function hasSignal(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
}

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

export function assessProblemDescription(text: string): Quality {
  const trimmed = text.trim();
  if (trimmed.length < 30) return "weak";

  let signals = 0;
  if (hasSignal(trimmed, TOOL_WORDS)) signals++;
  if (hasSignal(trimmed, TIME_WORDS)) signals++;
  if (hasSignal(trimmed, OUTPUT_WORDS)) signals++;
  if (hasNumber(trimmed)) signals++;

  if (signals === 0) return "weak";
  if (trimmed.length >= 100 && signals >= 2) return "great";
  if (trimmed.length >= 50 && signals >= 1) return "good";
  return "weak";
}
