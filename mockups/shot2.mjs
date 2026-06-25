import pkg from '/opt/echoling/node_modules/playwright/index.js';
const { chromium } = pkg;
const pages = ['j1-terra','j2-forest','j3-ocean','j4-plum'];
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser' });
const ctx = await browser.newContext({ viewport:{width:440,height:860}, deviceScaleFactor:2 });
for (const n of pages){
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8123/'+n+'.html',{waitUntil:'networkidle'});
  await p.waitForTimeout(700);
  await p.screenshot({path:'/opt/tripmate/mockups/'+n+'.png'});
  await p.close(); console.log('shot',n);
}
await browser.close();
