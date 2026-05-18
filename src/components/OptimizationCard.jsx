import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function OptimizationCard({ optimization, selected, onToggle }) {
  const Icon = Icons[optimization.icon] ?? Icons.CircleDot;

  return (
    <motion.button
      type="button"
      className={`optimization-card ${selected ? 'optimization-card-selected' : ''}`}
      onClick={() => onToggle(optimization.id)}
      whileHover={{ y: -2, borderColor: 'rgba(0,163,255,0.4)' }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="metric-icon">
          <Icon size={18} />
        </span>
        <span className={`toggle-switch ${selected ? 'toggle-switch-on' : ''}`}>
          <span />
        </span>
      </span>

      <span className="mt-5 block text-left font-display text-lg text-primary">
        {optimization.name}
      </span>
      <span className="mt-3 block text-left font-sans text-sm leading-6 text-secondary">
        {optimization.description}
      </span>
      <span className="mt-5 inline-flex rounded-full border border-border bg-elevated px-3 py-1 font-mono text-xs text-gold">
        -{optimization.gain_pct}%
      </span>
    </motion.button>
  );
}
