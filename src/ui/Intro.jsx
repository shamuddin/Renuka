import { motion } from 'framer-motion';
import { useStore } from '../store/useStore.js';
import { INTRO_LEAD } from '../scene/journey.js';
import Counter from './Counter.jsx';

// Full-screen intro that gently fades away as you begin scrolling.
export default function Intro() {
  const scroll = useStore((s) => s.scroll);
  const opacity = Math.max(0, 1 - scroll / (INTRO_LEAD * 0.85));
  const visible = opacity > 0.01;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.2s linear',
        visibility: visible ? 'visible' : 'hidden',
        gap: '1.5rem',
        padding: '1rem',
      }}
    >
      {/* soft scrim so the title + counter stay readable over the busy scene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(closest-side at 50% 45%, rgba(255,250,245,0.82) 0%, rgba(255,250,245,0.55) 45%, rgba(255,250,245,0) 78%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <div className="eyebrow" style={{ color: 'var(--gold)' }}>
        our first year together
      </div>

      <h1
        className="font-title"
        style={{
          fontSize: 'clamp(3rem, 10vw, 7.5rem)',
          fontWeight: 600,
          fontStyle: 'italic',
          color: 'var(--rose)',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '1px',
          textShadow: '0 2px 24px rgba(255,255,255,0.55)',
        }}
      >
        Renu&nbsp;Sham
      </h1>

      <div
        className="font-serif"
        style={{ fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--ink)', opacity: 0.85, marginTop: '-0.4rem' }}
      >
        one island, one memory at a time
      </div>

      <div className="glass-card" style={{ padding: '1rem 1.6rem', marginTop: '0.4rem' }}>
        <Counter />
      </div>

      <div
        className="font-serif"
        style={{ fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--rose-deep)', marginTop: '0.3rem', opacity: 0.9 }}
      >
        scroll to begin our story ↓
      </div>
    </motion.div>
  );
}
