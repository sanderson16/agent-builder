"use client";

import type { StepProps, ScheduleFrequency } from "@/lib/types";
import { TRIGGERS } from "@/lib/wizard-data";
import OptionCard from "../OptionCard";

const FREQUENCIES: { id: ScheduleFrequency; label: string }[] = [
  { id: "hourly", label: "Hourly" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
];

export default function TriggerStep({ state, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRIGGERS.map((t) => (
          <OptionCard
            key={t.id}
            icon={t.icon}
            label={t.label}
            description={t.description}
            selected={state.trigger === t.id}
            onClick={() => onChange({ trigger: t.id, scheduleFrequency: null })}
          />
        ))}
      </div>

      {state.trigger === "schedule" && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-3">How often?</p>
          <div className="flex gap-3">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ scheduleFrequency: f.id })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                  ${
                    state.scheduleFrequency === f.id
                      ? "border-primary-500 bg-primary-500/10 text-primary-400"
                      : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
