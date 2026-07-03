import { useMemo, useRef } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

// A big inverted sphere with a soft pastel vertical gradient.
// Bright and warm: golden near the horizon, peach up top, airy blue in the middle.
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vWorldPos;
  uniform vec3 uHorizon;
  uniform vec3 uMid;
  uniform vec3 uTop;
  uniform float uTime;

  void main() {
    // normalize height into 0..1 across the dome
    float h = clamp((normalize(vWorldPos).y * 0.5) + 0.5, 0.0, 1.0);

    // horizon -> mid -> top blend
    vec3 lower = mix(uHorizon, uMid, smoothstep(0.0, 0.5, h));
    vec3 col = mix(lower, uTop, smoothstep(0.45, 1.0, h));

    // gentle sun glow near horizon
    float glow = smoothstep(0.5, 0.0, h) * 0.25;
    col += vec3(1.0, 0.85, 0.6) * glow;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SkyDome() {
  const matRef = useRef();

  const material = useMemo(() => {
    return new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: {
        uHorizon: { value: new Color('#ffe3c2') },
        uMid: { value: new Color('#bfe3ff') },
        uTop: { value: new Color('#ffdcc4') },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });
  }, []);

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh scale={[1, 1, 1]} renderOrder={-1}>
      <sphereGeometry args={[500, 32, 32]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}
