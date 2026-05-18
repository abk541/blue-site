import { useEffect, useMemo, useReducer, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import HeroSection from './components/HeroSection';
import ModeTabs from './components/ModeTabs';
import Navbar from './components/Navbar';
import ResultsPanel from './components/ResultsPanel';
import StepActions from './components/StepActions';
import StepContainer from './components/StepContainer';
import StepperBar from './components/StepperBar';
import { useCalculations } from './hooks/useCalculations';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_FORM } from './lib/config';
import { calculateBasesVieConsumption } from './lib/calculations';
import {
  buildErrors,
  getCompletionPercent,
  isStepValid,
  touchStep,
} from './lib/validation';

const STORAGE_KEY = 'blue-site-state-v1';
const PERSISTED_DEFAULTS = {
  form: DEFAULT_FORM,
  selectedOptimizationIds: [],
};

function createInitialState(persisted) {
  return {
    form: { ...DEFAULT_FORM, ...(persisted?.form ?? {}) },
    selectedOptimizationIds: persisted?.selectedOptimizationIds ?? [],
    currentStep: 0,
    direction: 1,
    mode: 'calculator',
    resultsVisible: false,
    isCalculating: false,
    resetOpen: false,
    touched: {},
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          [action.name]: action.value,
        },
      };
    case 'TOUCH_FIELD':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.name]: true,
        },
      };
    case 'TOUCH_STEP':
      return {
        ...state,
        touched: {
          ...state.touched,
          ...touchStep(action.step),
        },
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
        direction: action.step > state.currentStep ? 1 : -1,
        mode: 'calculator',
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 3),
        direction: 1,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
        direction: -1,
        mode: 'calculator',
      };
    case 'TOGGLE_OPTIMIZATION':
      return {
        ...state,
        selectedOptimizationIds: state.selectedOptimizationIds.includes(action.id)
          ? state.selectedOptimizationIds.filter((id) => id !== action.id)
          : [...state.selectedOptimizationIds, action.id],
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };
    case 'START_CALCULATION':
      return {
        ...state,
        isCalculating: true,
      };
    case 'FINISH_CALCULATION':
      return {
        ...state,
        isCalculating: false,
        resultsVisible: true,
        mode: 'dashboard',
      };
    case 'OPEN_RESET':
      return {
        ...state,
        resetOpen: true,
      };
    case 'CLOSE_RESET':
      return {
        ...state,
        resetOpen: false,
      };
    case 'RESET':
      return {
        ...createInitialState(PERSISTED_DEFAULTS),
        resetOpen: false,
      };
    default:
      return state;
  }
}

export default function App() {
  const [persisted, setPersisted] = useLocalStorage(STORAGE_KEY, PERSISTED_DEFAULTS);
  const [state, dispatch] = useReducer(reducer, persisted, createInitialState);
  const contentRef = useRef(null);
  const resultsRef = useRef(null);
  const previousStepRef = useRef(0);
  const results = useCalculations(state.form, state.selectedOptimizationIds);
  const basesVieM3 = useMemo(
    () => calculateBasesVieConsumption(state.form),
    [state.form],
  );
  const errors = useMemo(() => buildErrors(state.form), [state.form]);
  const currentStepValid = isStepValid(state.currentStep, errors);
  const progress = getCompletionPercent(state.form);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    setPersisted({
      form: state.form,
      selectedOptimizationIds: state.selectedOptimizationIds,
    });
  }, [setPersisted, state.form, state.selectedOptimizationIds]);

  useEffect(() => {
    if (previousStepRef.current === state.currentStep) {
      return;
    }

    previousStepRef.current = state.currentStep;
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [state.currentStep]);

  useEffect(() => {
    if (state.mode !== 'dashboard') {
      return;
    }

    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [state.mode]);

  const updateField = (name, value) => dispatch({ type: 'UPDATE_FIELD', name, value });
  const touchField = (name) => dispatch({ type: 'TOUCH_FIELD', name });

  const goNext = () => {
    if (!currentStepValid) {
      dispatch({ type: 'TOUCH_STEP', step: state.currentStep });
      return;
    }

    dispatch({ type: 'NEXT_STEP' });
  };

  const goBack = () => dispatch({ type: 'PREV_STEP' });

  const startCalculation = () => {
    if (!currentStepValid) {
      dispatch({ type: 'TOUCH_STEP', step: state.currentStep });
      return;
    }

    dispatch({ type: 'START_CALCULATION' });
    window.setTimeout(() => {
      dispatch({ type: 'FINISH_CALCULATION' });
      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 1200);
  };

  const setMode = (mode) => {
    dispatch({ type: 'SET_MODE', mode });
  };

  return (
    <div className="min-h-screen bg-base text-primary">
      <Navbar
        mode={state.mode}
        onModeChange={setMode}
        dashboardEnabled
      />
      <HeroSection />
      <ModeTabs
        mode={state.mode}
        onModeChange={setMode}
        dashboardEnabled
      />

      <main className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {state.mode === 'calculator' ? (
          <section ref={contentRef} className="calculator-shell">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow">Calculateur</p>
                <h2 className="font-display text-2xl text-primary md:text-3xl">
                  Maîtrisez la consommation d'eau de vos chantiers
                </h2>
              </div>
              <button
                type="button"
                className="secondary-button self-start"
                onClick={() => dispatch({ type: 'OPEN_RESET' })}
              >
                <RotateCcw size={16} />
                Réinitialiser
              </button>
            </div>

            <StepperBar
              currentStep={state.currentStep}
              progress={progress}
              onStepClick={(step) => dispatch({ type: 'SET_STEP', step })}
            />

            <div className="px-1 py-8 md:px-4">
              <StepContainer
                currentStep={state.currentStep}
                direction={state.direction}
                form={state.form}
                derived={results.derived}
                results={results}
                basesVieM3={basesVieM3}
                errors={errors}
                touched={state.touched}
                selectedOptimizationIds={state.selectedOptimizationIds}
                isCalculating={state.isCalculating}
                onChange={updateField}
                onBlur={touchField}
                onToggleOptimization={(id) => dispatch({ type: 'TOGGLE_OPTIMIZATION', id })}
                onCalculate={startCalculation}
              />
            </div>

            <StepActions
              currentStep={state.currentStep}
              isCurrentStepValid={currentStepValid}
              isCalculating={state.isCalculating}
              onBack={goBack}
              onNext={goNext}
              onCalculate={startCalculation}
            />
          </section>
        ) : (
          <section ref={resultsRef} className="scroll-mt-24">
            <ResultsPanel form={state.form} results={results} />
          </section>
        )}
      </main>

      <AnimatePresence>
        {state.resetOpen ? (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="reset-modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => dispatch({ type: 'CLOSE_RESET' })}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
              <p className="eyebrow">Réinitialisation</p>
              <h2 className="mt-2 font-display text-2xl text-primary">
                Revenir aux valeurs modèle ?
              </h2>
              <p className="mt-4 font-sans text-sm leading-6 text-secondary">
                Les données saisies localement et les optimisations sélectionnées seront remplacées par les valeurs par défaut.
              </p>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => dispatch({ type: 'CLOSE_RESET' })}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => dispatch({ type: 'RESET' })}
                >
                  Réinitialiser
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
