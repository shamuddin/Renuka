import { useEffect, useRef, useState } from 'react';
import { chime } from './sound.js';

// Flight game: the airplane window is fogged. Wipe it with your finger to
// clear the condensation and reveal the view + a note.
export default function WindowSeat({ onWin }) {
  const wrapRef = useRef(null);
  const [pct, setPct] = useState(0);

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

    // fog layer
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#eef4f8');
    grad.addColorStop(1, '#dbe6ee');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-out';

    let drawing = false;
    let won = false;
    const wipe = (e) => {
      if (!drawing) return;
      const r = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      ctx.beginPath();
      ctx.arc(x, y, 34, 0, Math.PI * 2);
      ctx.fill();
    };
    const down = (e) => {
      drawing = true;
      wipe(e);
    };
    const up = () => {
      drawing = false;
      // measure cleared fraction
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < img.length; i += 40) if (img[i] < 40) clear++;
      const frac = clear / (img.length / 40);
      setPct(Math.round(frac * 100));
      if (frac > 0.55 && !won) {
        won = true;
        ctx.clearRect(0, 0, W, H);
        chime();
        setTimeout(() => onWin(), 1200);
      }
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', wipe);
    window.addEventListener('pointerup', up);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', wipe);
      window.removeEventListener('pointerup', up);
    };
  }, [onWin]);

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        wipe the foggy window to see the view ✈️ &nbsp;·&nbsp; {pct}% clear
      </p>
      <div ref={wrapRef} style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden' }}>
        {/* the view behind the fog */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#ffd6a0 0%,#ff9ec4 40%,#8ec9ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🏙️✈️</div>
          <div className="font-title" style={{ fontStyle: 'italic', color: '#7a3350', fontSize: '1.8rem' }}>Hello, Pune!</div>
          <div className="font-serif" style={{ fontStyle: 'italic', color: '#5a3b4a', maxWidth: 320 }}>
            our first time above the clouds — a little scared, mostly in love.
          </div>
        </div>
        <canvas style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', cursor: 'grab' }} />
      </div>
    </div>
  );
}
