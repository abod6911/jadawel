import { chromium } from 'playwright';

async function verifyLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile
  });
  const page = await context.newPage();

  console.log('Visiting live URL on mobile...');
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. Check if weather badge is visible on mobile
  const weatherText = await page.evaluate(() => {
    const el = document.querySelector('header');
    return el ? el.innerText : '';
  });
  console.log('Mobile Header Text:\n', weatherText);

  // 2. Check if Trending Places Showcase is rendered on mobile home
  const h2OrH3 = await page.locator('h2, h3').allInnerTexts();
  console.log('Mobile Home Headings:', h2OrH3.slice(0, 10));

  // 3. Check for branch badges
  const branchBadges = await page.locator('text=/فروع/').allInnerTexts();
  console.log('Mobile Branch Badges:', branchBadges);

  await page.screenshot({ path: 'scripts/mobile-live-verified.png' });
  console.log('Saved screenshot to scripts/mobile-live-verified.png');

  await browser.close();
}

verifyLive().catch(console.error);
