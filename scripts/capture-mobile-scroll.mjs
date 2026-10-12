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

server.listen(3599, async () => {
  console.log('Server started on 3599');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ channel: 'msedge', headless: true }));
    const iPhone = devices['iPhone 14 Pro'];
    const context = await browser.newContext({ ...iPhone, locale: 'ar-SA' });
    const page = await context.newPage();

    await page.goto('http://localhost:3599/jadawel/', { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 1. Initial Hero view
    await page.screenshot({ path: 'scripts/mobile-scroll-0.png' });
    console.log('Captured scroll 0 (top)');

    // 2. Scroll 450px
    await page.evaluate(() => window.scrollBy(0, 450));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/mobile-scroll-1.png' });
    console.log('Captured scroll 1 (ribbon & cards)');

    // 3. Scroll 900px
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/mobile-scroll-2.png' });
    console.log('Captured scroll 2');

    // 4. Scroll 700px more (Studio & Bento)
    await page.evaluate(() => window.scrollBy(0, 700));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/mobile-scroll-3.png' });
    console.log('Captured scroll 3');

    // 5. Scroll 800px more (Curated Plans)
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/mobile-scroll-4.png' });
    console.log('Captured scroll 4 (Curated)');

    // 6. Scroll 900px more (VipPathCard & Deals)
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/mobile-scroll-5.png' });
    console.log('Captured scroll 5 (VIP card)');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
