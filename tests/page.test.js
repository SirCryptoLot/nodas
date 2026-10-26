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

test('has sections in order', () => {
  const ids = ['paslaugos', 'nauda', 'kainos', 'eiga', 'garantijos', 'duk', 'kontaktai'];
  let last = -1;
  for (const id of ids) {
    const i = html.indexOf(`id="${id}"`);
    assert.ok(i > last, `section #${id} missing or out of order`);
    last = i;
  }
});

test('shows exact prices and VAT note', () => {
  for (const s of ['nuo 149 €', 'nuo 1 500 €', 'nuo 4 000 €', '1 diena', '3–5 d.', '1–3 sav.',
    'nuo 29 €/mėn.', 'nuo 99 €/mėn.', '24 mėn.', 'Kainos nurodytos su PVM']) {
    assert.ok(html.includes(s), `missing "${s}"`);
  }
});

test('loads Pixelify Sans with latin-ext', () => {
  assert.match(html, /fonts\.googleapis\.com\/css2\?family=Pixelify\+Sans[^"]*/);
  assert.match(html, /subset=latin-ext/);
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
