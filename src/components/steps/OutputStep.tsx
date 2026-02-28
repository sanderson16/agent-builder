"use client";

import type { StepProps, OutputId } from "@/lib/types";
import { OUTPUTS } from "@/lib/wizard-data";
import OptionCard from "../OptionCard";

export default function OutputStep({ state, onChange }: StepProps) {
  const toggle = (id: OutputId) => {
    const current = state.outputs;
    const next = current.includes(id)
      ? current.filter((o) => o !== id)
      : [...current, id];
    onChange({ outputs: next });
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Select all that apply.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OUTPUTS.map((o) => (
          <OptionCard
            key={o.id}
            icon={o.icon}
            label={o.label}
            description={o.description}
            selected={state.outputs.includes(o.id)}
            onClick={() => toggle(o.id)}
          />
        ))}
      </div>
    </div>
  );
}
