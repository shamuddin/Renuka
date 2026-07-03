import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Clone, Sparkles, Html } from '@react-three/drei';
import { Box3, Vector3 } from 'three';

// Theme-park game: the real ferris wheel spins with a heart "cabin". Tap Stop
// so your heart-cabin lands at the very top for the perfect view.
function Wheel({ onResult }) {
  const { scene } = useGLTF('/models/poly/props/ferriswheel.glb');
  const norm = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = 3.2 / Math.max(size.x, size.y);
    return {
      scale: s,
      off: [-center.x * s, -center.y * s, -center.z * s],
      R: (Math.max(size.x, size.y) * s) / 2 * 0.78,
    };
  }, [scene]);

  // The WHEEL stays still (its legs shouldn't spin). Only your heart cabin
  // orbits the rim; you stop it at the top.
  const marker = useRef();
  const angle = useRef(Math.random() * Math.PI * 2);
  const speed = useRef(2.4);
  const stopping = useRef(false);

  useFrame((_, dt) => {
    if (stopping.current) {
      speed.current *= 0.94;
      if (speed.current < 0.02) {
        stopping.current = false;
        speed.current = 0;
        const a = ((angle.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        let d = Math.abs(a - Math.PI / 2); // top of circle is at angle π/2
        d = Math.min(d, Math.PI * 2 - d);
        onResult(d < 0.42);
      }
    }
    angle.current += speed.current * dt;
    if (marker.current) {
      marker.current.position.set(Math.cos(angle.current) * norm.R, Math.sin(angle.current) * norm.R, 0.4);
    }
  });

  window.__wheelStop = () => {
    stopping.current = true;
  };
  window.__wheelSpin = () => {
    speed.current = 2.2 + Math.random() * 0.9;
    stopping.current = false;
  };

  return (
    <group>
      <Clone object={scene} scale={norm.scale} position={norm.off} />
      {/* your heart cabin orbiting the rim */}
      <group ref={marker}>
        <mesh>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#ff5c8a" emissive="#ff2d6b" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <pointLight color="#ff6b9d" intensity={1.6} distance={2.5} />
        <Html center distanceFactor={7}>
          <div style={{ fontSize: 20 }}>❤️</div>
        </Html>
      </group>
    </group>
  );
}

export default function StopTheWheel({ onWin }) {
  const [msg, setMsg] = useState('');
  const [spinning, setSpinning] = useState(true);

  function handleResult(win) {
    if (win) {
      setMsg('Perfect — the best view is always next to you 🎡');
      setTimeout(() => onWin(), 1600);
    } else {
      setMsg('So close! Give it another spin…');
      setSpinning(false);
      setTimeout(() => {
        window.__wheelSpin?.();
        setSpinning(true);
        setMsg('');
      }, 1400);
    }
  }

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <p className="font-serif" style={{ fontStyle: 'italic', color: 'var(--ink)', margin: '0 0 0.6rem' }}>
        stop the wheel with your ❤️ cabin at the top 🎡
      </p>
      <div
        style={{
          position: 'relative',
          height: 'min(62vh, 540px)',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'radial-gradient(120% 120% at 50% 20%, #fff2e0 0%, #cfe8ff 60%, #a9d3ff 100%)',
        }}
      >
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.4], fov: 45 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.8} color="#fff3e6" />
          <directionalLight position={[3, 4, 5]} intensity={1.1} />
          <Suspense fallback={null}>
            <Wheel onResult={handleResult} />
          </Suspense>
          <Sparkles count={30} scale={[6, 4, 3]} size={3} speed={0.3} color="#ffd98a" opacity={0.6} />
        </Canvas>

        {msg && (
          <div style={{ position: 'absolute', top: 12, left: 0, right: 0, pointerEvents: 'none' }}>
            <span className="font-serif" style={{ fontStyle: 'italic', color: 'var(--rose-deep)', background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '1rem' }}>
              {msg}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => window.__wheelStop?.()}
        disabled={!spinning}
        style={{
          marginTop: '0.9rem',
          padding: '0.6rem 1.6rem',
          borderRadius: '0.8rem',
          border: 'none',
          background: spinning ? 'var(--rose)' : 'rgba(180,150,160,0.5)',
          color: '#fff',
          fontWeight: 600,
          fontFamily: 'Quicksand, sans-serif',
          cursor: spinning ? 'pointer' : 'default',
        }}
      >
        Stop!
      </button>
    </div>
  );
}

useGLTF.preload('/models/poly/props/ferriswheel.glb');
