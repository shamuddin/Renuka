import { useEffect, useRef, useState } from 'react';
import { blip, chime } from './sound.js';

// Cabin-crew-dream game: tap to keep flying up through the sky and collect the
// stars of your dream. Reach the target to make the dream take off.
const TARGET = 10;

export default function SkyDream({ onWin }) {
  const wrapRef = useRef(null);
  const [score, setScore] = useState(0);

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

    let y = H / 2;
    let vy = 0;
    let stars = [];
    let clouds = Array.from({ length: 5 }).map(() => ({ x: Math.random() * W, y: Math.random() * H, s: 0.6 + Math.random() }));
    let sc = 0;
    let done = false;
    let raf;
    let f = 0;

    const flap = () => {
      vy = -4.6;
      blip(520, 0.07);
    };
    canvas.addEventListener('pointerdown', flap);

    const loop = () => {
      f++;
      vy += 0.28; // gravity
      y += vy;
      if (y < 30) {
        y = 30;
        vy = 0;
      }
      if (y > H - 30) {
        y = H - 30;
        vy = 0;
      }

      if (f % 46 === 0) stars.push({ x: W + 20, y: 40 + Math.random() * (H - 80) });

      ctx.clearRect(0, 0, W, H);

      // clouds
      clouds.forEach((c) => {
        c.x -= 0.5 * c.s;
        if (c.x < -60) c.x = W + 60;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 40 * c.s, 20 * c.s, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // plane
      ctx.font = '34px serif';
      ctx.save();
      ctx.translate(90, y);
      ctx.rotate(Math.max(-0.4, Math.min(0.5, vy * 0.06)));
      ctx.fillText('✈️', -18, 12);
      ctx.restore();

      // stars
      stars = stars.filter((s) => {
        s.x -= 3.2;
        ctx.font = '26px serif';
        ctx.fillText('⭐', s.x - 13, s.y);
        if (Math.abs(s.x - 90) < 26 && Math.abs(s.y - y) < 28) {
          sc++;
          setScore(sc);
          blip(800 + sc * 30, 0.09);
          if (sc >= TARGET && !done) {
            done = true;
            chime();
            setTimeout(() => onWin(), 900);
          }
          return false;
        }
        return s.x > -30;
      });

      if (!done) raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', flap);
    };
  }, [onWin]);

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        tap to fly and collect the stars of your dream ⭐ &nbsp;·&nbsp; {score}/{TARGET}
      </p>
      <div ref={wrapRef} style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden', background: 'linear-gradient(180deg,#bfe3ff 0%,#e8f4ff 60%,#fff3e0 100%)' }}>
        <canvas style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'pointer' }} />
      </div>
    </div>
  );
}
