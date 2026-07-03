import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blip, chime } from './sound.js';

// Achievements game: tap fast to fill the cheer meter to 100%. The meter ebbs,
// so keep cheering! Trophies pop up as you climb.
export default function CheerMeter({ onWin }) {
  const [meter, setMeter] = useState(0);
  const [pops, setPops] = useState([]);
  const done = useRef(false);
  const meterRef = useRef(0);

  useEffect(() => {
    let raf;
    const tick = () => {
      meterRef.current = Math.max(0, meterRef.current - 0.5); // ebb
      setMeter(meterRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function cheer() {
    if (done.current) return;
    meterRef.current = Math.min(100, meterRef.current + 6);
    setMeter(meterRef.current);
    blip(500 + meterRef.current * 6, 0.06);
    setPops((p) => [...p, { id: Math.random(), x: 20 + Math.random() * 60, e: ['🏆', '🥇', '⭐', '🎉'][Math.floor(Math.random() * 4)] }]);
    if (meterRef.current >= 100 && !done.current) {
      done.current = true;
      chime();
      setTimeout(() => onWin(), 1300);
    }
  }

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        tap fast to cheer each other on — fill the meter! 🏆
      </p>
      <div
        onPointerDown={cheer}
        style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', background: 'radial-gradient(120% 120% at 50% 15%, #fff3d6 0%, #ffe0a0 55%, #ffd06b 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        {/* podium + trophy grows with meter */}
        <motion.div animate={{ scale: 0.6 + meter / 140 }} style={{ fontSize: '5rem', marginBottom: 60 }}>
          🏆
        </motion.div>

        {/* meter bar */}
        <div style={{ position: 'absolute', bottom: 20, left: '10%', right: '10%', height: 16, background: 'rgba(255,255,255,0.5)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: `${meter}%`, height: '100%', background: 'linear-gradient(90deg,#ff9d3c,#ff5c8a)', transition: 'width 0.05s' }} />
        </div>

        <AnimatePresence>
          {pops.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{ y: -160, opacity: 0, scale: 1.4 }}
              transition={{ duration: 1 }}
              onAnimationComplete={() => setPops((arr) => arr.filter((a) => a.id !== p.id))}
              style={{ position: 'absolute', bottom: 120, left: `${p.x}%`, fontSize: '1.8rem', pointerEvents: 'none' }}
            >
              {p.e}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
