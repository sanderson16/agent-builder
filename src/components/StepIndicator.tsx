"use client";

import { STEPS } from "@/lib/wizard-data";

interface StepIndicatorProps {
  currentStep: number; // 0-indexed
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${
                i < currentStep
                  ? "bg-primary-500 text-white"
                  : i === currentStep
                  ? "bg-primary-500/20 text-primary-400 ring-2 ring-primary-500"
                  : "bg-gray-800 text-gray-500"
              }`}
          >
            {i < currentStep ? "✓" : step.number}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i < currentStep ? "bg-primary-500" : "bg-gray-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
