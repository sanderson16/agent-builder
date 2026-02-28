"use client";

import type { StepProps } from "@/lib/types";
import { TASKS } from "@/lib/wizard-data";
import OptionCard from "../OptionCard";

export default function TaskStep({ state, onChange }: StepProps) {
  const filtered = TASKS.filter((t) => t.categoryId === state.category);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((task) => (
          <OptionCard
            key={task.id}
            label={task.label}
            description={task.description}
            selected={state.task === task.id}
            onClick={() => onChange({ task: task.id, customTask: "" })}
          />
        ))}
        <OptionCard
          icon="✍️"
          label="Describe Your Own"
          description="Have something else in mind? Describe it below"
          selected={state.task === "custom"}
          onClick={() => onChange({ task: "custom" })}
        />
      </div>

      {state.task === "custom" && (
        <div className="mt-4">
          <textarea
            value={state.customTask}
            onChange={(e) => onChange({ customTask: e.target.value })}
            placeholder="Describe the task you want to automate..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
              placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
              resize-none text-sm"
          />
        </div>
      )}
    </div>
  );
}
