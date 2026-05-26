import { CalendarDays } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import FormField from './FormField';
import { PROJECT_FIELDS } from '../lib/config';

export default function Step1Projet({ form, derived, errors, touched, onChange, onBlur }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Étape 01</p>
        <h2 className="section-title">Informations Projet</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PROJECT_FIELDS.map((field, index) => (
          <FormField
            key={field.name}
            field={field}
            value={form[field.name]}
            error={errors[field.name]}
            touched={touched[field.name]}
            onChange={onChange}
            onBlur={onBlur}
            index={index}
          />
        ))}
      </div>

      <div className="derived-panel">
        <div className="flex items-center gap-3">
          <span className="metric-icon">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">Planning</p>
            <p className="font-sans text-sm text-secondary">Jours ouvrés utilisés par le modèle</p>
          </div>
        </div>
        <AnimatedNumber
          value={derived.jours_ouvres_total}
          className="font-mono text-3xl text-cyan"
        />
      </div>
    </div>
  );
}
