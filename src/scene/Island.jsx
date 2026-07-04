import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import IslandProps from './IslandProps.jsx';
import Prop from './Prop.jsx';
import { initSurface, surfacePool } from './islandSurface.js';
import { asset } from '../lib/asset.js';

// Floating island = a REAL island model (CC-BY vanAchen) auto-normalized to a
// consistent size, decorated with CC0 Quaternius trees/rocks/flowers, plus the
// chapter's themed props (see IslandProps).
const MODELS = {
  island: asset('models/poly/terrain/island.glb'),
  pine: asset('models/poly/nature/tree2.glb'),
  bush: asset('models/poly/nature/bush.glb'),
  flower: asset('models/poly/nature/flower.glb'),
  mountain: asset('models/poly/terrain/mountain.glb'),
};

const TARGET_WIDTH = 6.5;
const TOP_Y = 0.15;

export default function Island({ position = [0, 0, 0], chapter, seed = 1, bob = true }) {
  const groupRef = useRef();

  const island = useGLTF(MODELS.island);

  const norm = useMemo(() => {
    const box = new Box3().setFromObject(island.scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = TARGET_WIDTH / Math.max(size.x, size.z);
    return {
      scale: s,
      pos: [-center.x * s, TOP_Y - box.max.y * s, -center.z * s],
      radius: (Math.max(size.x, size.z) * s) / 2,
    };
  }, [island]);

  const scatter = useMemo(() => {
    // build the raycast copy once, then sample REAL surface points
    initSurface(island.scene, norm);
    const pool = surfacePool(norm.radius * 0.72, TOP_Y);
    const rng = mulberry32(seed * 9973);
    const pick = () => pool[Math.floor(rng() * pool.length)] || [0, TOP_Y, 0];

    const trees = new Array(3 + Math.floor(rng() * 2)).fill(0).map(() => {
      const isBush = rng() < 0.4;
      return {
        pos: pick(),
        yaw: rng() * Math.PI * 2,
        url: isBush ? MODELS.bush : MODELS.pine,
        h: isBush ? 0.7 + rng() * 0.4 : 1.3 + rng() * 0.7,
      };
    });
    const flowers = new Array(4).fill(0).map(() => ({
      pos: pick(),
      yaw: rng() * Math.PI * 2,
      h: 0.4 + rng() * 0.3,
    }));
    const mtn = rng() < 0.5 ? { pos: pick(), yaw: rng() * Math.PI * 2 } : null;
    return { trees, flowers, mtn };
  }, [seed, norm, island.scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    if (bob) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + seed) * 0.22;
    }
    groupRef.current.rotation.y = Math.sin(t * 0.1 + seed) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* the real island base model, normalized */}
      <Clone object={island.scene} scale={norm.scale} position={norm.pos} />

      {/* CC0 Quaternius greenery — base-seated on the real surface */}
      {scatter.trees.map((t, i) => (
        <Prop key={`t${i}`} url={t.url} x={t.pos[0]} y={t.pos[1]} z={t.pos[2]} h={t.h} yaw={t.yaw} />
      ))}
      {scatter.flowers.map((f, i) => (
        <Prop key={`f${i}`} url={MODELS.flower} x={f.pos[0]} y={f.pos[1]} z={f.pos[2]} h={f.h} yaw={f.yaw} />
      ))}
      {scatter.mtn && (
        <Prop url={MODELS.mountain} x={scatter.mtn.pos[0]} y={scatter.mtn.pos[1]} z={scatter.mtn.pos[2]} h={1.4} yaw={scatter.mtn.yaw} />
      )}

      {/* the chapter's themed props (also snapped to the real surface) */}
      {chapter && <IslandProps chapter={chapter} topY={TOP_Y} />}
    </group>
  );
}

Object.values(MODELS).forEach((m) => useGLTF.preload(m));

// tiny seeded PRNG so islands look the same each reload
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
