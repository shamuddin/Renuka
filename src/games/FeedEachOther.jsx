import { useEffect, useRef, useState } from 'react';
import { blip, chime } from './sound.js';

// Food game: drag from the fork toward your partner to aim (a dotted arc shows
// the throw), release to fling a bite into their mouth. Land 3 to win.
const TARGET = 3;
const FOODS = ['🍔', '🍕', '🍩', '🍦', '🍫'];
const K = 0.13; // drag -> velocity
const MAXV = 22; // speed cap
const G = 0.45; // gravity

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

    const origin = { x: 90, y: H - 90 };
    const mouth = { x: W - 100, y: H * 0.42, r: 52 };
    let food = { x: origin.x, y: origin.y, vx: 0, vy: 0, flying: false, emoji: FOODS[0] };
    let aiming = false;
    let aimPt = null;
    let sc = 0;
    let done = false;
    let raf;
    let bounce = 0;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const velFromAim = (p) => {
      let vx = (p.x - origin.x) * K;
      let vy = (p.y - origin.y) * K;
      const m = Math.hypot(vx, vy);
      if (m > MAXV) {
        vx = (vx / m) * MAXV;
        vy = (vy / m) * MAXV;
      }
      return { vx, vy };
    };

    const down = (e) => {
      if (food.flying) return;
      aiming = true;
      aimPt = pos(e);
    };
    const move = (e) => {
      if (aiming) aimPt = pos(e);
    };
    const up = () => {
      if (!aiming) return;
      aiming = false;
      const v = velFromAim(aimPt);
      food.vx = v.vx;
      food.vy = v.vy;
      food.flying = true;
      aimPt = null;
      blip(430, 0.1);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      bounce *= 0.9;

      // partner mouth
      ctx.font = `${46 + bounce}px serif`;
      ctx.fillText('😋', mouth.x - 26, mouth.y + 16);

      // fork
      ctx.font = '42px serif';
      ctx.fillText('🍴', origin.x - 22, origin.y + 14);

      // aim trajectory preview
      if (aiming && aimPt) {
        const v = velFromAim(aimPt);
        let sx = origin.x;
        let sy = origin.y;
        let svx = v.vx;
        let svy = v.vy;
        ctx.fillStyle = 'rgba(201,79,124,0.55)';
        for (let i = 0; i < 34; i++) {
          sx += svx;
          sy += svy;
          svy += G;
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          if (sy > H) break;
        }
      }

      // food
      if (food.flying) {
        food.vy += G;
        food.x += food.vx;
        food.y += food.vy;
      } else {
        food.x = origin.x;
        food.y = origin.y - 6;
      }
      ctx.font = '34px serif';
      ctx.fillText(food.emoji, food.x - 17, food.y + 12);

      if (food.flying) {
        if (Math.hypot(food.x - mouth.x, food.y - mouth.y) < mouth.r) {
          sc++;
          setScore(sc);
          blip(760 + sc * 60, 0.12);
          bounce = 16;
          food = { x: origin.x, y: origin.y, vx: 0, vy: 0, flying: false, emoji: FOODS[sc % FOODS.length] };
          if (sc >= TARGET && !done) {
            done = true;
            chime();
            setTimeout(() => onWin(), 900);
          }
        } else if (food.y > H + 60 || food.x > W + 60 || food.x < -60) {
          food = { x: origin.x, y: origin.y, vx: 0, vy: 0, flying: false, emoji: FOODS[sc % FOODS.length] };
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
        drag from the fork toward 😋, aim the arc, and release to feed 🍴 &nbsp;·&nbsp; {score}/{TARGET}
      </p>
      <div ref={wrapRef} style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden', background: 'linear-gradient(180deg,#fff0d6 0%,#ffd9b3 60%,#ffc48a 100%)' }}>
        <canvas style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'crosshair' }} />
      </div>
    </div>
  );
}
