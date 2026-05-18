import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import FormField from './FormField';
import { ACTIVITY_CATEGORIES } from '../lib/config';
import { formatNumber } from '../lib/formatters';

export default function Step2Travaux({
  form,
  results,
  errors,
  touched,
  onChange,
  onBlur,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = ACTIVITY_CATEGORIES[activeIndex];
  const categoryStats = useMemo(() => {
    const resultMap = new Map(
      results.categories.map((category) => [category.category, category.m3]),
    );

    return ACTIVITY_CATEGORIES.map((category) => {
      const m3 = category.resultCategories.reduce(
        (sum, name) => sum + (resultMap.get(name) ?? 0),
        0,
      );
      const completed = category.fields.filter((field) => !errors[field.name]).length;

      return {
        m3,
        completed,
        total: category.fields.length,
        done: completed === category.fields.length,
      };
    });
  }, [errors, results.categories]);
  const activeStats = categoryStats[activeIndex];
  const Icon = Icons[activeCategory.icon] ?? Icons.CircleDot;
  const direction = activeIndex === 0 ? 1 : activeIndex;

  const goToOffset = (offset) => {
    setActiveIndex((current) =>
      Math.min(Math.max(current + offset, 0), ACTIVITY_CATEGORIES.length - 1),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Étape 02</p>
          <h2 className="section-title">Activités Chantier</h2>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-secondary">
            Avancez par famille de travaux. Les valeurs du modèle sont déjà posées, il suffit d’ajuster les écarts connus.
          </p>
        </div>
        <div className="micro-hint">
          <Sparkles size={16} />
          <span>Mode focus · 1 section à la fois</span>
        </div>
      </div>

      <div className="activity-workbench">
        <aside className="activity-nav" aria-label="Familles de travaux">
          {ACTIVITY_CATEGORIES.map((category, index) => {
            const CategoryIcon = Icons[category.icon] ?? Icons.CircleDot;
            const stats = categoryStats[index];
            const active = index === activeIndex;

            return (
              <button
                type="button"
                key={category.id}
                className={`activity-nav-item ${active ? 'activity-nav-item-active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <span className="activity-nav-icon">
                  {stats.done ? <Check size={16} /> : <CategoryIcon size={16} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{category.title}</span>
                  <span className="mt-1 block font-mono text-xs text-muted">
                    {stats.completed}/{stats.total} champs · {formatNumber(stats.m3, 0)} m3
                  </span>
                </span>
              </button>
            );
          })}
        </aside>

        <section className="focus-panel">
          <div className="focus-panel-top">
            <div className="flex items-start gap-4">
              <span className="focus-icon">
                <Icon size={22} />
              </span>
              <div>
                <p className="eyebrow">Section {activeIndex + 1} / {ACTIVITY_CATEGORIES.length}</p>
                <h3 className="font-display text-2xl text-primary">{activeCategory.title}</h3>
                <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-secondary">
                  {activeCategory.summary}
                </p>
              </div>
            </div>
            <div className="focus-meter">
              <span className="font-mono text-2xl text-cyan">
                {formatNumber(activeStats.m3, 0)}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted">m3 estimés</span>
            </div>
          </div>

          <div className="focus-progress">
            <div
              style={{
                width: `${(activeStats.completed / activeStats.total) * 100}%`,
              }}
            />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCategory.id}
              custom={direction}
              initial={{ opacity: 0, x: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -18, filter: 'blur(8px)' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {activeCategory.fields.map((field) => (
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
            </motion.div>
          </AnimatePresence>

          <div className="focus-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => goToOffset(-1)}
              disabled={activeIndex === 0}
            >
              <ArrowLeft size={16} />
              Section précédente
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => goToOffset(1)}
              disabled={activeIndex === ACTIVITY_CATEGORIES.length - 1}
            >
              Section suivante
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
