import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Proposal game: trace the glowing heart. A rose-petal trail follows the
// cursor; when enough of the heart is traced, a ring rises with the question.
export default function TraceThePromise({ onWin }) {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // heart target points
    const cx = W / 2;
    const cy = H / 2 + 12;
    const s = Math.min(W, H) / 34;
    const targets = [];
    for (let i = 0; i < 64; i++) {
      const t = (i / 64) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      targets.push({ x: cx + x * s, y: cy - y * s, hit: false });
    }

    let drawing = false;
    let last = null;
    let particles = [];
    let won = false;
    let raf;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e) => {
      drawing = true;
      last = pos(e);
    };
    const onMove = (e) => {
      if (!drawing || won) return;
      const p = pos(e);
      last = p;
      // mark nearby targets hit + spawn petals
      targets.forEach((t) => {
        if (!t.hit && Math.hypot(t.x - p.x, t.y - p.y) < 26) t.hit = true;
      });
      for (let i = 0; i < 2; i++)
        particles.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2 - 0.3, life: 1, r: 3 + Math.random() * 4, hue: 330 + Math.random() * 25 });
      const ratio = targets.filter((t) => t.hit).length / targets.length;
      if (ratio > 0.82 && !won) {
        won = true;
        for (let i = 0; i < 80; i++)
          particles.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 1, life: 1, r: 3 + Math.random() * 5, hue: 330 + Math.random() * 40 });
        setTimeout(() => setDone(true), 900);
        setTimeout(() => onWin(), 2200);
      }
    };
    const onUp = () => {
      drawing = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // faint heart guide
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      targets.forEach((t, i) => (i ? ctx.lineTo(t.x, t.y) : ctx.moveTo(t.x, t.y)));
      ctx.closePath();
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = '#c79a4b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // traced (hit) glowing points
      targets.forEach((t) => {
        if (!t.hit) return;
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ff6b9d';
        ctx.fillStyle = '#ff8fb3';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // petal particles
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 0.02;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${p.hue},80%,70%)`;
        ctx.fillStyle = `hsl(${p.hue},85%,72%)`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.x, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [onWin]);

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        trace the heart to complete the promise 💍
      </p>
      <div
        style={{
          position: 'relative',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'radial-gradient(120% 120% at 50% 20%, #fff4ec 0%, #ffe1ee 60%, #f3d0e6 100%)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 'min(62vh, 540px)', touchAction: 'none', display: 'block' }}
        />
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
              <div style={{ fontSize: '3.4rem' }}>💍</div>
              <div className="font-title" style={{ fontStyle: 'italic', color: 'var(--rose)', fontSize: '1.8rem' }}>
                Will you be mine, forever?
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
