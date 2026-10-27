import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
    const args = msg.args();
    for (const a of args) {
      a.jsonValue().then(v => {
        if (typeof v === 'object' && v !== null) console.log('  ->', JSON.stringify(v, null, 2));
      }).catch(() => {});
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR]: ${err.message}\n${err.stack}`);
  });

  console.log('Navigating to https://abod6911.github.io/jadawel/ ...');
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  await browser.close();
}

diagnose().catch(console.error);
