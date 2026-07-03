import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const scenarios = [
  { frac: 0.915, name: 'achievements' },
  { frac: 0.999, name: 'finale' },
];

for (const sc of scenarios) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 720 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForTimeout(3200);
  await page.evaluate((f) => {
    const h = document.body.scrollHeight - window.innerHeight;
    window.scrollTo(0, h * f);
  }, sc.frac);
  await page.waitForTimeout(2200);
  const btn = page.getByText(/Play ·/);
  const n = await btn.count();
  if (n) {
    await btn.first().click();
    await page.waitForTimeout(1600);
  }
  await page.screenshot({ path: `shots/g-${sc.name}.png` });
  console.log(`${sc.name}: playBtn=${n} errors=${errs.length ? errs.join('|') : 'none'}`);
  await page.close();
}

await browser.close();
process.exit(0);
