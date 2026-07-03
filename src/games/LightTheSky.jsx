import { useEffect, useRef, useState } from 'react';
import { blip, chime } from './sound.js';

// Finale game: tap the sky to launch fireworks. After lighting up the night
// enough times, the anniversary message blooms across the sky.
const TARGET = 6;

export default function LightTheSky({ onWin }) {
  const wrapRef = useRef(null);
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState(false);

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

    let rockets = [];
    let sparks = [];
    let cnt = 0;
    let done = false;
    let raf;

    const colors = ['#ff7aa2', '#ffd98a', '#8ec9ff', '#c8a2ff', '#ff9d6b', '#7dffcf'];

    const launch = (e) => {
      if (done) return;
      const r = canvas.getBoundingClientRect();
      const tx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const ty = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      rockets.push({ x: tx, y: H, tx, ty: Math.max(60, ty), c: colors[cnt % colors.length] });
      blip(300, 0.12, 'triangle');
    };
    canvas.addEventListener('pointerdown', launch);

    const loop = () => {
      // trail fade
      ctx.fillStyle = 'rgba(20,16,40,0.25)';
      ctx.fillRect(0, 0, W, H);

      rockets = rockets.filter((r) => {
        r.y -= 9;
        ctx.fillStyle = r.c;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.ty) {
          // explode
          for (let i = 0; i < 46; i++) {
            const a = (i / 46) * Math.PI * 2;
            const sp = 2 + Math.random() * 3;
            sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: r.c });
          }
          blip(680, 0.15);
          cnt++;
          setCount(cnt);
          if (cnt >= TARGET && !done) {
            done = true;
            setMsg(true);
            chime([523, 659, 784, 1047, 1319]);
            setTimeout(() => onWin(), 2600);
          }
          return false;
        }
        return true;
      });

      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.life -= 0.016;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return s.life > 0;
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', launch);
    };
  }, [onWin]);

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        tap the sky to light our fireworks 🎆 &nbsp;·&nbsp; {count}/{TARGET}
      </p>
      <div ref={wrapRef} style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden', background: 'linear-gradient(180deg,#20143a 0%,#3a2358 55%,#5a3a6e 100%)' }}>
        <canvas style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'pointer' }} />
        {msg && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div className="font-title" style={{ fontStyle: 'italic', color: '#fff', fontSize: 'clamp(2rem,5vw,3.4rem)', textShadow: '0 2px 20px rgba(255,150,200,0.8)' }}>
              Happy One Year 💗
            </div>
            <div className="font-serif" style={{ fontStyle: 'italic', color: '#ffe0ec', fontSize: '1.3rem' }}>
              my world, my love, my everything
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
