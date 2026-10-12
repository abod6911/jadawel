import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium, devices } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '..', 'out');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Simple zero-dependency HTTP server for the out directory under /jadawel
const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl.startsWith('/jadawel')) {
    reqUrl = reqUrl.slice('/jadawel'.length);
  }
  if (reqUrl === '' || reqUrl === '/') {
    reqUrl = '/index.html';
  }

  let filePath = path.join(outDir, reqUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // 404 fallback to index.html for SPA if not found
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

server.listen(3456, async () => {
  console.log('Static server started at http://localhost:3456/jadawel/');

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ channel: 'msedge', headless: true }));
    const iPhone = devices['iPhone 14 Pro'];
    const context = await browser.newContext({
      ...iPhone,
      locale: 'ar-SA',
    });
    const page = await context.newPage();

    console.log('Navigating to local mobile build...');
    await page.goto('http://localhost:3456/jadawel/', { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(1500);

    const overflows = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 3 || rect.left < -3) {
          // exclude overflow-x-auto containers children
          if (el.closest('.overflow-x-auto') && el !== el.closest('.overflow-x-auto')) return;
          bad.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            docWidth,
          });
        }
      });
      return bad;
    });
    console.log('Detected overflow elements:', JSON.stringify(overflows, null, 2));

    // 1. Mobile Hero view
    await page.screenshot({ path: 'scripts/new-mobile-1-hero.png' });
    console.log('Captured new mobile 1 hero');

    // 2. Scroll to Cockpit
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/new-mobile-2-cockpit.png' });
    console.log('Captured new mobile 2 cockpit');

    // 3. Scroll to Map
    await page.evaluate(() => window.scrollBy(0, 700));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/new-mobile-3-map.png' });
    console.log('Captured new mobile 3 map');

    // 4. Scroll to Bento
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/new-mobile-4-bento.png' });
    console.log('Captured new mobile 4 bento');

    // 5. Scroll to Curated & Footer
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/new-mobile-5-curated.png' });
    console.log('Captured new mobile 5 curated');

  } catch (err) {
    console.error('Error during mobile diagnosis:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
    console.log('Server closed. Verification done.');
  }
});
