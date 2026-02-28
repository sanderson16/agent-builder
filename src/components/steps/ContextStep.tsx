"use client";

import type { StepProps } from "@/lib/types";

export default function ContextStep({ state, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          In your own words, what problem does this solve? *
        </label>
        <textarea
          value={state.problemDescription}
          onChange={(e) => onChange({ problemDescription: e.target.value })}
          placeholder="e.g. Every Monday I spend 2 hours pulling data from HubSpot and Slack to write a pipeline summary for my manager..."
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What steps do you follow when doing this manually?{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={state.manualProcess}
          onChange={(e) => onChange({ manualProcess: e.target.value })}
          placeholder="e.g. 1. Open HubSpot and export this week's deals. 2. Check Slack #renewals for any updates. 3. Paste into a Google Doc..."
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          How will you know the agent is doing a good job?{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={state.successDefinition}
          onChange={(e) => onChange({ successDefinition: e.target.value })}
          placeholder="e.g. The summary matches what I would have written manually, my manager stops asking me for corrections..."
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm"
        />
      </div>
    </div>
  );
}
