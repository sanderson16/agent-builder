"use client";

import { useMemo } from "react";
import type { WizardState } from "@/lib/types";
import { CATEGORIES, TASKS, DATA_SOURCES, TRIGGERS, OUTPUTS } from "@/lib/wizard-data";
import { generatePrompt } from "@/lib/prompt-generator";
import PromptDisplay from "../PromptDisplay";

interface ResultStepProps {
  state: WizardState;
  onStartOver: () => void;
}

function label<T extends { id: string; label: string }>(items: T[], id: string | null): string {
  return items.find((i) => i.id === id)?.label ?? "—";
}

function labels<T extends { id: string; label: string }>(items: T[], ids: string[]): string {
  return ids.map((id) => items.find((i) => i.id === id)?.label ?? id).join(", ") || "—";
}

export default function ResultStep({ state, onStartOver }: ResultStepProps) {
  const prompt = useMemo(() => generatePrompt(state), [state]);

  const taskLabel =
    state.task === "custom"
      ? `Custom: ${state.customTask.slice(0, 60)}${state.customTask.length > 60 ? "..." : ""}`
      : label(TASKS, state.task);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Your Agent Prompt</h2>
        <p className="text-gray-400 mt-1">
          Review your selections, then copy the prompt and paste it into Claude Code.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div>
            <span className="text-gray-500">Category:</span>{" "}
            <span className="text-gray-100">{label(CATEGORIES, state.category)}</span>
          </div>
          <div>
            <span className="text-gray-500">Task:</span>{" "}
            <span className="text-gray-100">{taskLabel}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Sources:</span>{" "}
            <span className="text-gray-100">{labels(DATA_SOURCES, state.dataSources)}</span>
          </div>
          <div>
            <span className="text-gray-500">Trigger:</span>{" "}
            <span className="text-gray-100">
              {label(TRIGGERS, state.trigger)}
              {state.scheduleFrequency ? ` (${state.scheduleFrequency})` : ""}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Output:</span>{" "}
            <span className="text-gray-100">{labels(OUTPUTS, state.outputs)}</span>
          </div>
          <div>
            <span className="text-gray-500">Style:</span>{" "}
            <span className="text-gray-100">
              {state.tradeOff === "accuracy" ? "Accurate" : "Fast"},{" "}
              {state.detailLevel === "comprehensive" ? "Detailed" : "Concise"},{" "}
              {state.autonomy === "cautious" ? "Cautious" : "Autonomous"}
            </span>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <PromptDisplay prompt={prompt} />

      {/* Next steps */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          What to do next
        </h3>
        <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
          <li>
            Click <strong className="text-white">Copy to Clipboard</strong> above
          </li>
          <li>
            Open your terminal and run{" "}
            <code className="text-amber-400 bg-gray-800 px-1.5 py-0.5 rounded">claude</code>{" "}
            to start Claude Code
          </li>
          <li>Paste the prompt and press Enter</li>
          <li>
            Claude Code will ask you for API keys and preferences — just follow the prompts
          </li>
          <li>Your agent will be built and ready to test</li>
        </ol>
      </div>

      {/* Start over */}
      <div className="text-center">
        <button
          type="button"
          onClick={onStartOver}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-4"
        >
          Start over with a new agent
        </button>
      </div>
    </div>
  );
}
