import { useEffect, useRef, useState } from 'react';
import { blip, chime } from './sound.js';

// Food game: drag back from the fork to aim, release to fling a bite across to
// your partner. Land 3 bites to win.
const TARGET = 3;
const FOODS = ['🍔', '🍕', '🍩', '🍦', '🍫'];

export default function FeedEachOther({ onWin }) {
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

    const origin = { x: 70, y: H - 80 };
    const mouth = { x: W - 80, y: H * 0.35, r: 40 };
    let food = { ...origin, vx: 0, vy: 0, flying: false, emoji: FOODS[0] };
    let aiming = false;
    let aim = { x: origin.x, y: origin.y };
    let sc = 0;
    let done = false;
    let raf;
    let mouthBounce = 0;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left, y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top };
    };
    const down = (e) => {
      if (food.flying) return;
      aiming = true;
      aim = pos(e);
    };
    const move = (e) => {
      if (aiming) aim = pos(e);
    };
    const up = () => {
      if (!aiming) return;
      aiming = false;
      food.vx = (origin.x - aim.x) * 0.16;
      food.vy = (origin.y - aim.y) * 0.16;
      food.flying = true;
      blip(420, 0.1);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      mouthBounce *= 0.9;

      // partner / mouth
      ctx.font = `${44 + mouthBounce}px serif`;
      ctx.fillText('😋', mouth.x - 26, mouth.y + 16);

      // fork base
      ctx.font = '40px serif';
      ctx.fillText('🍴', origin.x - 20, origin.y + 14);

      // aim guide
      if (aiming) {
        ctx.strokeStyle = 'rgba(201,79,124,0.6)';
        ctx.setLineDash([5, 6]);
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(origin.x + (origin.x - aim.x), origin.y + (origin.y - aim.y));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // food
      if (food.flying) {
        food.vy += 0.3;
        food.x += food.vx;
        food.y += food.vy;
      } else if (!aiming) {
        food.x = origin.x;
        food.y = origin.y;
      }
      ctx.font = '30px serif';
      ctx.fillText(food.emoji, food.x - 15, food.y + 10);

      if (food.flying) {
        if (Math.hypot(food.x - mouth.x, food.y - mouth.y) < mouth.r) {
          sc++;
          setScore(sc);
          blip(760 + sc * 60, 0.12);
          mouthBounce = 14;
          food = { ...origin, vx: 0, vy: 0, flying: false, emoji: FOODS[sc % FOODS.length] };
          if (sc >= TARGET && !done) {
            done = true;
            chime();
            setTimeout(() => onWin(), 900);
          }
        } else if (food.y > H + 40 || food.x > W + 40 || food.x < -40) {
          food = { ...origin, vx: 0, vy: 0, flying: false, emoji: FOODS[sc % FOODS.length] };
        }
      }

      if (!done) raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [onWin]);

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        drag back from the fork &amp; release to feed each other 🍴 &nbsp;·&nbsp; {score}/{TARGET}
      </p>
      <div ref={wrapRef} style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden', background: 'linear-gradient(180deg,#fff0d6 0%,#ffd9b3 60%,#ffc48a 100%)' }}>
        <canvas style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }} />
      </div>
    </div>
  );
}
