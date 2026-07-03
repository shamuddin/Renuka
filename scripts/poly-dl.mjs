// Downloads models from poly.pizza by slug, capturing license + author.
// Usage: node scripts/poly-dl.mjs <outdir> slug:name slug:name ...
//   e.g. node scripts/poly-dl.mjs public/models/poly ficLBIjGliK:palm
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

const outdir = process.argv[2];
const pairs = process.argv.slice(3);
mkdirSync(outdir, { recursive: true });

const manifestPath = `${outdir}/manifest.json`;
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : {};

const UA = { 'User-Agent': 'Mozilla/5.0' };

async function one(slug, name) {
  const page = await fetch(`https://poly.pizza/m/${slug}`, { headers: UA });
  if (!page.ok) return console.log(`FAIL ${name}: page ${page.status}`);
  const html = await page.text();

  const uuid = html.match(/static\.poly\.pizza\/([0-9a-f-]{36})\.glb/)?.[1];
  if (!uuid) return console.log(`FAIL ${name}: no glb uuid found`);

  const author = html.match(/\/u\/([^"'/]+)/)?.[1] || 'unknown';
  const license =
    /Public Domain|CC0/i.test(html) ? 'CC0'
    : /Attribution|CC-?BY/i.test(html) ? 'CC-BY'
    : 'UNKNOWN';

  if (license === 'UNKNOWN') return console.log(`SKIP ${name}: unknown license`);

  const glb = await fetch(`https://static.poly.pizza/${uuid}.glb`, { headers: UA });
  if (!glb.ok) return console.log(`FAIL ${name}: glb ${glb.status}`);
  const buf = Buffer.from(await glb.arrayBuffer());
  const file = `${outdir}/${name}.glb`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buf);

  manifest[name] = { slug, uuid, author, license, kb: Math.round(buf.length / 1024) };
  console.log(`OK   ${name}.glb  ${Math.round(buf.length / 1024)}KB  [${license} · ${author}]`);
}

for (const p of pairs) {
  const idx = p.indexOf(':');
  const slug = p.slice(0, idx);
  const name = p.slice(idx + 1);
  try { await one(slug, name); } catch (e) { console.log(`ERR ${name}: ${e.message}`); }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nmanifest -> ${manifestPath}`);
