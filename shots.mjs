// Temporary screenshot helper (not part of the site).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('dist');
const out = process.argv[2];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(root, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
  if (!fs.existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));

const base = `http://localhost:${server.address().port}`;
console.log('serving', base);
const browser = await chromium.launch();
const external = new Set();
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('request', (r) => { if (!r.url().startsWith(base)) external.add(r.url()); });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // trigger reveals
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForTimeout(900);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const h1 = await page.evaluate(() => { const l = [...document.querySelectorAll('.hero-line')]; return l.map((e) => `${e.firstElementChild.getBoundingClientRect().width.toFixed(0)}/${e.getBoundingClientRect().width.toFixed(0)}`); });
  const wide = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => !e.closest('.marquee') && e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 8).map((e) => `${e.tagName}.${e.className.toString().slice(0, 40)} r=${e.getBoundingClientRect().right.toFixed(0)}`));
  console.log(name, { overflow, h1, errors, wide });
  await page.screenshot({ path: path.join(out, `elektro-wagner-${name}.png`), fullPage: true });
  if (name === 'mobile') {
    for (const p of ['impressum', 'datenschutz']) {
      await page.goto(`${base}/${p}`, { waitUntil: 'networkidle' });
      console.log(p, await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth));
    }
    // form demo
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.fill('#f-name', 'Max Muster');
    await page.fill('#f-phone', '0551 123');
    await page.fill('#f-email', 'max@example.de');
    await page.fill('#f-message', 'Steckdose defekt');
    await page.click('button[type=submit]');
    await page.waitForTimeout(300);
    console.log('success visible', await page.isVisible('#form-success'), await page.getAttribute('#mailto-fallback', 'href'));
    await page.screenshot({ path: path.join(out, `elektro-wagner-form.png`), fullPage: false });
  }
  await ctx.close();
}
console.log('external', [...external]);
await browser.close();
server.close();
