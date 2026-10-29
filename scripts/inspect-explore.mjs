import { chromium } from 'playwright';

async function inspectExplorePage() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log('Navigating to live site...');
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle' });

  // Click on Explore in header
  const exploreBtn = page.locator('header button:has-text("استكشف"), header a:has-text("استكشف")').first();
  await exploreBtn.click();
  await page.waitForTimeout(2000);

  // Take screenshot of explore page
  await page.screenshot({ path: 'scripts/live-explore-desktop.png', fullPage: false });
  console.log('Saved explore screenshot');

  // Find ALBAIK card
  const albaikCard = page.locator('h3:has-text("البيك"), h3:has-text("ALBAIK")').first();
  console.log('ALBAIK card found?', await albaikCard.count());

  if (await albaikCard.count() > 0) {
    // Click ALBAIK card to open modal
    await albaikCard.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/live-albaik-modal.png' });
    console.log('Saved ALBAIK modal screenshot');

    // Get text of modal
    const modalText = await page.locator('[role="dialog"]').innerText();
    console.log('Modal text preview:\n', modalText.slice(0, 400));
  }

  await browser.close();
}

inspectExplorePage().catch(console.error);
