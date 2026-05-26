import { Droplet } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import FormField from './FormField';
import { WELFARE_FIELDS } from '../lib/config';

export default function Step3BasesVie({
  form,
  basesVieM3,
  errors,
  touched,
  onChange,
  onBlur,
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div>
          <p className="eyebrow">Étape 03</p>
          <h2 className="section-title">Bases-vie</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {WELFARE_FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={form[field.name]}
              error={errors[field.name]}
              touched={touched[field.name]}
              onChange={onChange}
              onBlur={onBlur}
            />
          ))}
        </div>
      </div>

      <aside className="live-preview-card">
        <div className="flex items-center gap-3">
          <span className="metric-icon">
            <Droplet size={18} />
          </span>
          <div>
            <p className="eyebrow">Live preview</p>
            <h3 className="font-display text-xl text-primary">Bases-vie estimée</h3>
          </div>
        </div>
        <div className="mt-8">
          <AnimatedNumber value={basesVieM3} decimals={1} className="font-mono text-4xl text-cyan" />
          <span className="ml-2 font-mono text-lg text-secondary">m3</span>
        </div>
        <div className="mt-6 h-px bg-border" />
        <p className="mt-5 font-sans text-sm leading-6 text-secondary">
          La prévision se recalcule avec la surface base-vie, l'effectif moyen et les jours ouvrés du planning.
        </p>
      </aside>
    </div>
  );
}
