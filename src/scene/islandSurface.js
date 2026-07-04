import { Group, Raycaster, Vector3 } from 'three';

// Places decorations ON the real island mesh instead of at a guessed height.
// We build one transformed copy of the normalized island and raycast straight
// down onto it to find the true surface height at any (x, z). Cached, because
// all 12 islands share the same model + normalization.

let holder = null;
let cachedPool = null;
const ray = new Raycaster();
const DOWN = new Vector3(0, -1, 0);

export function initSurface(scene, norm) {
  if (holder) return;
  holder = new Group();
  const clone = scene.clone(true);
  holder.scale.setScalar(norm.scale);
  holder.position.set(norm.pos[0], norm.pos[1], norm.pos[2]);
  holder.add(clone);
  holder.updateMatrixWorld(true);
}

// True surface height at (x, z), or null if the ray misses entirely (off the
// island edge). No height threshold — the first hit from above IS the top.
export function surfaceYAt(x, z) {
  if (!holder) return null;
  ray.set(new Vector3(x, 60, z), DOWN);
  const hits = ray.intersectObject(holder, true);
  return hits.length ? hits[0].point.y : null;
}

// Height of the nearest verified surface point to (x, z). Robust for props at
// fixed positions, since raycasting an exact point often misses on this
// irregular mesh, whereas the pool holds 140 known-good surface samples.
export function nearestSurfaceY(x, z, fallback = 0) {
  if (!cachedPool || !cachedPool.length) return fallback;
  let best = null;
  let bd = Infinity;
  for (const p of cachedPool) {
    const d = (p[0] - x) * (p[0] - x) + (p[2] - z) * (p[2] - z);
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best ? best[1] : fallback;
}

// A pool of points on the island's DOMINANT flat top. We raycast many samples,
// find the most common height (the plateau) via a histogram, keep only samples
// near it, and snap them to that single height. This guarantees trees/props
// sit on the main surface — never on a stray high tip or a low sloped edge
// (which was causing the "floating trees" on some islands).
export function surfacePool(maxR, topY, count = 200) {
  if (cachedPool) return cachedPool;

  const raw = [];
  for (let i = 0; i < count * 12 && raw.length < count * 2; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * maxR;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = surfaceYAt(x, z);
    if (y != null) raw.push([x, y, z]);
  }
  if (!raw.length) {
    cachedPool = [[0, topY, 0]];
    return cachedPool;
  }

  // histogram of heights (0.25 buckets) → dominant plateau height
  const bin = 0.25;
  const counts = new Map();
  for (const p of raw) {
    const b = Math.round(p[1] / bin);
    counts.set(b, (counts.get(b) || 0) + 1);
  }
  let bestBin = 0;
  let bestC = -1;
  for (const [b, c] of counts) {
    if (c > bestC) {
      bestC = c;
      bestBin = b;
    }
  }
  const plateauY = bestBin * bin;

  // keep points near the plateau and snap them to that flat height
  const band = 0.45;
  const pts = raw
    .filter((p) => Math.abs(p[1] - plateauY) <= band)
    .map((p) => [p[0], plateauY, p[2]]);

  cachedPool = pts.length ? pts : raw.map((p) => [p[0], plateauY, p[2]]);
  return cachedPool;
}
