import { chromium, devices } from 'playwright';

async function diagnoseMobile() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ channel: 'msedge', headless: true }));
  const iPhone = devices['iPhone 14 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'ar-SA',
  });
  const page = await context.newPage();

  console.log('Navigating to live site on mobile...');
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'load', timeout: 25000 });
  await page.waitForTimeout(2500);

  // 1. Mobile Hero view
  await page.screenshot({ path: 'scripts/mobile-1-hero.png' });
  console.log('Captured mobile hero');

  // 2. Scroll to Cockpit
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/mobile-2-cockpit.png' });
  console.log('Captured mobile cockpit');

  // 3. Scroll to Studio & Route map
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/mobile-3-studio.png' });
  console.log('Captured mobile studio');

  // 4. Scroll to Bento & Plans
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/mobile-4-bento.png' });
  console.log('Captured mobile bento');

  // 5. Scroll to bottom / footer
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/mobile-5-footer.png' });
  console.log('Captured mobile footer');

  await browser.close();
}

diagnoseMobile().catch(console.error);
