"use client";

import type { StepProps, ToneId } from "@/lib/types";
import { TONES } from "@/lib/wizard-data";
import OptionCard from "../OptionCard";

export default function GroundRulesStep({ state, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Tone selection */}
      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">
          What tone should the agent use? *
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TONES.map((t) => (
            <OptionCard
              key={t.id}
              icon={t.icon}
              label={t.label}
              description={t.description}
              selected={state.tone === t.id}
              onClick={() => onChange({ tone: t.id })}
            />
          ))}
        </div>
      </div>

      {/* Must-always rules */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rules the agent must always follow{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={state.mustAlways}
          onChange={(e) => onChange({ mustAlways: e.target.value })}
          placeholder="e.g. Always include the account name and CSM in reports. Always link to the source ticket."
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm"
        />
      </div>

      {/* Never-do rules */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What should the agent NEVER do?{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={state.neverDo}
          onChange={(e) => onChange({ neverDo: e.target.value })}
          placeholder="e.g. Never mention internal pricing. Never contact the customer directly. Never delete data."
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm"
        />
      </div>

      {/* Alert recipient */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Who should be alerted if something goes wrong?{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={state.alertRecipient}
          onChange={(e) => onChange({ alertRecipient: e.target.value })}
          placeholder="e.g. @sean in Slack, or sean@company.com"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            text-sm"
        />
      </div>

      {/* Example output */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Paste an example of ideal output{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={state.exampleOutput}
          onChange={(e) => onChange({ exampleOutput: e.target.value })}
          placeholder="Paste a sample of what you'd like the agent's output to look like..."
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm font-mono"
        />
      </div>
    </div>
  );
}
