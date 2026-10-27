import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
  assert.equal((html.match(/data-close/g) || []).length, 2);
  assert.equal((html.match(/<details>/g) || []).length, 5);
});

test('shows exact prices and VAT note', () => {
  for (const s of ['nuo 149 €', 'nuo 1 500 €', 'nuo 4 000 €', '1 diena', '3–5 d.', '1–3 sav.',
    'nuo 29 €/mėn.', 'nuo 99 €/mėn.', '24 mėn.', 'Kainos nurodytos su PVM']) {
    assert.ok(html.includes(s), `missing "${s}"`);
  }
});

test('self-hosts Pixelify Sans incl. latin-ext, no Google requests', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.doesNotMatch(html + css, /fonts\.(googleapis|gstatic)\.com/);
  for (const f of ['pixelify-sans-latin.woff2', 'pixelify-sans-latin-ext.woff2']) {
    assert.ok(css.includes(`/fonts/${f}`), `@font-face for ${f} missing`);
    const bytes = readFileSync(new URL(`../fonts/${f}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'wOF2', `${f} is not woff2`);
  }
  assert.match(css, /font-family:\s*'Pixelify Sans'/);
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
