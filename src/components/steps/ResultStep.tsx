"use client";

import { useMemo } from "react";
import type { WizardState } from "@/lib/types";
import { CATEGORIES, TASKS, DATA_SOURCES, TRIGGERS, OUTPUTS, TONES } from "@/lib/wizard-data";
import { generatePrompt } from "@/lib/prompt-generator";
import { recommendStack } from "@/lib/recommendation-engine";
import type { StackChoice } from "@/lib/types";
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

function StackLayerRow({ label, choice }: { label: string; choice: StackChoice }) {
  return (
    <div className="flex gap-3">
      <span className="text-gray-500 shrink-0 w-28 pt-0.5">{label}:</span>
      <div>
        <span className="text-gray-100">{choice.name}</span>
        <p className="text-xs text-gray-500 mt-0.5">{choice.reason}</p>
        <p className="text-xs text-gray-600 mt-0.5 italic">Reconsider if: {choice.changeIf}</p>
      </div>
    </div>
  );
}

export default function ResultStep({ state, onStartOver }: ResultStepProps) {
  const prompt = useMemo(() => generatePrompt(state), [state]);
  const stack = useMemo(() => recommendStack(state), [state]);

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
            <span className="text-gray-500">Tone:</span>{" "}
            <span className="text-gray-100">{label(TONES, state.tone)}</span>
          </div>
          <div>
            <span className="text-gray-500">Style:</span>{" "}
            <span className="text-gray-100">
              {state.tradeOff === "accuracy" ? "Accurate" : "Fast"},{" "}
              {state.detailLevel === "comprehensive" ? "Detailed" : "Concise"},{" "}
              {state.autonomy === "cautious" ? "Cautious" : "Autonomous"},{" "}
              {state.failMode === "stop" ? "Fail-closed" : "Fail-open"}
            </span>
          </div>
        </div>
        {/* Extended details from new steps */}
        {(state.problemDescription.trim() || state.mustAlways.trim() || state.neverDo.trim() || state.gotchas.trim() || state.antiGoals.trim() || state.preferences.trim() || state.hardPart.trim()) && (
          <div className="mt-4 pt-4 border-t border-gray-800 space-y-2 text-sm">
            {state.problemDescription.trim() && (
              <div>
                <span className="text-gray-500">Problem:</span>{" "}
                <span className="text-gray-100">
                  {state.problemDescription.slice(0, 120)}
                  {state.problemDescription.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.successDefinition.trim() && (
              <div>
                <span className="text-gray-500">Success:</span>{" "}
                <span className="text-gray-100">
                  {state.successDefinition.slice(0, 120)}
                  {state.successDefinition.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.mustAlways.trim() && (
              <div>
                <span className="text-gray-500">Must always:</span>{" "}
                <span className="text-gray-100">
                  {state.mustAlways.slice(0, 120)}
                  {state.mustAlways.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.neverDo.trim() && (
              <div>
                <span className="text-gray-500">Never do:</span>{" "}
                <span className="text-gray-100">
                  {state.neverDo.slice(0, 120)}
                  {state.neverDo.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.gotchas.trim() && (
              <div>
                <span className="text-gray-500">Gotchas:</span>{" "}
                <span className="text-gray-100">
                  {state.gotchas.slice(0, 120)}
                  {state.gotchas.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.hardPart.trim() && (
              <div>
                <span className="text-gray-500">Hard part:</span>{" "}
                <span className="text-gray-100">
                  {state.hardPart.slice(0, 120)}
                  {state.hardPart.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.antiGoals.trim() && (
              <div>
                <span className="text-gray-500">Anti-goals:</span>{" "}
                <span className="text-gray-100">
                  {state.antiGoals.slice(0, 120)}
                  {state.antiGoals.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.preferences.trim() && (
              <div>
                <span className="text-gray-500">Preferences:</span>{" "}
                <span className="text-gray-100">
                  {state.preferences.slice(0, 120)}
                  {state.preferences.length > 120 ? "..." : ""}
                </span>
              </div>
            )}
            {state.alertRecipient.trim() && (
              <div>
                <span className="text-gray-500">Alert:</span>{" "}
                <span className="text-gray-100">{state.alertRecipient}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommended Stack */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Recommended Automation Stack
          </h3>
          <span className="text-xs font-mono bg-gray-800 text-amber-400 px-2 py-1 rounded">
            Complexity: {stack.complexity.score}/15
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          Auto-selected based on your answers. Included in the generated prompt.
        </p>
        {stack.complexity.factors.length > 0 && (
          <p className="text-xs text-gray-600 mb-4">
            Factors: {stack.complexity.factors.join(" · ")}
          </p>
        )}

        <div className="space-y-4 text-sm">
          <StackLayerRow label="Runtime" choice={stack.runtime} />
          <StackLayerRow label="Brain" choice={stack.brain} />
          <StackLayerRow label="Integration Strategy" choice={stack.integrationStrategy} />

          <div className="flex gap-3">
            <span className="text-gray-500 shrink-0 w-28 pt-0.5">Integrations:</span>
            <div className="space-y-2">
              {stack.integrations.map((integ) => (
                <div key={integ.name}>
                  <span className="text-gray-100">{integ.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{integ.reason}</p>
                  <p className="text-xs text-gray-600 mt-0.5 italic">Reconsider if: {integ.changeIf}</p>
                </div>
              ))}
            </div>
          </div>

          {stack.safetyLayer ? (
            <StackLayerRow label="Safety" choice={stack.safetyLayer} />
          ) : (
            <div className="flex gap-3">
              <span className="text-gray-500 shrink-0 w-28 pt-0.5">Safety:</span>
              <div>
                <span className="text-gray-400 italic">None — no approval gates</span>
                <p className="text-xs text-gray-600 mt-0.5 italic">
                  Reconsider if: you want human approval before sending messages or taking destructive actions.
                </p>
              </div>
            </div>
          )}

          <StackLayerRow label="Pattern" choice={stack.pattern} />
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
