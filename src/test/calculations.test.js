import { describe, expect, it } from 'vitest';
import { calculateWaterConsumption, computeOptimizationCoeff } from '../lib/calculations';
import { DEFAULT_FORM } from '../lib/config';

describe('calculation engine', () => {
  it('combines optimization gains multiplicatively', () => {
    const coeff = computeOptimizationCoeff([
      { gain_pct: 20 },
      { gain_pct: 25 },
      { gain_pct: 15 },
    ]);

    expect(coeff).toBeCloseTo(0.49, 6);
  });

  it('computes derived working days from duration and working rhythm', () => {
    const result = calculateWaterConsumption(DEFAULT_FORM, []);

    expect(result.derived.jours_ouvres_total).toBe(624);
  });

  it('applies the fixed engineering adjustment factor to baseline line items', () => {
    const result = calculateWaterConsumption(DEFAULT_FORM, []);
    const concreteMix = result.lineItems.find((item) => item.id === 'BETON_GACH');

    expect(concreteMix.m3).toBe(32400);
  });

  it('returns optimized totals and impact metrics in MAD and kg CO2', () => {
    const result = calculateWaterConsumption(DEFAULT_FORM, [
      { id: 'OPT03', name: 'Optimisation bases-vie', gain_pct: 20 },
    ]);

    expect(result.totals.total_optimise_m3).toBeCloseTo(
      result.totals.total_brut_m3 * 0.8,
      6,
    );
    expect(result.totals.savings_mad).toBeCloseTo(
      result.totals.savings_m3 * 20,
      6,
    );
    expect(result.totals.savings_co2_kg).toBeCloseTo(
      result.totals.savings_m3 * 0.5,
      6,
    );
  });
});
