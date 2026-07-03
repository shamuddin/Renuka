import { useEffect, useState } from 'react';
import { START_DATE } from '../store/useStore.js';

function diff() {
  const now = Date.now();
  const ms = Math.max(0, now - START_DATE.getTime());
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  // a playful figure: ~ heartbeats together (avg 72 bpm)
  const heartbeats = Math.floor((ms / 60000) * 72);
  return { days, hours, minutes, seconds, heartbeats };
}

export default function Counter() {
  const [t, setT] = useState(diff);

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cell = (v, label) => (
    <div style={{ textAlign: 'center', minWidth: 60 }}>
      <div className="font-title" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--rose)', lineHeight: 1 }}>
        {String(v).padStart(2, '0')}
      </div>
      <div className="eyebrow" style={{ fontSize: '0.6rem', letterSpacing: 2, marginTop: 3 }}>
        {label}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {cell(t.days, 'days')}
        {cell(t.hours, 'hours')}
        {cell(t.minutes, 'mins')}
        {cell(t.seconds, 'secs')}
      </div>
      <div className="font-serif" style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--ink)' }}>
        {t.heartbeats.toLocaleString()} heartbeats together
      </div>
    </div>
  );
}
