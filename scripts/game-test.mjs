import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForTimeout(3500);

await page.evaluate(() => {
  const h = document.body.scrollHeight - window.innerHeight;
  window.scrollTo(0, h * 0.577); // birthday island centred (after intro lead)
});
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shots/game-1-prompt.png' });

const btn = page.getByText(/Play ·/);
console.log('play buttons found:', await btn.count());
await btn.first().click();
await page.waitForTimeout(1000);
await page.screenshot({ path: 'shots/game-2-open.png' });

// press & hold to blow (over the canvas area, centre of modal)
await page.mouse.move(640, 380);
await page.mouse.down();
await page.waitForTimeout(1000);
await page.screenshot({ path: 'shots/game-3-blowing.png' });
await page.waitForTimeout(1400); // flames out ~1.7s -> confetti
await page.screenshot({ path: 'shots/game-4-confetti.png' });
await page.mouse.up();
await page.waitForTimeout(1500); // reward
await page.screenshot({ path: 'shots/game-5-reward.png' });

console.log(errors.length ? errors.join('\n') : 'no page errors');
await browser.close();
process.exit(0);
