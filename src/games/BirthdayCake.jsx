import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Sparkles } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Birthday game: sustain your blow to extinguish the cake's real candles.
// Charge fills while you hold; flames flicker out; balloons + confetti + chime.

function playChime() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(g);
      g.connect(ac.destination);
      const t = ac.currentTime + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.start(t);
      o.stop(t + 0.42);
    });
  } catch { /* audio optional */ }
}

function Cake({ onAllOut }) {
  const { scene } = useGLTF('/models/poly/props/cake.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);

  // the model's own candle flames use the "yellow" material — grab them
  const flames = useMemo(() => {
    const arr = [];
    clone.traverse((o) => {
      if (o.isMesh && /yellow/i.test(o.material?.name || '')) arr.push(o);
    });
    return arr;
  }, [clone]);

  const norm = useMemo(() => {
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = 2.4 / Math.max(size.x, size.z);
    return { scale: s, off: [-center.x * s, -center.y * s, -center.z * s] };
  }, [clone]);

  const g = useRef();
  const charge = useRef(0);
  const fired = useRef(false);

  useFrame((st, dt) => {
    if (g.current) g.current.rotation.y = Math.sin(st.clock.elapsedTime * 0.35) * 0.3;

    const blowing = window.__blowing;
    // sustained blow fills charge; releasing lets it ebb back
    charge.current = Math.max(0, Math.min(1, charge.current + (blowing ? dt * 0.75 : -dt * 0.9)));
    window.__blowCharge = charge.current;

    const flick = 0.75 + Math.sin(st.clock.elapsedTime * 20) * 0.25;
    const scale = Math.max(0.001, (1 - charge.current) * flick);
    flames.forEach((f) => f.scale.setScalar(scale));

    if (charge.current >= 0.999 && !fired.current) {
      fired.current = true;
      flames.forEach((f) => (f.visible = false));
      onAllOut();
    }
  });

  return (
    <group ref={g}>
      <primitive object={clone} scale={norm.scale} position={norm.off} />
    </group>
  );
}

function ChargeBar() {
  const [w, setW] = useState(0);
  useEffect(() => {
    let id;
    const tick = () => {
      setW(window.__blowCharge || 0);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 8, background: 'rgba(255,255,255,0.5)', borderRadius: 6, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ width: `${w * 100}%`, height: '100%', background: 'linear-gradient(90deg,#ffd98a,#ff7aa2)' }} />
    </div>
  );
}

export default function BirthdayCake({ onWin }) {
  const [confetti, setConfetti] = useState(false);
  const done = useRef(false);

  function allOut() {
    if (done.current) return;
    done.current = true;
    window.__blowing = false;
    setConfetti(true);
    playChime();
    setTimeout(() => onWin(), 1800);
  }

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        press &amp; <b>hold</b> to blow — keep blowing until they're all out ✨
      </p>

      <div
        onPointerDown={() => (window.__blowing = true)}
        onPointerUp={() => (window.__blowing = false)}
        onPointerLeave={() => (window.__blowing = false)}
        style={{
          position: 'relative',
          height: 'min(64vh, 560px)',
          borderRadius: '1.1rem',
          overflow: 'hidden',
          cursor: 'pointer',
          background: 'radial-gradient(130% 120% at 50% 15%, #fff3ea 0%, #ffe0ef 55%, #f3ccdf 100%)',
          touchAction: 'none',
        }}
      >
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0.7, 5.6], fov: 42 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.75} color="#fff3e6" />
          <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff0d6" />
          <hemisphereLight args={['#fff6e8', '#ffd9ec', 0.5]} />
          <Suspense fallback={null}>
            <Cake onAllOut={allOut} />
          </Suspense>
          <Sparkles count={45} scale={[6, 4, 3]} size={3} speed={0.4} color="#ffd98a" opacity={0.7} />
        </Canvas>

        <ChargeBar />

        <AnimatePresence>
          {confetti && (
            <>
              <Confetti />
              <Balloons />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 70 }).map(() => ({
        x: (Math.random() - 0.5) * 380,
        r: Math.random() * 360,
        d: 0.9 + Math.random() * 1,
        c: ['#ff7aa2', '#ffd98a', '#8ec9ff', '#c8a2ff', '#ff9d6b'][Math.floor(Math.random() * 5)],
        s: 6 + Math.random() * 9,
      })),
    []
  );
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {bits.map((b, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: -20, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: 460, opacity: 0, rotate: b.r }}
          transition={{ duration: b.d, ease: 'easeIn' }}
          style={{ position: 'absolute', left: '50%', top: '20%', width: b.s, height: b.s * 0.6, background: b.c, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

function Balloons() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 460, opacity: 0 }}
          animate={{ y: -120, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, delay: i * 0.15, ease: 'easeOut' }}
          style={{ position: 'absolute', left: `${10 + i * 12}%`, fontSize: 34, filter: `hue-rotate(${i * 40}deg)` }}
        >
          🎈
        </motion.div>
      ))}
    </div>
  );
}

useGLTF.preload('/models/poly/props/cake.glb');
