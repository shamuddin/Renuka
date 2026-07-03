import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { blip, chime } from './sound.js';

// Goa game: find the hidden seashells on the beach. Each one you find flips a
// word; collect all 5 to reveal a little beach memory.
const WORDS = ['sun', 'sand', 'waves', 'you', '&', 'me'];

export default function SeashellHunt({ onWin }) {
  const shells = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: 12 + Math.random() * 74,
        y: 45 + Math.random() * 48,
        rot: -30 + Math.random() * 60,
        word: WORDS[i],
      })),
    []
  );
  const [found, setFound] = useState({});
  const count = Object.keys(found).length;

  function find(id) {
    if (found[id]) return;
    blip(880, 0.12);
    const next = { ...found, [id]: true };
    setFound(next);
    if (Object.keys(next).length === shells.length) {
      chime();
      setTimeout(() => onWin(), 1400);
    }
  }

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        tap the sand to find 5 hidden seashells 🐚 &nbsp;·&nbsp; {count}/5
      </p>
      <div
        style={{
          position: 'relative',
          height: 'min(62vh, 540px)',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'linear-gradient(180deg,#8fd6e6 0%,#bfe9f2 38%,#f4e2b8 55%,#efd49a 100%)',
        }}
      >
        {/* gentle waves */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 6 }}
          style={{ position: 'absolute', top: '46%', left: '-10%', right: '-10%', height: 40, background: 'rgba(255,255,255,0.35)', filter: 'blur(6px)' }}
        />
        {shells.map((s) => (
          <button
            key={s.id}
            onClick={() => find(s.id)}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: found[s.id] ? '1.1rem' : '1.7rem',
              transition: 'font-size 0.2s',
            }}
          >
            {found[s.id] ? (
              <span className="font-serif" style={{ fontStyle: 'italic', color: 'var(--rose-deep)', background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: 8 }}>
                {s.word}
              </span>
            ) : (
              '🐚'
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
