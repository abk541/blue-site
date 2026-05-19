import { motion } from 'framer-motion';
import { ArrowDown, Building2, Gauge, ShieldCheck, TrendingDown } from 'lucide-react';

const heroItems = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HeroSection() {
  return (
    <section className="hero-light relative overflow-hidden border-b border-border px-4 py-10 md:px-6 md:py-14">
      <div className="hero-grid" aria-hidden="true" />

      <motion.div
        className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"
        variants={heroItems}
        initial="hidden"
        animate="show"
      >
        <div>
          <motion.p variants={fadeUp} className="mb-4 font-mono text-xs uppercase tracking-widest text-gold">
            Bouygues Construction · Pilotage eau chantier
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-display text-5xl font-bold leading-none text-primary md:text-6xl">
            Blue Site
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl font-sans text-lg leading-8 text-secondary">
            Une plateforme de pilotage premium pour mesurer, comparer et réduire la consommation d'eau des chantiers avec une lecture exécutive et terrain.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <span className="hero-chip">Modèle chantier</span>
            <span className="hero-chip">Relevés IoT</span>
            <span className="hero-chip">Rapport direction</span>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="hero-instrument executive-panel"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Indice maîtrise eau</p>
              <p className="mt-2 font-display text-2xl text-primary">Chantier sous contrôle</p>
            </div>
            <span className="metric-icon">
              <Gauge size={18} />
            </span>
          </div>

          <div className="executive-meter" aria-hidden="true">
            <div className="executive-meter-top">
              <span>Indice de maîtrise</span>
              <strong>87%</strong>
            </div>
            <div className="executive-track">
              <span style={{ width: '87%' }} />
            </div>
            <div className="executive-scale">
              <span>Mesure</span>
              <span>Seuil</span>
              <span>Optimisation</span>
            </div>
          </div>

          <div className="instrument-stats">
            <span>
              <Building2 size={15} />
              <strong>11</strong>
              postes suivis
            </span>
            <span>
              <ShieldCheck size={15} />
              <strong>5</strong>
              leviers validés
            </span>
            <span>
              <TrendingDown size={15} />
              <strong>IoT</strong>
              seuils contrôlés
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto mt-10 flex max-w-7xl justify-center lg:justify-start">
        <ArrowDown className="text-blue" size={20} />
      </div>
    </section>
  );
}
