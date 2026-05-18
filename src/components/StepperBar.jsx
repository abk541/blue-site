import { Check } from 'lucide-react';
import { STEPS } from '../lib/config';

export default function StepperBar({ currentStep, onStepClick, progress }) {
  return (
    <div className="border-b border-border">
      <div className="h-1 bg-elevated">
        <div className="h-full bg-cyan transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex flex-wrap gap-3 px-1 py-6">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentStep;
          const isComplete = index < currentStep;
          const canClick = index <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              className={`step-pill ${isCurrent ? 'step-pill-current' : ''} ${isComplete ? 'step-pill-complete' : ''}`}
              onClick={() => canClick && onStepClick(index)}
              disabled={!canClick}
            >
              <span className="step-number">
                {isComplete ? <Check size={14} /> : index + 1}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
