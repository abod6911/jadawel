import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[PAGE ERROR] ${err.message}`));

  console.log('Navigating to https://abod6911.github.io/jadawel/ ...');
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle', timeout: 30000 });

  await page.screenshot({ path: 'scripts/live-screen-home.png' });
  console.log('Saved home screenshot to scripts/live-screen-home.png');

  // Check header text
  const headerText = await page.evaluate(() => {
    const el = document.querySelector('header');
    return el ? el.innerText : 'Header not found';
  });
  console.log('Header text preview:\n', headerText);

  // Click on "استكشف" tab
  console.log('Clicking on Explore tab...');
  const exploreTabBtn = await page.locator('button:has-text("استكشف"), a:has-text("استكشف"), div:has-text("استكشف")').first();
  if (await exploreTabBtn.count() > 0) {
    await exploreTabBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'scripts/live-screen-explore.png' });
    console.log('Saved explore screenshot to scripts/live-screen-explore.png');

    // Count place cards
    const cardTitles = await page.locator('h3').allInnerTexts();
    console.log('H3 cards in Explore:', cardTitles.length, cardTitles.slice(0, 10));
    
    // Check branch badges
    const branchBadges = await page.locator('text=/فروع/').allInnerTexts();
    console.log('Branch badges found:', branchBadges);
  } else {
    console.log('Explore tab button not found!');
  }

  console.log('\n--- BROWSER CONSOLE LOGS ---');
  consoleLogs.forEach(l => console.log(l));

  await browser.close();
}

diagnose().catch(console.error);
