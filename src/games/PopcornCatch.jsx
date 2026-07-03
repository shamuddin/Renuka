import { useEffect, useRef, useState } from 'react';
import { blip, chime } from './sound.js';

// Movie game: move the bucket to catch falling popcorn. Catch the target
// amount before you miss too many.
const TARGET = 12;
const MAX_MISS = 5;

export default function PopcornCatch({ onWin }) {
  const wrapRef = useRef(null);
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = wrap.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let bucketX = W / 2;
    let drops = [];
    let sc = 0;
    let ms = 0;
    let done = false;
    let raf;
    let spawn = 0;

    const move = (e) => {
      const r = canvas.getBoundingClientRect();
      bucketX = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    };
    canvas.addEventListener('pointermove', move);

    const loop = () => {
      spawn++;
      if (spawn % 34 === 0) drops.push({ x: 30 + Math.random() * (W - 60), y: -20, v: 2.4 + Math.random() * 2 });

      ctx.clearRect(0, 0, W, H);

      // bucket
      const bw = 90;
      const by = H - 46;
      ctx.fillStyle = '#e23b4e';
      ctx.beginPath();
      ctx.moveTo(bucketX - bw / 2, by);
      ctx.lineTo(bucketX + bw / 2, by);
      ctx.lineTo(bucketX + bw / 2 - 12, by + 46);
      ctx.lineTo(bucketX - bw / 2 + 12, by + 46);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(bucketX - bw / 2 + 8 + i * 20, by, 8, 46);
      }

      drops = drops.filter((d) => {
        d.y += d.v;
        // draw popcorn
        ctx.font = '26px serif';
        ctx.fillText('🍿', d.x - 13, d.y);
        if (d.y > by && d.y < by + 40 && Math.abs(d.x - bucketX) < bw / 2) {
          sc++;
          setScore(sc);
          blip(700 + sc * 20, 0.08);
          if (sc >= TARGET && !done) {
            done = true;
            chime();
            setTimeout(() => onWin(), 900);
          }
          return false;
        }
        if (d.y > H + 30) {
          ms++;
          setMiss(ms);
          return false;
        }
        return true;
      });

      if (!done) raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', move);
    };
  }, [onWin]);

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        move the bucket to catch the popcorn 🍿 &nbsp;·&nbsp; {score}/{TARGET} &nbsp; (missed {miss})
      </p>
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          height: 'min(62vh, 540px)',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'linear-gradient(180deg,#2b2350 0%,#4a3a7a 60%,#6d5aa0 100%)',
        }}
      >
        <div style={{ position: 'absolute', top: 16, left: 0, right: 0, textAlign: 'center', color: '#ffe6a0', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.3rem', opacity: 0.8 }}>
          🎬 now showing: us
        </div>
        <canvas style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }} />
      </div>
    </div>
  );
}
