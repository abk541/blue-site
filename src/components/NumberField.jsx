import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { formatInputNumber, parseFrenchNumber } from '../lib/formatters';

const DECIMAL_FIELDS = new Set([
  'volume_reseau_plomberie',
  'volume_reseau_chauffage',
  'volume_reseau_sprinkler',
]);

function clampToFieldLimits(value, field) {
  if (value === '') {
    return '';
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value;
  }

  const min = Number.isFinite(Number(field.min)) ? Number(field.min) : 0;
  const max = Number.isFinite(Number(field.max)) ? Number(field.max) : Infinity;
  return Number(Math.min(max, Math.max(min, numeric)).toFixed(2));
}

export default function NumberField({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(() => formatInputNumber(value));
  const fieldId = `field-${field.name}`;
  const hasError = touched && Boolean(error);
  const step = useMemo(() => (DECIMAL_FIELDS.has(field.name) ? 0.1 : 1), [field.name]);

  useEffect(() => {
    if (!focused) {
      setDraft(formatInputNumber(value));
    }
  }, [focused, value]);

  const handleChange = (event) => {
    const nextDraft = event.target.value;
    const parsed = parseFrenchNumber(nextDraft);
    const limited = clampToFieldLimits(parsed, field);

    setDraft(limited !== parsed && limited !== '' ? String(limited).replace('.', ',') : nextDraft);
    onChange(field.name, limited);
  };

  const handleAdjust = (delta) => {
    const current = Number(value);
    const next = clampToFieldLimits((Number.isFinite(current) ? current : 0) + delta, field);

    onChange(field.name, Number(next.toFixed(2)));
    setDraft(formatInputNumber(next));
  };

  return (
    <motion.div
      className={`field-shell ${field.source ? `field-source-${field.source.tone}` : ''}`}
      animate={hasError ? { x: [0, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="field-title-row">
        <label htmlFor={fieldId} className="floating-label">
          {field.label}
        </label>
        {field.source ? (
          <span className={`field-source-badge field-source-badge-${field.source.tone}`}>
            {field.source.label}
          </span>
        ) : null}
      </div>
      <div className="relative">
        <input
          id={fieldId}
          className={`technical-input ${hasError ? 'input-error' : ''}`}
          inputMode="decimal"
          min={field.min ?? 0}
          max={field.max}
          value={focused ? draft : formatInputNumber(value)}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
            setDraft(Number.isFinite(Number(value)) ? String(value).replace('.', ',') : '');
          }}
          onBlur={() => {
            setFocused(false);
            onBlur(field.name);
          }}
        />
        <span className="unit-badge">{field.unit}</span>
        <div className="number-stepper">
          <button type="button" aria-label={`Diminuer ${field.label}`} onClick={() => handleAdjust(-step)}>
            <Minus size={12} />
          </button>
          <button type="button" aria-label={`Augmenter ${field.label}`} onClick={() => handleAdjust(step)}>
            <Plus size={12} />
          </button>
        </div>
      </div>
      {field.description ? <p className="field-help">{field.description}</p> : null}
      {hasError ? <p className="field-error">{error}</p> : null}
    </motion.div>
  );
}
