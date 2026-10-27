import { chromium } from 'playwright';

async function checkLiveDOM() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle' });

  // 1. Check Header
  const headerHTML = await page.locator('header').innerHTML();
  console.log('Header weather badge in DOM?', headerHTML.includes('data-weather-badge') || headerHTML.includes('°C'));

  // 2. Click on "استكشف جدة" in desktop navbar
  const exploreNav = page.locator('header button:has-text("استكشف"), header a:has-text("استكشف")').first();
  console.log('Explore nav exists?', await exploreNav.count());
  if (await exploreNav.count() > 0) {
    await exploreNav.click();
    await page.waitForTimeout(2000);
  }

  // 3. Inspect what is in main
  const mainText = await page.locator('main').innerText();
  console.log('Main text preview:\n', mainText.slice(0, 500));

  // 4. Count all venue cards in explore directory
  const cards = await page.locator('[data-place-card], .group').all();
  console.log('Candidate card count:', cards.length);

  // 5. Check if ALBAIK, Khayal, teamLab exist in page text
  console.log('Contains ALBAIK:', mainText.includes('البيك') || mainText.includes('ALBAIK'));
  console.log('Contains teamLab:', mainText.includes('تيم لاب') || mainText.includes('teamLab'));
  console.log('Contains Khayal:', mainText.includes('خيال') || mainText.includes('Khayal'));

  await browser.close();
}

checkLiveDOM().catch(console.error);
