// Analyzes a screenshot PNG so we can "verify visuals" programmatically:
//  - is it non-blank / how much variation
//  - average color of sky / mid / water zones
//  - detect pink flamingo pixels and report their bounding region
// Usage: node scripts/analyze.mjs shots/phase1.png
import { readFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const file = process.argv[2] || 'shots/phase1.png';
const png = PNG.sync.read(readFileSync(file));
const { width: W, height: H, data } = png;

const at = (x, y) => {
  x = Math.floor(x); y = Math.floor(y);
  const i = (y * W + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};
const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function zoneAvg(x0, y0, x1, y1) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y < y1; y += 3)
    for (let x = x0; x < x1; x += 3) {
      const [rr, gg, bb] = at(x, y);
      r += rr; g += gg; b += bb; n++;
    }
  return [r / n, g / n, b / n];
}

// unique-ish colors to confirm it isn't a flat blank frame
const seen = new Set();
for (let y = 0; y < H; y += 7)
  for (let x = 0; x < W; x += 7) {
    const [r, g, b] = at(x, y);
    seen.add((r >> 4) + ',' + (g >> 4) + ',' + (b >> 4));
  }

// detect "flamingo pink": strong red, low-ish green/blue, not the pale sky
let px = 0, minX = W, maxX = 0, minY = H, maxY = 0;
for (let y = 0; y < H; y += 2)
  for (let x = 0; x < W; x += 2) {
    const [r, g, b] = at(x, y);
    if (r > 200 && g > 80 && g < 175 && b > 90 && b < 180 && r - g > 55 && r - b > 45) {
      px++;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }

console.log(`image: ${W}x${H}`);
console.log(`distinct color buckets: ${seen.size}  ${seen.size > 60 ? '(rich scene ✓)' : '(looks flat/blank ✗)'}`);
console.log(`sky    (top center):    ${hex(zoneAvg(W * 0.3, 0, W * 0.7, H * 0.22))}`);
console.log(`upper  (island level):  ${hex(zoneAvg(W * 0.35, H * 0.28, W * 0.65, H * 0.5))}`);
console.log(`center (island):        ${hex(zoneAvg(W * 0.4, H * 0.42, W * 0.6, H * 0.62))}`);
console.log(`bottom (water):         ${hex(zoneAvg(W * 0.25, H * 0.8, W * 0.75, H))}`);
console.log(`flamingo-pink pixels:   ${px}` + (px > 20 ? ` at ~[${minX}-${maxX}, ${minY}-${maxY}] ✓` : ' (not clearly found)'));

// ---- silhouette profile ----
// "island" pixel = warm (r>b) or clearly green; sky/water are blue-dominant.
const isIsland = (r, g, b) => (r > b + 10) || (g > r + 10 && g > b + 10);
const rowWidth = [];
for (let y = 0; y < H; y++) {
  let lo = -1, hi = -1;
  for (let x = 0; x < W; x++) {
    const [r, g, b] = at(x, y);
    if (isIsland(r, g, b)) { if (lo < 0) lo = x; hi = x; }
  }
  rowWidth[y] = hi < 0 ? 0 : hi - lo;
}
// split rows into contiguous vertical segments (island vs stray flamingo),
// then keep the tallest segment = the island body.
const segs = [];
let cur = null;
for (let y = 0; y < H; y++) {
  if (rowWidth[y] > 40) {
    if (!cur) cur = { start: y, end: y };
    else cur.end = y;
  } else if (cur) { segs.push(cur); cur = null; }
}
if (cur) segs.push(cur);
segs.sort((a, b) => (b.end - b.start) - (a.end - a.start));
const body = segs[0];
if (body && body.end - body.start > 8) {
  const top = body.start, bot = body.end;
  console.log(`\nsilhouette rows ${top}..${bot} (width in px, top→bottom):`);
  const N = 10;
  let widest = { w: 0, y: 0 };
  const line = [];
  for (let i = 0; i <= N; i++) {
    const y = Math.round(top + ((bot - top) * i) / N);
    const w = rowWidth[y];
    if (w > widest.w) widest = { w, y };
    line.push(String(w).padStart(4));
  }
  console.log('  ' + line.join(' '));
  const widestFrac = (widest.y - top) / (bot - top);
  // mushroom = widest band near very top with a narrow neck right below
  const neckY = Math.round(top + (bot - top) * 0.35);
  const neckRatio = rowWidth[neckY] / widest.w;
  console.log(`  widest=${widest.w}px at ${(widestFrac * 100).toFixed(0)}% down; neck@35%=${(neckRatio * 100).toFixed(0)}% of widest`);
  console.log(
    neckRatio < 0.55 && widestFrac < 0.35
      ? '  ⚠ looks MUSHROOM-like (wide top, pinched neck)'
      : '  ✓ tapers like an island'
  );
}
