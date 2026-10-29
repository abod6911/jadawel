import { chromium } from 'playwright';

async function checkModalText() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle' });

  // Click Explore
  await page.locator('header button:has-text("استكشف"), header a:has-text("استكشف")').first().click();
  await page.waitForTimeout(1500);

  // Click on ALBAIK
  await page.locator('h3:has-text("البيك")').first().click();
  await page.waitForTimeout(1000);

  // Find all text inside the fixed z-50 container
  const modalContainer = page.locator('div.fixed.z-50');
  console.log('Modal visible?', await modalContainer.isVisible());
  const text = await modalContainer.innerText();
  console.log('--- MODAL TEXT ---');
  console.log(text);

  await browser.close();
}

checkModalText().catch(console.error);
