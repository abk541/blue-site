import { motion } from 'framer-motion';
import { ArrowDown, Gauge, Waves } from 'lucide-react';

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
    <section className="hero-light relative overflow-hidden border-b border-border px-4 py-12 md:px-6 md:py-16">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-ripple" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <motion.div
        className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"
        variants={heroItems}
        initial="hidden"
        animate="show"
      >
        <div>
          <motion.p variants={fadeUp} className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan">
            Bouygues Construction · Pilotage eau chantier
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-display text-5xl font-bold leading-none text-primary md:text-7xl">
            Blue Site
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl font-sans text-lg leading-8 text-secondary">
            Un cockpit clair pour estimer l'eau chantier, repérer les gros postes et transformer les optimisations en économies visibles.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <span className="hero-chip">Prérempli</span>
            <span className="hero-chip">Calcul instantané</span>
            <span className="hero-chip">Rapport exportable</span>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="hero-instrument"
          whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        >
          <div className="instrument-scan" />
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Live Water Index</p>
              <p className="mt-2 font-display text-2xl text-primary">Chantier sous contrôle</p>
            </div>
            <span className="metric-icon">
              <Gauge size={18} />
            </span>
          </div>
          <div className="water-orbit" aria-hidden="true">
            <Waves size={42} />
            <span />
          </div>
          <div className="instrument-stats">
            <span>
              <strong>11</strong>
              catégories
            </span>
            <span>
              <strong>5</strong>
              optimisations
            </span>
            <span>
              <strong>PDF</strong>
              rapport
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto mt-10 flex max-w-7xl justify-center lg:justify-start">
        <ArrowDown className="animate-float text-blue" size={22} />
      </div>
    </section>
  );
}
