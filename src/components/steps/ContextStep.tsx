"use client";

import { useState, useEffect } from "react";
import type { StepProps } from "@/lib/types";
import { assessProblemDescription } from "@/lib/input-quality";
import HelpText from "../HelpText";

function QualityIndicator({ text }: { text: string }) {
  const quality = assessProblemDescription(text);
  if (!text.trim()) return null;

  if (quality === "great") {
    return (
      <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Great detail
      </p>
    );
  }

  if (quality === "good") {
    return (
      <p className="text-xs text-amber-400 mt-1.5">
        Good start. Adding your step-by-step process below will make it even better.
      </p>
    );
  }

  return (
    <p className="text-xs text-gray-500 mt-1.5">
      Tip: Describe what you do today and how long it takes. More detail = better agent.
    </p>
  );
}

export default function ContextStep({ state, onChange }: StepProps) {
  const hasExpandedContent = !!(state.gotchas.trim() || state.hardPart.trim());
  const [expanded, setExpanded] = useState(hasExpandedContent);

  useEffect(() => {
    if (hasExpandedContent) setExpanded(true);
  }, [hasExpandedContent]);

  return (
    <div className="space-y-6">
      {/* Problem description — always visible */}
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
        <QualityIndicator text={state.problemDescription} />
      </div>

      {/* Manual process — always visible, strongly recommended */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          What steps do you follow when doing this manually?{" "}
          <span className="text-amber-400 font-normal">(strongly recommended)</span>
        </label>
        <HelpText>
          This is the single most valuable input for building your agent. Even a rough list helps.
        </HelpText>
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

      {/* Success definition — always visible (promoted from progressive disclosure) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          How will you know the agent is doing a good job?{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <HelpText>
          Write 2-3 things someone could check to verify the output is correct.
        </HelpText>
        <textarea
          value={state.successDefinition}
          onChange={(e) => onChange({ successDefinition: e.target.value })}
          placeholder="e.g. The summary includes every deal that changed stage this week. My manager doesn't ask for corrections. Posts to Slack by 9am MT Monday."
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            resize-none text-sm"
        />
      </div>

      {/* Progressive disclosure toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {expanded ? "Less detail" : "+ More detail = better results"}
      </button>

      {expanded && (
        <div className="space-y-6 animate-fade-in">
          {/* Gotchas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Anything Claude would get wrong about your setup?{" "}
              <span className="text-gray-500 font-normal">(optional, but saves debugging later)</span>
            </label>
            <textarea
              value={state.gotchas}
              onChange={(e) => onChange({ gotchas: e.target.value })}
              placeholder='e.g. We call renewals "extensions" internally. Our HubSpot has two deal pipelines and only "Enterprise Pipeline" matters. Tickets labeled "internal" should be ignored...'
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
                placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                resize-none text-sm"
            />
          </div>

          {/* Hard part */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              What&#39;s the trickiest part when you do this manually?{" "}
              <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <HelpText>
              Where do judgment calls happen? What takes the most thought?
            </HelpText>
            <textarea
              value={state.hardPart}
              onChange={(e) => onChange({ hardPart: e.target.value })}
              placeholder="e.g. Knowing which deals are actually at risk vs. just slow-moving. Figuring out which Slack messages are relevant updates vs. chatter."
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100
                placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                resize-none text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
