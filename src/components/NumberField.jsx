import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { formatInputNumber, parseFrenchNumber } from '../lib/formatters';

const DECIMAL_FIELDS = new Set([
  'volume_reseau_plomberie',
  'volume_reseau_chauffage',
  'volume_reseau_sprinkler',
  'volume_bassin',
]);

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

    setDraft(nextDraft);
    onChange(field.name, parsed);
  };

  const handleAdjust = (delta) => {
    const current = Number(value);
    const next = Math.max(0, (Number.isFinite(current) ? current : 0) + delta);

    onChange(field.name, Number(next.toFixed(2)));
    setDraft(formatInputNumber(next));
  };

  return (
    <motion.div
      className="field-shell"
      animate={hasError ? { x: [0, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <label htmlFor={fieldId} className="floating-label">
        {field.label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          className={`technical-input ${hasError ? 'input-error' : ''}`}
          inputMode="decimal"
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
