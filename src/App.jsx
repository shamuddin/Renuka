import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Lenis from 'lenis';
import Experience from './scene/Experience.jsx';
import LoadingScreen from './ui/LoadingScreen.jsx';
import Intro from './ui/Intro.jsx';
import ChapterText from './ui/ChapterText.jsx';
import GamePrompt from './ui/GamePrompt.jsx';
import GameShell from './games/GameShell.jsx';
import { useStore } from './store/useStore.js';

// How much scroll distance the whole journey spans (in viewport heights).
// 12 chapters + intro/finale breathing room.
const SCROLL_VH = 1300;

// Flips ready once the 3D scene has mounted (inside Suspense).
function ReadyFlag() {
  const setReady = useStore((s) => s.setReady);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, [setReady]);
  return null;
}

export default function App() {
  const ready = useStore((s) => s.ready);
  const setScroll = useStore((s) => s.setScroll);
  const freeCam = useStore((s) => s.freeCam);
  const toggleFreeCam = useStore((s) => s.toggleFreeCam);
  const activeGame = useStore((s) => s.activeGame);

  // 'F' key toggles free-look camera
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'f' || e.key === 'F') toggleFreeCam();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleFreeCam]);

  const lenisRef = useRef(null);

  // pause page-scroll while free-look is active (so the wheel zooms instead)
  useEffect(() => {
    if (!lenisRef.current) return;
    if (freeCam) lenisRef.current.stop();
    else lenisRef.current.start();
  }, [freeCam]);

  // Smooth scroll with Lenis, feeding normalized progress into the store.
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    function onScroll({ scroll, limit }) {
      const p = limit > 0 ? scroll / limit : 0;
      setScroll(p);
    }
    lenis.on('scroll', onScroll);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setScroll]);

  return (
    <>
      <LoadingScreen visible={!ready} />

      {/* Fixed 3D canvas */}
      <div className="scroll-canvas">
        <Canvas
          shadows
          dpr={[1, 1.8]}
          frameloop={activeGame ? 'never' : 'always'}
          camera={{ position: [0, 3, 13], fov: 50 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            // Neutral tone mapping keeps the bright candy pastels vivid
            // (ACES, the default, mutes them toward grey).
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <Suspense fallback={null}>
            <Experience />
            <ReadyFlag />
          </Suspense>
        </Canvas>
      </div>

      {/* Invisible tall track that creates the scrollable distance */}
      <div className="scroll-track" style={{ height: `${SCROLL_VH}vh` }} />

      {ready && !freeCam && <Intro />}
      {ready && !freeCam && <ChapterText />}
      {ready && !freeCam && <GamePrompt />}
      {ready && <GameShell />}

      {ready && (
        <button
          onClick={toggleFreeCam}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 30,
            padding: '0.5rem 0.9rem',
            borderRadius: '0.8rem',
            border: '1px solid rgba(201,79,124,0.35)',
            background: freeCam ? '#c94f7c' : 'rgba(255,255,255,0.6)',
            color: freeCam ? '#fff' : '#8a5a6a',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          {freeCam ? '🎥 Free look: ON (F)' : '🎥 Free look (F)'}
        </button>
      )}
    </>
  );
}
