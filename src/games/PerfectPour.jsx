import { useEffect, useRef, useState } from 'react';
import { blip, chime } from './sound.js';

// Hotel-date game: the wine rises and falls; tap Stop when it's within the
// golden band for the perfect toast.
const TARGET = 70; // % centre of the band
const TOL = 9; // half-width of the accept band

export default function PerfectPour({ onWin }) {
  const [fill, setFill] = useState(0);
  const [msg, setMsg] = useState('');
  const fillRef = useRef(0);
  const vRef = useRef(0.65);
  const rising = useRef(true);
  const done = useRef(false);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (rising.current && !done.current) {
        fillRef.current += vRef.current;
        if (fillRef.current >= 100) {
          fillRef.current = 100;
          vRef.current = -Math.abs(vRef.current);
        } else if (fillRef.current <= 0) {
          fillRef.current = 0;
          vRef.current = Math.abs(vRef.current);
        }
        setFill(fillRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function stop() {
    if (done.current) return;
    rising.current = false;
    const value = fillRef.current;
    if (Math.abs(value - TARGET) <= TOL) {
      done.current = true;
      chime();
      setMsg('A perfect pour — to us 🥂');
      setTimeout(() => onWin(), 1400);
    } else {
      blip(200, 0.2, 'sawtooth');
      setMsg(value < TARGET ? 'A little short — try again' : 'A little too much — try again');
      setTimeout(() => {
        setMsg('');
        rising.current = true;
      }, 800);
    }
  }

  const bottom = TARGET - TOL;
  const bandH = TOL * 2;

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        tap Stop when the wine is inside the golden band 🍷
      </p>
      <div style={{ position: 'relative', height: 'min(62vh, 540px)', borderRadius: '1rem', overflow: 'hidden', background: 'radial-gradient(120% 120% at 50% 10%, #3a2440 0%, #5a3550 60%, #7a4a66 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 150, height: 300, borderRadius: '0 0 60px 60px', border: '4px solid rgba(255,255,255,0.6)', borderTop: 'none', overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
          {/* accept band */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${bottom}%`, height: `${bandH}%`, background: 'rgba(255,217,138,0.28)', borderTop: '2px dashed #ffd98a', borderBottom: '2px dashed #ffd98a', zIndex: 2 }} />
          {/* wine */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill}%`, background: 'linear-gradient(180deg,#b8375c,#7a1f3d)' }} />
        </div>
        {msg && (
          <div style={{ position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center' }}>
            <span className="font-serif" style={{ fontStyle: 'italic', color: '#ffe0ec', fontSize: '1.3rem' }}>{msg}</span>
          </div>
        )}
      </div>
      <button
        onClick={stop}
        style={{ marginTop: '0.9rem', padding: '0.6rem 1.8rem', borderRadius: '0.8rem', border: 'none', background: 'var(--rose)', color: '#fff', fontWeight: 600, fontFamily: 'Quicksand, sans-serif', cursor: 'pointer' }}
      >
        Stop 🍷
      </button>
    </div>
  );
}
