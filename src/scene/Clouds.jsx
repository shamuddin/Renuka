import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Clouds as DreiClouds } from '@react-three/drei';
import { MeshBasicMaterial } from 'three';

// Soft white puffs drifting slowly across the sky.
// Uses drei's instanced Cloud system for cheap, fluffy volume.
export default function Clouds({ count = 14, zCenter = 0, zSpread = 220 }) {
  const groupRef = useRef();

  const puffs = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      key: i,
      position: [
        (Math.random() - 0.5) * 240,
        Math.random() * 44 - 6,
        (Math.random() - 0.5) * zSpread + zCenter,
      ],
      scale: 2.2 + Math.random() * 3.5,
      speed: 0.6 + Math.random() * 0.9,
      opacity: 0.55 + Math.random() * 0.35,
      seg: 12 + Math.floor(Math.random() * 8),
    }));
  }, [count, zCenter, zSpread]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.x += puffs[i].speed * dt;
      // wrap around so clouds keep flowing
      if (child.position.x > 130) child.position.x = -130;
    });
  });

  return (
    <group ref={groupRef}>
      <DreiClouds material={MeshBasicMaterial} limit={400}>
        {puffs.map((p) => (
          <Cloud
            key={p.key}
            position={p.position}
            scale={p.scale}
            segments={p.seg}
            bounds={[10, 2, 3]}
            volume={6}
            opacity={p.opacity}
            color="#ffffff"
            speed={0}
            fade={30}
          />
        ))}
      </DreiClouds>
    </group>
  );
}
