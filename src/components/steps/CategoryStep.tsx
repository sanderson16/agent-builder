"use client";

import type { StepProps } from "@/lib/types";
import { CATEGORIES } from "@/lib/wizard-data";
import OptionCard from "../OptionCard";

export default function CategoryStep({ state, onChange }: StepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {CATEGORIES.map((cat) => (
        <OptionCard
          key={cat.id}
          icon={cat.icon}
          label={cat.label}
          description={cat.description}
          selected={state.category === cat.id}
          onClick={() => onChange({ category: cat.id, task: null, customTask: "" })}
        />
      ))}
    </div>
  );
}
