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

server.listen(3699, async () => {
  console.log('Server started on 3699');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ channel: 'msedge', headless: true }));
    
    // 1. Mobile iPhone Capture
    const iPhone = devices['iPhone 14 Pro'];
    const mobileContext = await browser.newContext({ ...iPhone, locale: 'ar-SA' });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:3699/jadawel/', { waitUntil: 'load', timeout: 15000 });
    await mobilePage.waitForTimeout(2000);

    const waveRibbon = mobilePage.locator('section[aria-label="Red Sea Animated Ribbon"]');
    if (await waveRibbon.count() > 0) {
      await waveRibbon.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(1000);
      await mobilePage.screenshot({ path: 'scripts/mobile-wave-ribbon.png' });
      console.log('Captured mobile wave ribbon');
    }

    const vipSection = mobilePage.locator('section[aria-label="VIP Concierge Experience"]');
    if (await vipSection.count() > 0) {
      await vipSection.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(1000);
      await mobilePage.screenshot({ path: 'scripts/mobile-vip-card.png' });
      console.log('Captured mobile VIP card');
    }

    // 2. Desktop Capture
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://localhost:3699/jadawel/', { waitUntil: 'load', timeout: 15000 });
    await desktopPage.waitForTimeout(2000);

    const desktopVip = desktopPage.locator('section[aria-label="VIP Concierge Experience"]');
    if (await desktopVip.count() > 0) {
      await desktopVip.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(1000);
      await desktopPage.screenshot({ path: 'scripts/desktop-vip-card.png' });
      console.log('Captured desktop VIP card');
    }

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
