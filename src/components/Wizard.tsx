"use client";

import { useState } from "react";
import type { WizardState } from "@/lib/types";
import { STEPS } from "@/lib/wizard-data";
import StepIndicator from "./StepIndicator";
import CategoryStep from "./steps/CategoryStep";
import TaskStep from "./steps/TaskStep";
import ContextStep from "./steps/ContextStep";
import DataSourceStep from "./steps/DataSourceStep";
import TriggerStep from "./steps/TriggerStep";
import OutputStep from "./steps/OutputStep";
import GroundRulesStep from "./steps/GroundRulesStep";
import PrioritiesStep from "./steps/PrioritiesStep";
import ResultStep from "./steps/ResultStep";

const INITIAL_STATE: WizardState = {
  category: null,
  task: null,
  customTask: "",
  problemDescription: "",
  manualProcess: "",
  successDefinition: "",
  dataSources: [],
  trigger: null,
  scheduleFrequency: null,
  outputs: [],
  tone: null,
  mustAlways: "",
  neverDo: "",
  alertRecipient: "",
  exampleOutput: "",
  tradeOff: null,
  detailLevel: null,
  autonomy: null,
  escalationTriggers: [],
  failMode: null,
};

function canAdvance(step: number, state: WizardState): boolean {
  switch (step) {
    case 0: // Category
      return state.category !== null;
    case 1: // Task
      return state.task !== null && (state.task !== "custom" || state.customTask.trim().length > 0);
    case 2: // Tell us more
      return state.problemDescription.trim().length > 0;
    case 3: // Data sources
      return state.dataSources.length > 0;
    case 4: // Trigger
      return state.trigger !== null && (state.trigger !== "schedule" || state.scheduleFrequency !== null);
    case 5: // Outputs
      return state.outputs.length > 0;
    case 6: // Ground rules
      return state.tone !== null;
    case 7: // Priorities
      return state.tradeOff !== null && state.detailLevel !== null && state.autonomy !== null && state.failMode !== null;
    default:
      return false;
  }
}

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  const update = (changes: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...changes }));
  };

  const next = () => {
    if (step < 8 && canAdvance(step, state)) {
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const startOver = () => {
    setState(INITIAL_STATE);
    setStep(0);
  };

  const stepProps = { state, onChange: update };

  const stepComponents = [
    <CategoryStep key="cat" {...stepProps} />,
    <TaskStep key="task" {...stepProps} />,
    <ContextStep key="ctx" {...stepProps} />,
    <DataSourceStep key="ds" {...stepProps} />,
    <TriggerStep key="trig" {...stepProps} />,
    <OutputStep key="out" {...stepProps} />,
    <GroundRulesStep key="rules" {...stepProps} />,
    <PrioritiesStep key="pri" {...stepProps} />,
    <ResultStep key="result" state={state} onStartOver={startOver} />,
  ];

  const isResult = step === 8;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {!isResult && <StepIndicator currentStep={step} />}

      {!isResult && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">{STEPS[step].title}</h2>
          <p className="text-gray-400 mt-1">{STEPS[step].subtitle}</p>
        </div>
      )}

      <div key={step} className="animate-fade-in">
        {stepComponents[step]}
      </div>

      {!isResult && (
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed
              text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance(step, state)}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed
              bg-primary-500 text-white hover:bg-primary-600"
          >
            {step === 7 ? "Generate My Agent Prompt" : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
