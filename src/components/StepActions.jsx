import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function StepActions({
  currentStep,
  isCurrentStepValid,
  isCalculating,
  onBack,
  onNext,
  onCalculate,
}) {
  const isLast = currentStep === 3;

  return (
    <div className="step-actions">
      <button
        type="button"
        className="secondary-button"
        onClick={onBack}
        disabled={currentStep === 0 || isCalculating}
      >
        <ArrowLeft size={16} />
        Retour
      </button>
      {isLast ? (
        <button
          type="button"
          className="primary-button"
          onClick={onCalculate}
          disabled={!isCurrentStepValid || isCalculating}
        >
          {isCalculating ? 'Calcul en cours' : 'Calculer ma consommation'}
          <ArrowRight size={16} />
        </button>
      ) : (
        <button
          type="button"
          className="primary-button"
          onClick={onNext}
          disabled={!isCurrentStepValid || isCalculating}
        >
          Étape suivante
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
