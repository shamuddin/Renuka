// Loads the running dev server and screenshots the WebGL canvas.
// Usage: node scripts/shot.mjs [url] [outfile] [scrollFraction]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:5173/';
const out = process.argv[3] || 'shots/phase1.png';
const scrollFrac = parseFloat(process.argv[4] || '0');

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
  ],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
const logs = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
  else if (m.text().includes('[SURFACE]') || m.text().includes('[DBG]')) logs.push(m.text());
});
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto(url, { waitUntil: 'load', timeout: 30000 });

// let the loading screen fade and the scene settle / animate
await page.waitForTimeout(3500);

if (scrollFrac > 0) {
  await page.evaluate((f) => {
    const h = document.body.scrollHeight - window.innerHeight;
    window.scrollTo(0, h * f);
  }, scrollFrac);
  await page.waitForTimeout(2500);
}

await page.screenshot({ path: out });
console.log('saved', out);
logs.forEach((l) => console.log(l));
if (errors.length) {
  console.log('--- console/page errors ---');
  errors.slice(0, 20).forEach((e) => console.log(e));
} else {
  console.log('no console errors');
}

await browser.close();
