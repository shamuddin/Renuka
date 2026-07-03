import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Birthday game: swipe across the cake along the dashed line to slice it.
// A clean swipe crossing the centre line splits the cake and wins.
export default function SliceTheCake({ onWin }) {
  const areaRef = useRef(null);
  const start = useRef(null);
  const [sliced, setSliced] = useState(false);

  const CUT_X = 0.5; // centre of the area (0..1)

  function onDown(e) {
    const r = areaRef.current.getBoundingClientRect();
    start.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }

  function onUp(e) {
    if (!start.current || sliced) return;
    const r = areaRef.current.getBoundingClientRect();
    const end = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    const s = start.current;
    start.current = null;

    const dx = end.x - s.x;
    const dist = Math.hypot(dx, end.y - s.y);
    const crossesCut = (s.x - CUT_X) * (end.x - CUT_X) < 0; // start & end on opposite sides
    const inCakeBand = s.y > 0.3 && s.y < 0.95 && end.y > 0.3 && end.y < 0.95;
    const longEnough = dist > 0.25;

    if (crossesCut && inCakeBand && longEnough) {
      setSliced(true);
      setTimeout(() => onWin(), 1100);
    }
  }

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.8rem' }}>
        swipe across the dashed line to slice the cake 🎂
      </p>

      <div
        ref={areaRef}
        onPointerDown={onDown}
        onPointerUp={onUp}
        style={{
          position: 'relative',
          width: 'min(78vw, 420px)',
          height: 'min(52vw, 300px)',
          margin: '0 auto',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      >
        {/* dashed cut guide */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '18%',
            bottom: '4%',
            width: 0,
            borderLeft: '3px dashed rgba(199,154,75,0.85)',
            transform: 'translateX(-50%)',
          }}
        />

        {/* two cake halves that split apart when sliced */}
        {[-1, 1].map((side) => (
          <motion.div
            key={side}
            animate={sliced ? { x: side * 60, rotate: side * 6 } : { x: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            style={{
              position: 'absolute',
              left: side < 0 ? '10%' : '50%',
              right: side < 0 ? '50%' : '10%',
              bottom: '4%',
              top: '30%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                left: side < 0 ? 0 : 'auto',
                right: side < 0 ? 'auto' : 0,
                width: 'calc(200% )',
                [side < 0 ? 'left' : 'right']: 0,
                background:
                  'linear-gradient(#f7d9e6 0 22%, #fff 22% 30%, #b5764f 30% 62%, #f3c1d6 62% 70%, #a9683f 70% 100%)',
                borderRadius: side < 0 ? '14px 0 0 14px' : '0 14px 14px 0',
                boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.08)',
              }}
            />
          </motion.div>
        ))}

        {/* candles */}
        {[0.32, 0.5, 0.68].map((cx, i) => (
          <div key={i} style={{ position: 'absolute', left: `${cx * 100}%`, top: '20%', transform: 'translateX(-50%)' }}>
            <div style={{ width: 5, height: 26, background: '#fff', margin: '0 auto', borderRadius: 2 }} />
            <motion.div
              animate={{ scaleY: [1, 1.25, 1], opacity: sliced ? 0 : 1 }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              style={{ width: 9, height: 12, background: 'radial-gradient(#fff6a0,#ff9d3c)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', margin: '-14px auto 0' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
