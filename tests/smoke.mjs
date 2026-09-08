import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=path.resolve(new URL('..', import.meta.url).pathname);
const files=[];function walk(d){for(const x of fs.readdirSync(d)){const p=path.join(d,x);if(['node_modules','.git'].includes(x))continue;const s=fs.statSync(p);if(s.isDirectory())walk(p);else if(p.endsWith('.js')||p.endsWith('.mjs'))files.push(p);}}walk(root);
for(const f of files){execFileSync(process.execPath,['--check',f],{stdio:'inherit'});}
for(const f of ['index.html','manifest.webmanifest','sw.js','README.md','src/styles.css','assets/icon.svg']) if(!fs.existsSync(path.join(root,f))) throw new Error(`Missing ${f}`);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'); if(!html.includes('src/main.js')) throw new Error('main.js not referenced');
console.log(`Smoke test passed: ${files.length} JavaScript files checked.`);
