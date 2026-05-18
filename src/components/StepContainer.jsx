import { AnimatePresence, motion } from 'framer-motion';
import Step1Projet from './Step1Projet';
import Step2Travaux from './Step2Travaux';
import Step3BasesVie from './Step3BasesVie';
import Step4Optimisations from './Step4Optimisations';

const variants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    filter: 'blur(6px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    filter: 'blur(6px)',
  }),
};

export default function StepContainer({
  currentStep,
  direction,
  form,
  derived,
  results,
  basesVieM3,
  errors,
  touched,
  selectedOptimizationIds,
  isCalculating,
  onChange,
  onBlur,
  onToggleOptimization,
  onCalculate,
}) {
  const sharedProps = {
    form,
    errors,
    touched,
    onChange,
    onBlur,
  };

  const steps = [
    <Step1Projet {...sharedProps} derived={derived} />,
    <Step2Travaux {...sharedProps} results={results} />,
    <Step3BasesVie {...sharedProps} basesVieM3={basesVieM3} />,
    <Step4Optimisations
      selectedOptimizationIds={selectedOptimizationIds}
      results={results}
      isCalculating={isCalculating}
      onToggleOptimization={onToggleOptimization}
      onCalculate={onCalculate}
    />,
  ];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.34, ease: 'easeOut' }}
      >
        {steps[currentStep]}
      </motion.div>
    </AnimatePresence>
  );
}
