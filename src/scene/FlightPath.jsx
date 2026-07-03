import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TubeGeometry } from 'three';
import { useStore } from '../store/useStore.js';
import { pathCurve, islandPositions, clamp01 } from './journey.js';

// The connecting "flight path": a soft glowing ribbon threading every island,
// little waypoint rings above each one, and a bright dot that travels along
// the ribbon at the current scroll position.
export default function FlightPath() {
  const tube = useMemo(
    () => new TubeGeometry(pathCurve, 400, 0.03, 6, false),
    []
  );

  const dotRef = useRef();

  useFrame(() => {
    if (!dotRef.current) return;
    const t = clamp01(useStore.getState().scroll);
    const p = pathCurve.getPoint(t);
    dotRef.current.position.set(p.x, p.y, p.z);
  });

  return (
    <group>
      {/* the ribbon — soft and subtle, a gentle guide rather than a stripe */}
      <mesh geometry={tube}>
        <meshStandardMaterial
          color="#ffd0e0"
          emissive="#ffb3cd"
          emissiveIntensity={0.35}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* waypoint rings hovering above each island */}
      {islandPositions.map((p, i) => (
        <mesh key={i} position={[p[0], p[1] + 1.1, p[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.06, 8, 20]} />
          <meshStandardMaterial
            color="#fff2c8"
            emissive="#ffd98a"
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}

      {/* the traveling dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffd98a" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}
