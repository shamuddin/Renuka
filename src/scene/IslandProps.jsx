import { useGLTF } from '@react-three/drei';
import Prop from './Prop.jsx';
import { nearestSurfaceY } from './islandSurface.js';
import { asset } from '../lib/asset.js';

const P = asset('models/poly/props/');
const N = asset('models/poly/nature/');

// Per-chapter prop layouts. `lift` raises a prop above the ground surface
// (for things stacked on other props, or flying: planes, balloons, heart).
// Ground height is looked up per (x,z) via raycasting, so nothing floats.
const LAYOUTS = {
  proposal: [
    { url: P + 'arch.glb', x: 0, z: -0.6, h: 2.0 },
    { url: P + 'ring.glb', x: 0, z: 0.5, h: 0.4, lift: 0.35 },
    { url: P + 'rose.glb', x: 0.7, z: 0.3, h: 0.5, yaw: 0.5 },
  ],
  goa: [
    { url: N + 'palm1.glb', x: -0.9, z: -0.4, h: 2.6 },
    { url: P + 'boat.glb', x: 1.1, z: 0.6, h: 0.7, yaw: 0.8 },
    { url: P + 'umbrella.glb', x: 0.4, z: 0.7, h: 1.2, yaw: 0.3 },
    { url: P + 'sandcastle.glb', x: -0.5, z: 0.8, h: 0.5 },
  ],
  movie: [
    { url: P + 'tv.glb', x: 0, z: -0.7, h: 0.95, lift: 0.35 },
    { url: P + 'sofa.glb', x: 0, z: 0.6, h: 0.6, yaw: Math.PI },
    { url: P + 'popcorn.glb', x: 0.75, z: 0.4, h: 0.4 },
  ],
  food: [
    { url: P + 'foodtruck.glb', x: -0.6, z: -0.5, h: 1.5, yaw: 0.5 },
    { url: P + 'table.glb', x: 0.8, z: 0.6, h: 0.7 },
    { url: P + 'burger.glb', x: 0.8, z: 0.6, h: 0.25, lift: 0.72 },
    { url: P + 'icecream.glb', x: -0.2, z: 0.9, h: 0.5 },
  ],
  flight: [
    { url: P + 'airplane.glb', x: 0, z: 0, h: 1.2, yaw: 0.6, lift: 1.6 },
    { url: N + 'cloud.glb', x: -0.8, z: 0.6, h: 0.6, lift: 0.6 },
    { url: N + 'cloud.glb', x: 0.9, z: -0.4, h: 0.7, lift: 0.9 },
  ],
  dream: [
    { url: P + 'tower.glb', x: -0.8, z: -0.6, h: 2.2 },
    { url: P + 'airliner.glb', x: 0.6, z: 0.4, h: 1.3, yaw: 0.4, lift: 0.2 },
    { url: P + 'suitcase.glb', x: -0.2, z: 0.9, h: 0.5 },
  ],
  birthdays: [
    { url: P + 'cake.glb', x: 0, z: 0.2, h: 0.9 },
    { url: P + 'balloon.glb', x: -0.9, z: -0.3, h: 1.3, lift: 0.4 },
    { url: P + 'balloon.glb', x: 0.9, z: -0.2, h: 1.2, yaw: 1, lift: 0.5 },
    { url: P + 'gift.glb', x: 0.6, z: 0.7, h: 0.4 },
  ],
  themepark: [
    { url: P + 'ferriswheel.glb', x: -0.4, z: -0.6, h: 3.2 },
    { url: P + 'carousel.glb', x: 1.0, z: 0.7, h: 1.1 },
    { url: P + 'ticketbooth.glb', x: -0.9, z: 0.9, h: 0.9, yaw: 0.6 },
  ],
  hoteldate: [
    { url: P + 'hotel.glb', x: -0.3, z: -0.8, h: 2.4 },
    { url: P + 'table.glb', x: 0.7, z: 0.7, h: 0.7 },
    { url: P + 'wine.glb', x: 0.7, z: 0.7, h: 0.3, lift: 0.72 },
    { url: P + 'candle.glb', x: 0.5, z: 0.9, h: 0.4 },
  ],
  manifestation: [
    { url: P + 'well.glb', x: 0, z: 0.3, h: 1.1 },
    { url: P + 'lantern.glb', x: -0.8, z: -0.3, h: 0.5, lift: 0.8 },
    { url: P + 'lantern.glb', x: 0.8, z: -0.1, h: 0.5, lift: 1.1 },
    { url: N + 'crystal.glb', x: 0.6, z: 0.8, h: 0.6 },
  ],
  achievements: [
    { url: P + 'podium.glb', x: 0, z: 0.2, h: 0.8 },
    { url: P + 'trophy.glb', x: 0, z: 0.2, h: 0.5, lift: 0.82 },
    { url: P + 'medal.glb', x: 0.8, z: 0.6, h: 0.4 },
    { url: N + 'star.glb', x: -0.7, z: -0.2, h: 0.5, lift: 1.2 },
  ],
  everything: [
    { url: P + 'heart.glb', x: 0, z: 0, h: 1.6, lift: 1.3 },
    { url: P + 'hotairballoon.glb', x: -1.2, z: -0.6, h: 1.6, lift: 1.4 },
    { url: N + 'star.glb', x: 1.0, z: 0.4, h: 0.5, lift: 1.6 },
  ],
};

export default function IslandProps({ chapter, topY = 0.15 }) {
  const items = LAYOUTS[chapter.id] || [];
  return (
    <group>
      {items.map((it, i) => {
        const base = nearestSurfaceY(it.x, it.z, topY);
        return <Prop key={i} {...it} y={base + (it.lift || 0)} />;
      })}
    </group>
  );
}

// preload every prop referenced above
[...new Set(Object.values(LAYOUTS).flatMap((arr) => arr.map((i) => i.url)))].forEach((u) =>
  useGLTF.preload(u)
);
