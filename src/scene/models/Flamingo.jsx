import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

// First real downloaded model — a low-poly Flamingo (.glb) with a built-in
// wing-flap animation. Source: three.js examples ("3 Dreams of Black", CC-BY).
// It flies a slow circle around the island, banking into the turn.
export default function Flamingo({
  radius = 7,
  height = 4,
  speed = 0.18,
  center = [0, 0, 0],
  // native model is ~177 units long; ~0.008 -> a ~1.4-unit graceful bird
  scale = 0.008,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/flamingo.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) first.reset().play();
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * speed;
    const x = center[0] + Math.cos(t) * radius;
    const z = center[2] + Math.sin(t) * radius;
    const y = center[1] + height + Math.sin(t * 2) * 0.6;

    group.current.position.set(x, y, z);
    // face along the flight direction (tangent to the circle)
    group.current.rotation.y = -t + Math.PI / 2;
    // gentle bank into the turn
    group.current.rotation.z = Math.sin(t) * 0.12;
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/flamingo.glb');
