import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium, devices } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '..', 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl.startsWith('/jadawel')) reqUrl = reqUrl.slice('/jadawel'.length);
  if (reqUrl === '' || reqUrl === '/') reqUrl = '/index.html';

  let filePath = path.join(outDir, reqUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(outDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
});

server.listen(3499, async () => {
  console.log('Server started on 3499');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ channel: 'msedge', headless: true }));
    const iPhone = devices['iPhone 14 Pro'];
    const context = await browser.newContext({ ...iPhone, locale: 'ar-SA' });
    const page = await context.newPage();

    await page.goto('http://localhost:3499/jadawel/', { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 1. Home top
    await page.screenshot({ path: 'scripts/tab-1-home.png' });
    console.log('Captured tab 1 home');

    // 2. Click Explore Tab (2nd button in bottom dock)
    const navButtons = page.locator('nav.glass-dock button');
    await navButtons.nth(1).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/tab-2-explore.png' });
    console.log('Captured tab 2 explore');

    // 3. Click Center Plan Button (3rd button in bottom dock)
    await navButtons.nth(2).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/tab-3-wizard.png' });
    console.log('Captured tab 3 wizard');

    // 4. Click Cancel to return to main tabs
    await page.locator('button:has-text("إلغاء")').click();
    await page.waitForTimeout(600);

    // 5. Click Curated Tab (4th button in bottom dock)
    const dockButtons = page.locator('nav.glass-dock button');
    await dockButtons.nth(3).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/tab-4-curated.png' });
    console.log('Captured tab 4 curated');

    // 6. Click Timeline / Route Tab (5th button in bottom dock)
    await dockButtons.nth(4).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/tab-5-timeline.png' });
    console.log('Captured tab 5 timeline');

    console.log('All tabs captured!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
