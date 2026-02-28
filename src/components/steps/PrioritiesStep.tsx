"use client";

import type { StepProps, EscalationTriggerId } from "@/lib/types";
import { ESCALATION_TRIGGERS } from "@/lib/wizard-data";

interface TogglePairProps {
  question: string;
  optionA: { label: string; description: string };
  optionB: { label: string; description: string };
  value: string | null;
  onSelect: (value: string) => void;
  valueA: string;
  valueB: string;
}

function TogglePair({ question, optionA, optionB, value, onSelect, valueA, valueB }: TogglePairProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-300">{question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect(valueA)}
          className={`text-left p-4 rounded-lg border transition-all
            ${
              value === valueA
                ? "border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30"
                : "border-gray-800 bg-gray-900 hover:border-gray-700"
            }`}
        >
          <p className={`font-medium text-sm ${value === valueA ? "text-primary-400" : "text-gray-100"}`}>
            {optionA.label}
          </p>
          <p className="text-xs text-gray-400 mt-1">{optionA.description}</p>
        </button>
        <button
          type="button"
          onClick={() => onSelect(valueB)}
          className={`text-left p-4 rounded-lg border transition-all
            ${
              value === valueB
                ? "border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30"
                : "border-gray-800 bg-gray-900 hover:border-gray-700"
            }`}
        >
          <p className={`font-medium text-sm ${value === valueB ? "text-primary-400" : "text-gray-100"}`}>
            {optionB.label}
          </p>
          <p className="text-xs text-gray-400 mt-1">{optionB.description}</p>
        </button>
      </div>
    </div>
  );
}

export default function PrioritiesStep({ state, onChange }: StepProps) {
  const toggleEscalation = (id: EscalationTriggerId) => {
    const current = state.escalationTriggers;
    if (id === "never") {
      onChange({ escalationTriggers: current.includes("never") ? [] : ["never"] });
      return;
    }
    const without = current.filter((t) => t !== "never");
    const next = without.includes(id)
      ? without.filter((t) => t !== id)
      : [...without, id];
    onChange({ escalationTriggers: next });
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">
        When your agent has to make a trade-off, what matters more?
      </p>

      <TogglePair
        question="Speed vs. accuracy?"
        optionA={{ label: "Accuracy over speed", description: "Take time to get it right" }}
        optionB={{ label: "Speed over perfection", description: "Good enough, fast" }}
        value={state.tradeOff}
        onSelect={(v) => onChange({ tradeOff: v as "accuracy" | "speed" })}
        valueA="accuracy"
        valueB="speed"
      />

      <TogglePair
        question="Detail level?"
        optionA={{ label: "Comprehensive over concise", description: "Include everything relevant" }}
        optionB={{ label: "Brief over thorough", description: "Just the highlights" }}
        value={state.detailLevel}
        onSelect={(v) => onChange({ detailLevel: v as "comprehensive" | "concise" })}
        valueA="comprehensive"
        valueB="concise"
      />

      <TogglePair
        question="How autonomous?"
        optionA={{ label: "Cautious", description: "Flag anything uncertain for human review" }}
        optionB={{ label: "Autonomous", description: "Decide and act, only escalate critical issues" }}
        value={state.autonomy}
        onSelect={(v) => onChange({ autonomy: v as "cautious" | "autonomous" })}
        valueA="cautious"
        valueB="autonomous"
      />

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-300">
          When should your agent stop and ask you?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ESCALATION_TRIGGERS.map((et) => (
            <button
              key={et.id}
              type="button"
              onClick={() => toggleEscalation(et.id)}
              className={`text-left px-4 py-3 rounded-lg border text-sm transition-all
                ${
                  state.escalationTriggers.includes(et.id)
                    ? "border-primary-500 bg-primary-500/10 text-primary-400"
                    : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                }`}
            >
              {et.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
