// Searches poly.pizza and prints candidate models (slug, title, author,
// license) so we can choose. Usage: node scripts/poly-search.mjs "palm tree" [n]
const term = process.argv[2];
const n = parseInt(process.argv[3] || '6', 10);
const UA = { 'User-Agent': 'Mozilla/5.0' };

const res = await fetch(`https://poly.pizza/search/${encodeURIComponent(term)}`, { headers: UA });
const html = await res.text();
const slugs = [...new Set([...html.matchAll(/\/m\/([A-Za-z0-9_-]+)/g)].map((m) => m[1]))].slice(0, n);

console.log(`# "${term}" -> ${slugs.length} candidates`);
for (const slug of slugs) {
  try {
    const p = await fetch(`https://poly.pizza/m/${slug}`, { headers: UA });
    const h = await p.text();
    const title = (h.match(/<title>([^<]+)<\/title>/)?.[1] || '').split(/[-|]/)[0].trim();
    const author = h.match(/\/u\/([^"'/]+)/)?.[1] || '?';
    const license = /Public Domain|CC0/i.test(h) ? 'CC0' : /Attribution|CC-?BY/i.test(h) ? 'CC-BY' : '?';
    const hasGlb = /static\.poly\.pizza\/[0-9a-f-]{36}\.glb/.test(h);
    console.log(`  ${slug}\t${license}\t${author}\t${title}${hasGlb ? '' : '  (no glb)'}`);
  } catch (e) {
    console.log(`  ${slug}\tERR ${e.message}`);
  }
}
