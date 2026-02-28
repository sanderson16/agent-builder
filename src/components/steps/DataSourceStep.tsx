"use client";

import type { StepProps, DataSourceId } from "@/lib/types";
import { DATA_SOURCES } from "@/lib/wizard-data";
import OptionCard from "../OptionCard";

export default function DataSourceStep({ state, onChange }: StepProps) {
  const toggle = (id: DataSourceId) => {
    const current = state.dataSources;
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    onChange({ dataSources: next });
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Select all that apply.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DATA_SOURCES.map((ds) => (
          <OptionCard
            key={ds.id}
            icon={ds.icon}
            label={ds.label}
            description={ds.description}
            selected={state.dataSources.includes(ds.id)}
            onClick={() => toggle(ds.id)}
          />
        ))}
      </div>
    </div>
  );
}
