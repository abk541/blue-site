import { memo } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Droplets, Leaf, ShieldCheck } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

function KPICards({ totals }) {
  const items = [
    {
      label: 'Conso. totale',
      hint: 'brute',
      value: totals.total_brut_m3,
      suffix: ' m3',
      icon: Droplets,
      accent: 'text-blue',
    },
    {
      label: 'Après optim.',
      hint: 'optimisée',
      value: totals.total_optimise_m3,
      suffix: ' m3',
      icon: ShieldCheck,
      accent: 'text-cyan',
    },
    {
      label: 'Économie MAD',
      hint: 'financière',
      value: totals.savings_mad,
      suffix: ' MAD',
      icon: Banknote,
      accent: 'text-gold',
    },
    {
      label: 'CO2 évité',
      hint: 'impact',
      value: totals.savings_co2_kg,
      suffix: ' kg',
      icon: Leaf,
      accent: 'text-gold',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            className="kpi-card"
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            whileHover={{ y: -2, borderColor: 'rgba(79,140,201,0.38)' }}
          >
            <Icon size={18} className={item.accent} />
            <p className="mt-5 font-sans text-sm text-secondary">{item.label}</p>
            <AnimatedNumber
              value={item.value}
              suffix={item.suffix}
              className={`mt-2 block font-mono text-2xl ${index > 1 ? 'text-gold' : 'text-primary'}`}
            />
            <p className="mt-2 font-sans text-xs uppercase tracking-widest text-muted">
              {item.hint}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default memo(KPICards);
