import pkg from '/opt/echoling/node_modules/playwright/index.js';
const { chromium } = pkg;

const pages = [
  ['a-sky-travel', 'a-sky-travel.html'],
  ['b-bold-rose', 'b-bold-rose.html'],
  ['c-night-finance', 'c-night-finance.html'],
  ['d-soft-clay', 'd-soft-clay.html'],
  ['e-glass-aurora', 'e-glass-aurora.html'],
  ['f-neo-brutal', 'f-neo-brutal.html'],
];

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser' });
const ctx = await browser.newContext({
  viewport: { width: 440, height: 860 },
  deviceScaleFactor: 2,
});
for (const [name, file] of pages) {
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:8123/' + file, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800); // let webfonts settle
  await page.screenshot({ path: '/opt/tripmate/mockups/' + name + '.png' });
  await page.close();
  console.log('shot', name);
}
await browser.close();
