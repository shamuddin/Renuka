import { useFrame } from '@react-three/fiber';
import { Sparkles, OrbitControls } from '@react-three/drei';
import SkyDome from './SkyDome.jsx';
import Clouds from './Clouds.jsx';
import Water from './Water.jsx';
import Island from './Island.jsx';
import FlightPath from './FlightPath.jsx';
import Flamingo from './models/Flamingo.jsx';
import { useStore } from '../store/useStore.js';
import { chapters } from '../data/story.js';
import { camCurve, targetCurve, islandPositions, journeyMidZ, clamp01, journeyT } from './journey.js';

// Phase 2: the full 12-island journey. The camera flies a smooth spline
// through every island as you scroll; a glowing ribbon connects them.
function CameraRig() {
  useFrame((state) => {
    if (useStore.getState().freeCam) return; // let OrbitControls drive
    const t = journeyT(useStore.getState().scroll);
    const { camera, pointer } = state;

    const pos = camCurve.getPoint(t);
    const look = targetCurve.getPoint(clamp01(t + 0.015));

    // subtle mouse parallax
    pos.x += pointer.x * 0.7;
    pos.y += pointer.y * 0.4;

    camera.position.lerp(pos, 0.08);
    camera.lookAt(look);

    // report the active chapter for UI
    const idx = Math.round(t * (chapters.length - 1));
    if (useStore.getState().activeChapter !== idx) {
      useStore.getState().setActiveChapter(idx);
    }
  });

  return null;
}

// Free-look camera: drag to orbit (side/up/down), scroll to zoom, right-drag to
// pan. Mounts only when enabled, centred on the island you're currently viewing.
function FreeLook() {
  const freeCam = useStore((s) => s.freeCam);
  if (!freeCam) return null;
  const t = targetCurve.getPoint(clamp01(useStore.getState().scroll));
  return (
    <OrbitControls
      makeDefault
      enablePan
      enableZoom
      target={[t.x, t.y, t.z]}
      minDistance={2}
      maxDistance={140}
      maxPolarAngle={Math.PI}
    />
  );
}

export default function Experience() {
  return (
    <>
      <CameraRig />
      <FreeLook />

      {/* Soft pastel fog: current island stays crisp, distant ones fade
          gently so the path ahead still teases into view */}
      <fog attach="fog" args={['#dbeeff', 30, 105]} />

      {/* Bright, warm lighting */}
      <ambientLight intensity={0.85} color="#fff3e6" />
      <hemisphereLight args={['#fff6e8', '#cfe8ff', 0.75]} />
      <directionalLight
        position={[10, 16, 8]}
        intensity={1.5}
        color="#fff0d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      <SkyDome />
      <Water position={[0, -18, journeyMidZ]} size={700} />
      <Clouds count={26} zCenter={journeyMidZ} zSpread={220} />

      <Sparkles
        count={70}
        scale={[26, 12, 180]}
        position={[0, 6, journeyMidZ]}
        size={3.5}
        speed={0.28}
        opacity={0.7}
        color="#fff2c8"
      />

      <FlightPath />

      {/* all 12 islands along the journey */}
      {chapters.map((ch, i) => (
        <Island
          key={ch.id}
          position={islandPositions[i]}
          chapter={ch}
          seed={i + 1}
        />
      ))}

      {/* flamingo circles the first island (the proposal) */}
      <Flamingo
        radius={6.5}
        height={3.2}
        speed={0.16}
        center={[islandPositions[0][0], islandPositions[0][1] + 0.5, islandPositions[0][2]]}
      />
    </>
  );
}
