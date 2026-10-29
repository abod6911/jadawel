import { chromium } from 'playwright';

async function verifyHomeIsClean() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('https://abod6911.github.io/jadawel/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const mainText = await page.locator('main').innerText();
  console.log('Trending showcase present in Home?', mainText.includes('أحدث المطاعم والوجهات الأكثر طلباً وترند'));
  console.log('Home text length:', mainText.length);

  await browser.close();
}

verifyHomeIsClean().catch(console.error);
