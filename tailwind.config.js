/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        card: 'var(--bg-card)',
        elevated: 'var(--bg-elevated)',
        border: 'var(--border)',
        blue: 'var(--accent-blue)',
        cyan: 'var(--accent-cyan)',
        gold: 'var(--accent-gold)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
      fontFamily: {
        display: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        panel: '0 24px 80px rgba(0,0,0,0.32)',
        glow: '0 0 0 2px var(--accent-blue)',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.72)', opacity: '0' },
          '20%': { opacity: '0.16' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        wave: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        ripple: 'ripple 5s ease-out infinite',
        wave: 'wave 2.4s linear infinite',
        shake: 'shake 220ms ease-in-out',
        float: 'float 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
