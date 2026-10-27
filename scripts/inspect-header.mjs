import { chromium } from 'playwright';

async function inspectHeader() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const headerHTML = await page.locator('header').innerHTML();
  console.log('--- HEADER INNER HTML ---');
  console.log(headerHTML);

  await browser.close();
}

inspectHeader().catch(console.error);
