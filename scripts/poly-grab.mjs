// Search + auto-pick + download from poly.pizza in one pass.
// Usage: node scripts/poly-grab.mjs <outdir> "term=name" "term=name" ...
// Picks: Quaternius CC0 > any CC0 > any CC-BY. Skips unknown licenses.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

const outdir = process.argv[2];
const jobs = process.argv.slice(3);
mkdirSync(outdir, { recursive: true });
const manifestPath = `${outdir}/manifest.json`;
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const UA = { 'User-Agent': 'Mozilla/5.0' };

async function meta(slug) {
  const p = await fetch(`https://poly.pizza/m/${slug}`, { headers: UA });
  if (!p.ok) return null;
  const h = await p.text();
  const uuid = h.match(/static\.poly\.pizza\/([0-9a-f-]{36})\.glb/)?.[1];
  if (!uuid) return null;
  const author = h.match(/\/u\/([^"'/]+)/)?.[1] || 'unknown';
  const license = /Public Domain|CC0/i.test(h) ? 'CC0' : /Attribution|CC-?BY/i.test(h) ? 'CC-BY' : 'UNKNOWN';
  return { slug, uuid, author, license };
}

async function grab(term, name) {
  const s = await fetch(`https://poly.pizza/search/${encodeURIComponent(term)}`, { headers: UA });
  const html = await s.text();
  const slugs = [...new Set([...html.matchAll(/\/m\/([A-Za-z0-9_-]+)/g)].map((m) => m[1]))].slice(0, 6);
  if (!slugs.length) return console.log(`MISS ${name}: no results for "${term}"`);

  let best = null;
  for (const slug of slugs) {
    const m = await meta(slug);
    if (!m || m.license === 'UNKNOWN') continue;
    if (m.license === 'CC0' && /quaternius/i.test(m.author)) { best = m; break; }
    if (!best) best = m;
    else if (best.license === 'CC-BY' && m.license === 'CC0') best = m;
  }
  if (!best) return console.log(`MISS ${name}: no usable license for "${term}"`);

  const glb = await fetch(`https://static.poly.pizza/${best.uuid}.glb`, { headers: UA });
  if (!glb.ok) return console.log(`FAIL ${name}: glb ${glb.status}`);
  const buf = Buffer.from(await glb.arrayBuffer());
  writeFileSync(`${outdir}/${name}.glb`, buf);
  manifest[name] = { term, ...best, kb: Math.round(buf.length / 1024) };
  console.log(`OK   ${name}.glb  ${String(Math.round(buf.length / 1024)).padStart(5)}KB  [${best.license} · ${best.author}]  <${term}>`);
}

for (const j of jobs) {
  const i = j.indexOf('=');
  const term = j.slice(0, i);
  const name = j.slice(i + 1);
  try { await grab(term, name); } catch (e) { console.log(`ERR ${name}: ${e.message}`); }
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nmanifest -> ${manifestPath}`);
