import { motion } from 'framer-motion';

export default function TextField({ field, value, error, touched, onChange, onBlur }) {
  const fieldId = `field-${field.name}`;
  const hasError = touched && Boolean(error);

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
          value={value ?? ''}
          onChange={(event) => onChange(field.name, event.target.value)}
          onBlur={() => onBlur(field.name)}
        />
        <span className="unit-badge">{field.unit}</span>
      </div>
      {field.description ? <p className="field-help">{field.description}</p> : null}
      {hasError ? <p className="field-error">{error}</p> : null}
    </motion.div>
  );
}
