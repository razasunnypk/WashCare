import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (['node_modules','.git'].includes(name)) continue;
    const p = path.join(dir,name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else if (p.endsWith('.js') || p.endsWith('.mjs')) files.push(p);
  }
}
walk(root);
for (const file of files) execFileSync(process.execPath, ['--check', file], {stdio:'inherit'});

const required = [
  'index.html','manifest.webmanifest','sw.js','README.md','src/styles.css','src/config.js','src/db.js',
  'src/main.js','src/pricing.js','src/seed.js','src/receipts.js','src/utils.js','assets/icon.svg','assets/washcare-logo.png'
];
for (const file of required) if (!fs.existsSync(path.join(root,file))) throw new Error(`Missing ${file}`);

const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
if (!html.includes('src/main.js')) throw new Error('main.js not referenced');
if (!html.includes('manifest.webmanifest')) throw new Error('manifest not referenced');

JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const sw = fs.readFileSync(path.join(root,'sw.js'),'utf8');
if (!sw.includes('washcare-v2')) throw new Error('Service worker cache version was not bumped');
if (!sw.includes('assets/washcare-logo.png')) throw new Error('Service worker does not cache the supplied logo');

const pricing = await import(pathToFileURL(path.join(root,'src/pricing.js')).href);
const line = pricing.calculateLine({quantity:2,unitPrice:10,speed:'FAST',fastMultiplier:1.5});
if (line.amount !== 30 || line.urgentCharge !== 10) throw new Error('Fast pricing calculation failed');
const order = pricing.calculateOrder([line], {discount:5,deliveryFee:10,vatRate:0.05});
if (order.beforeVat !== 35 || order.vat !== 1.75 || order.total !== 36.75) throw new Error('Order/VAT calculation failed');

console.log(`Smoke test passed: ${files.length} JavaScript files checked; pricing, manifest and PWA asset checks passed.`);
