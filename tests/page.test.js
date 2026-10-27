import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('has lang lt, title, description, og tags', () => {
  assert.match(html, /<html lang="lt">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:description"/);
});

test('one-screen layout: hero, offer and strip inside main.screen', () => {
  const main = html.slice(html.indexOf('<main class="screen"'), html.indexOf('</main>'));
  assert.ok(main.length > 0, 'main.screen missing');
  for (const id of ['hero', 'kainos', 'juosta']) assert.match(main, new RegExp(`id="${id}"`), `#${id} not in main`);
  for (const s of ['Verslui', 'Namams', 'Be cenzūros', 'Vertimai', 'Be interneto', 'Pokalbis', 'Apmokymas']) {
    assert.ok(main.includes(s), `main missing "${s}"`);
  }
});

test('DUK and Kontaktai are dialogs opened from buttons', () => {
  assert.match(html, /<dialog id="duk"/);
  assert.match(html, /<dialog id="kontaktai"/);
  assert.match(html, /data-open="duk"/);
  assert.match(html, /data-open="kontaktai"/);
  assert.equal((html.match(/data-close/g) || []).length, 3);
  assert.equal((html.match(/<details>/g) || []).length, 5);
});

test('shows exact prices and VAT note', () => {
  for (const s of ['nuo 149 €', 'nuo 1 500 €', 'nuo 4 000 €', '1 diena', '3–5 d.', '1–3 sav.',
    'nuo 29 €/mėn.', 'nuo 99 €/mėn.', '24 mėn.', 'Kainos nurodytos su PVM']) {
    assert.ok(html.includes(s), `missing "${s}"`);
  }
});

test('self-hosts JetBrains Mono incl. latin-ext, no Google requests', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.doesNotMatch(html + css, /fonts\.(googleapis|gstatic)\.com/);
  for (const f of ['jetbrains-mono-latin.woff2', 'jetbrains-mono-latin-ext.woff2']) {
    assert.ok(css.includes(`/fonts/${f}`), `@font-face for ${f} missing`);
    const bytes = readFileSync(new URL(`../fonts/${f}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'wOF2', `${f} is not woff2`);
  }
  assert.match(css, /font-family:\s*'JetBrains Mono'/);
  assert.match(css, /U\+0100-02BA/);
});

test('placeholders only in contacts and footer', () => {
  const start = html.indexOf('id="kontaktai"');
  for (const p of ['[TELEFONAS]', '[EL. PAŠTAS]', '[REKVIZITAI]']) {
    const first = html.indexOf(p);
    assert.ok(first !== -1, `placeholder ${p} missing`);
    assert.ok(first > start, `placeholder ${p} appears before #kontaktai`);
  }
});

test('form has required fields and privacy line', () => {
  assert.match(html, /<form id="forma"/);
  for (const n of ['name', 'contact', 'plan', 'message', 'website']) {
    assert.match(html, new RegExp(`name="${n}"`), `field ${n} missing`);
  }
  for (const v of ['diegimas', 'kompiuteris', 'serveris', 'palaikymas', 'nezinau']) {
    assert.match(html, new RegExp(`value="${v}"`), `plan option ${v} missing`);
  }
  assert.match(html, /id="forma-siusti"/);
  assert.match(html, /id="forma-zinute"[^>]*aria-live="polite"/);
  assert.ok(html.includes('Jūsų duomenis naudosime tik atsakyti į užklausą'));
});

test('no analytics', () => {
  assert.doesNotMatch(html, /gtag|googletagmanager|analytics/i);
});

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const SITE = 'https://privatusai.lt/';

test('brand is privatus AI with logo mark', () => {
  assert.match(html, /<title>privatus AI/);
  assert.match(html, /<a href="\/" class="logo" aria-label="privatus AI"/);
  assert.match(html, /class="logo-mark"/);
  assert.doesNotMatch(html, /Nodas/);
  const fav = read('favicon.svg');
  assert.match(fav, /#c2410c/i);
});

test('canonical, og:url and og:image point to privatusai.lt', () => {
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}">`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${SITE}">`));
  assert.match(html, new RegExp(`<meta property="og:image" content="${SITE}og.png">`));
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  const png = readFileSync(new URL('../og.png', import.meta.url));
  assert.equal(png.subarray(1, 4).toString('latin1'), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('privacy policy dialog covers GDPR basics', () => {
  assert.match(html, /<dialog id="privatumas"/);
  assert.match(html, /data-open="privatumas"/);
  const start = html.indexOf('<dialog id="privatumas"');
  const dlg = html.slice(start, html.indexOf('</dialog>', start));
  for (const s of ['Kokius duomenis', 'Kam naudojame', 'Kiek laiko', 'Resend', 'Vercel', 'slapuk',
    'Valstybinei duomenų apsaugos inspekcijai', '[REKVIZITAI]', '[EL. PAŠTAS]']) {
    assert.ok(dlg.includes(s), `privacy missing "${s}"`);
  }
});

test('404, robots and sitemap exist', () => {
  const nf = read('404.html');
  assert.match(nf, /<html lang="lt">/);
  assert.match(nf, /href="\/"/);
  assert.match(nf, /\/styles\.css/);
  assert.match(read('robots.txt'), new RegExp(`Sitemap: ${SITE}sitemap.xml`));
  assert.match(read('sitemap.xml'), new RegExp(`<loc>${SITE}</loc>`));
});

test('vercel.json sets security headers and font caching', () => {
  const cfg = JSON.parse(read('vercel.json'));
  const all = cfg.headers.find((h) => h.source === '/(.*)').headers;
  const get = (k) => all.find((h) => h.key === k)?.value;
  assert.equal(get('X-Content-Type-Options'), 'nosniff');
  assert.equal(get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  const csp = get('Content-Security-Policy');
  for (const d of ["default-src 'self'", "script-src 'self'", "frame-ancestors 'none'", "form-action 'self'"]) {
    assert.ok(csp.includes(d), `CSP missing ${d}`);
  }
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  const fonts = cfg.headers.find((h) => h.source === '/fonts/(.*)').headers;
  assert.match(fonts[0].value, /max-age=31536000, immutable/);
});

test('no inline scripts or styles (CSP compatible)', () => {
  for (const f of ['index.html', '404.html']) {
    const h = read(f);
    assert.doesNotMatch(h, /<script(?![^>]*\bsrc=)[^>]*>/, `${f} has inline script`);
    assert.doesNotMatch(h, /<style|\sstyle="/, `${f} has inline style`);
  }
});

test('fallback error text includes phone', () => {
  assert.match(html, /data-phone>\[TELEFONAS\]/);
  assert.match(read('main.js'), /\[data-phone\]/);
});
