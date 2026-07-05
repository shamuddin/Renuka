import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 780 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));

await page.goto('http://localhost:4173/anniversary/', { waitUntil: 'load' });
await page.waitForTimeout(3200);
await page.evaluate(() => {
  const h = document.body.scrollHeight - window.innerHeight;
  window.scrollTo(0, h * 0.324); // food island
});
await page.waitForTimeout(2200);
const btn = page.getByText(/Play ·/);
console.log('playBtn=', await btn.count());
await btn.first().click();
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/feed-open.png' });

// find the canvas and drag from the fork (bottom-left) toward the mouth (right)
const box = await page.locator('canvas').last().boundingBox();
if (box) {
  const forkX = box.x + 90;
  const forkY = box.y + box.height - 90;
  // aim up-right toward the mouth
  await page.mouse.move(forkX, forkY);
  await page.mouse.down();
  await page.mouse.move(forkX + 240, forkY - 120, { steps: 10 });
  await page.screenshot({ path: 'shots/feed-aim.png' }); // shows the arc preview
  await page.mouse.up();
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/feed-throw.png' }); // food in flight
}
console.log('errors:', errs.length ? errs.join('|') : 'none');
await browser.close();
process.exit(0);
