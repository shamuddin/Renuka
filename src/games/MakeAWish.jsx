import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Manifestation game: type a wish, release it as a glowing lantern that rises
// into a starry sky and settles into a heart-constellation.
export default function MakeAWish({ onWin }) {
  const [wish, setWish] = useState('');
  const [released, setReleased] = useState(false);

  const stars = useMemo(
    () => Array.from({ length: 46 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 100, d: 1.5 + Math.random() * 2.5, delay: Math.random() * 2 })),
    []
  );

  // heart-shaped constellation points
  const heart = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 22; i++) {
      const t = (i / 22) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push({ x: 50 + x * 1.5, y: 42 - y * 1.5 });
    }
    return pts;
  }, []);

  function release() {
    if (!wish.trim()) return;
    setReleased(true);
    setTimeout(() => onWin(), 3600);
  }

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        write a wish and release it to the sky 🏮
      </p>

      <div
        style={{
          position: 'relative',
          height: 'min(62vh, 540px)',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #ffdca8 0%, #f7a8c4 45%, #b98ac9 100%)',
        }}
      >
        {/* stars */}
        {stars.map((s, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: s.d, delay: s.delay }}
            style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: 3, height: 3, borderRadius: '50%', background: '#fff' }}
          />
        ))}

        {/* heart constellation appears after release */}
        <AnimatePresence>
          {released &&
            heart.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + i * 0.05 }}
                style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: 6, height: 6, borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px #ffd98a' }}
              />
            ))}
        </AnimatePresence>

        {/* the lantern */}
        <AnimatePresence>
          {released && (
            <motion.div
              initial={{ y: 260, opacity: 0, scale: 0.8 }}
              animate={{ y: -60, opacity: [0, 1, 1, 0], scale: 1 }}
              transition={{ duration: 3.4, ease: 'easeOut' }}
              style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', textAlign: 'center' }}
            >
              <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 14px #ffb35c)' }}>🏮</div>
              <div className="font-serif" style={{ fontStyle: 'italic', color: '#5a3b2a', fontSize: '0.95rem', maxWidth: 180 }}>
                {wish}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!released && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.9rem', justifyContent: 'center' }}>
          <input
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="I wish that we…"
            maxLength={60}
            style={{
              flex: 1,
              maxWidth: 300,
              padding: '0.6rem 0.9rem',
              borderRadius: '0.7rem',
              border: '1px solid rgba(199,154,75,0.5)',
              fontFamily: 'Quicksand, sans-serif',
              fontSize: '0.95rem',
              outline: 'none',
            }}
            onKeyDown={(e) => e.key === 'Enter' && release()}
          />
          <button
            onClick={release}
            style={{ padding: '0.6rem 1.1rem', borderRadius: '0.7rem', border: 'none', background: 'var(--rose)', color: '#fff', fontWeight: 600, fontFamily: 'Quicksand, sans-serif', cursor: 'pointer' }}
          >
            Release 🏮
          </button>
        </div>
      )}
    </div>
  );
}
