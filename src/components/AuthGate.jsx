import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import bouyguesLogo from '../assets/bouygues-construction-logo-clean.png';
import {
  clearAuthSession,
  getAuthSession,
  getAuthSessionTtlMs,
  verifyCredentials,
} from '../lib/auth';

function formatMinutes(ms) {
  return Math.max(0, Math.ceil(ms / 60000));
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(() => getAuthSession());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expired, setExpired] = useState(false);
  const ttlMinutes = useMemo(() => formatMinutes(getAuthSessionTtlMs()), []);

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      clearAuthSession();
      setSession(null);
      setExpired(true);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      clearAuthSession();
      setSession(null);
      setExpired(true);
    }, remaining);

    const recheckSession = () => {
      const activeSession = getAuthSession();
      setSession(activeSession);
      if (!activeSession) {
        setExpired(true);
      }
    };

    window.addEventListener('focus', recheckSession);
    document.addEventListener('visibilitychange', recheckSession);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('focus', recheckSession);
      document.removeEventListener('visibilitychange', recheckSession);
    };
  }, [session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const nextSession = await verifyCredentials(username, password);

      if (!nextSession) {
        setError('Identifiants invalides. Vérifiez le nom utilisateur et le mot de passe.');
        setPassword('');
        return;
      }

      setExpired(false);
      setUsername('');
      setPassword('');
      setSession(nextSession);
    } catch {
      setError('Connexion impossible sur ce navigateur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session) {
    return children;
  }

  return (
    <main className="auth-screen">
      <div className="auth-grid" aria-hidden="true" />
      <AnimatePresence mode="wait">
        <motion.section
          key={expired ? 'expired' : 'login'}
          className="auth-card"
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <div className="auth-brand">
            <img src={bouyguesLogo} alt="Bouygues Construction" />
            <span>
              <strong>Blue Site</strong>
              <small>Accès sécurisé</small>
            </span>
          </div>

          <div className="auth-icon">
            <LockKeyhole size={24} />
          </div>

          <p className="eyebrow">Authentification requise</p>
          <h1>Connexion Blue Site</h1>
          <p className="auth-copy">
            {expired
              ? 'Votre session a expiré. Une nouvelle connexion est nécessaire pour continuer.'
              : `Veuillez vous identifier. La session expire automatiquement après ${ttlMinutes} minutes.`}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Nom utilisateur</span>
              <input
                type="text"
                value={username}
                autoComplete="username"
                required
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>

            <label>
              <span>Mot de passe</span>
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error ? (
              <motion.p
                className="auth-error"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.p>
            ) : null}

            <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
              <ShieldCheck size={17} />
              {isSubmitting ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
