import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide, ShaderMaterial } from 'three';

// A vast, gently rolling pastel sea far below the floating islands.
// Built entirely with a shader (there is no "water model" to download):
//   - vertex shader displaces the surface with layered sine waves
//   - fragment shader blends deep/shallow blues, adds sun sparkle,
//     and fades into the sky fog at the horizon so there's no hard edge.
const vertexShader = /* glsl */ `
  uniform float uTime;
  varying float vWave;
  varying float vDist;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    float w =
      sin(p.x * 0.12 + uTime * 0.9) * 0.7 +
      cos(p.y * 0.18 + uTime * 0.7) * 0.5 +
      sin((p.x + p.y) * 0.08 + uTime * 1.25) * 0.35;
    p.z += w;
    vWave = w;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTime;
  varying float vWave;
  varying float vDist;
  varying vec2 vUv;

  void main() {
    float t = smoothstep(-1.2, 1.2, vWave);
    vec3 col = mix(uDeep, uShallow, t);

    // crest highlights
    col += smoothstep(0.6, 1.1, vWave) * 0.18;

    // drifting sun sparkle
    float s = sin(vUv.x * 420.0 + uTime * 1.6) * sin(vUv.y * 420.0 + uTime * 1.1);
    col += pow(max(s, 0.0), 22.0) * 0.35 * vec3(1.0, 0.98, 0.9);

    // fade into the sky at the horizon
    float fog = smoothstep(uFogNear, uFogFar, vDist);
    col = mix(col, uFogColor, fog);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Water({ position = [0, -18, 0], size = 320 }) {
  const matRef = useRef();

  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uDeep: { value: new Color('#5aa9e0') },
          uShallow: { value: new Color('#c4ecff') },
          uFogColor: { value: new Color('#dbeeff') },
          uFogNear: { value: 60 },
          uFogFar: { value: 260 },
        },
        vertexShader,
        fragmentShader,
      }),
    []
  );

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 140, 140]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}
