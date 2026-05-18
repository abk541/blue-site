import { useMemo } from 'react';
import { calculateWaterConsumption, OPTIMIZATIONS } from '../lib/calculations';

export function useCalculations(form, selectedOptimizationIds) {
  const selectedOptimizations = useMemo(
    () =>
      OPTIMIZATIONS.filter((optimization) =>
        selectedOptimizationIds.includes(optimization.id),
      ),
    [selectedOptimizationIds],
  );

  return useMemo(
    () => calculateWaterConsumption(form, selectedOptimizations),
    [form, selectedOptimizations],
  );
}
