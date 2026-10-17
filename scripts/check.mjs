#!/usr/bin/env node
/* Site checker: titles, descriptions, h1, JSON-LD, internal links/anchors, script files. Run: node scripts/check.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const ids = {}; const html = {};
for (const f of files) { html[f] = fs.readFileSync(path.join(ROOT, f), 'utf8'); ids[f] = new Set([...html[f].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])); }
let bad = 0; const warn = (f, m) => { bad++; console.log(`${f}: ${m}`); };
const extern = new Set();
for (const f of files) {
  const h = html[f];
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1]; const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!t) warn(f, 'no title'); else if (t.length > 62) warn(f, `title ${t.length} chars`);
  if (!d) warn(f, 'no description'); else if (d.length > 160) warn(f, `description ${d.length} chars`); else if (d.length < 70) warn(f, `description short (${d.length})`);
  const h1s = (h.match(/<h1[ >]/g) || []).length; if (h1s !== 1) warn(f, `${h1s} h1 tags`);
  if (f !== '404.html' && !h.includes('rel="canonical"')) warn(f, 'no canonical');
  if (!h.includes('google-site-verification') && f === 'index.html') warn(f, 'missing GSC verification');
  if (!h.includes('static.cloudflareinsights.com')) warn(f, 'missing analytics beacon');
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch (e) { warn(f, 'bad JSON-LD'); } }
  for (const m of h.matchAll(/<(?:a|link)\b[^>]*\bhref="([^"]*)"/g)) {
    let u = m[1]; if (!u || u.startsWith('mailto:') || u.startsWith('tel:') || u.startsWith('javascript:')) continue;
    if (/^https?:/.test(u)) { extern.add(u.replace(/&amp;/g, '&')); continue; }
    let [p, hash] = u.split('#'); p = p.split('?')[0];
    const file = p === '' ? f : p === '/' || p === './' ? 'index.html' : p.replace(/^\//, '');
    if (!fs.existsSync(path.join(ROOT, file))) { warn(f, `broken link ${u}`); continue; }
    if (hash && file.endsWith('.html') && !ids[file].has(hash)) warn(f, `missing anchor #${hash} in ${file}`);
  }
  for (const m of h.matchAll(/<script[^>]*\bsrc="([^"]*)"/g)) { const u = m[1]; if (/^https?:/.test(u)) continue; if (!fs.existsSync(path.join(ROOT, u.replace(/^\//, '').split('?')[0]))) warn(f, `missing script ${u}`); }
}
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const f of files) if (f !== '404.html' && !sm.includes(f === 'index.html' ? 'com/</loc>' : `/${f}</loc>`)) warn('sitemap.xml', `missing ${f}`);
fs.writeFileSync(path.join(process.env.EXTERN_OUT || '/dev/null'), [...extern].sort().join('\n') + '\n');
console.log(bad ? `\n${bad} issue(s)` : `all ${files.length} pages OK (${extern.size} unique external links)`);
process.exit(bad ? 1 : 0);
