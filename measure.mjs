import fs from 'node:fs'; import http from 'node:http'; import path from 'node:path'; import { chromium } from 'playwright';

const root = path.resolve('dist');
const server = http.createServer((req, res) => { let f = path.join(root, new URL(req.url,'http://x').pathname); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f,'index.html'); if(!fs.existsSync(f)){res.writeHead(404);res.end();return;} res.writeHead(200,{'content-type': f.endsWith('.css')?'text/css':f.endsWith('.woff2')?'font/woff2':'text/html'}); fs.createReadStream(f).pipe(res); });
await new Promise(r=>server.listen(0,r)); const base=`http://localhost:${server.address().port}`;
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1440,height:900}});
await p.goto(base+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
const r = await p.evaluate(() => { const out={}; for (const st of [100,110,118]) { const s=document.createElement('span'); s.className='display'; s.style.cssText=`font-size:100px;font-stretch:${st}%;position:absolute;white-space:nowrap`; s.textContent='Wagnerstark.'; document.body.appendChild(s); out[st]=s.getBoundingClientRect().width/100; s.remove(); } return out; });
console.log(r); await b.close(); server.close();
