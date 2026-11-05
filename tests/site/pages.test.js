import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, allPages, exists, jsonld, attr, readDist } from './dist.js';

const CORE = ['/', '/iranga', '/diegimas', '/necenzuruoti-modeliai', '/duk', '/privatumas'];
const PRODUCTS = ['dgx-spark', 'ai-kompiuteris-rtx-5090', 'ai-kompiuteris-2x-rtx-5090', 'ai-darbo-stotis-rtx-pro-6000', 'dgx-station'];
const WARRANTY = 'Įrangai taikoma tiekėjo garantija; garantinius reikalus sutvarkome už jus.';
const DELIVERY = 'Terminas nurodomas pasiūlyme, priklauso nuo tiekėjo sandėlio.';
const PLACEHOLDERS = ['[TELEFONAS]', '[EL. PAŠTAS]', '[REKVIZITAI]'];

const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ').replace(/\s+/g, ' ');

test('core pages exist', () => {
  for (const p of CORE) assert.ok(exists(p), p);
});

test('every page has unique title and description', () => {
  const titles = new Map();
  const descs = new Map();
  for (const p of allPages().filter((p) => p !== '/404')) {
    const h = page(p);
    const t = attr(h, /<title>([^<]+)<\/title>/);
    const d = attr(h, /<meta name="description" content="([^"]+)"/);
    assert.ok(t && d, p);
    assert.ok(!titles.has(t), `duplicate title ${t}: ${p} & ${titles.get(t)}`);
    assert.ok(!descs.has(d), `duplicate description: ${p} & ${descs.get(d)}`);
    assert.ok(d.length >= 70 && d.length <= 170, `${p} description length ${d.length}`);
    titles.set(t, p);
    descs.set(d, p);
  }
});

test('canonical equals https://nodas.lt + path', () => {
  for (const p of allPages().filter((p) => p !== '/404')) {
    const c = attr(page(p), /<link rel="canonical" href="([^"]+)"/);
    assert.equal(c, 'https://nodas.lt' + p, p);
  }
});

test('exactly one h1 per page', () => {
  for (const p of allPages()) {
    assert.equal((page(p).match(/<h1[\s>]/g) || []).length, 1, p);
  }
});

test('product pages exist for every catalog product with Product + BreadcrumbList jsonld', () => {
  for (const slug of PRODUCTS) {
    const h = page(`/iranga/${slug}`);
    const types = jsonld(h).map((j) => j['@type']);
    assert.ok(types.includes('Product'), slug);
    assert.ok(types.includes('BreadcrumbList'), slug);
    assert.match(h, new RegExp(`href="/kontaktai\\?plan=`), `${slug} CTA`);
  }
});

test('prices on pages come from catalog', () => {
  const iranga = text(page('/iranga'));
  assert.equal((iranga.match(/Kaina pagal užklausą/g) || []).length >= PRODUCTS.length, true);
  const d = text(page('/diegimas'));
  for (const s of ['nuo 149 €', 'nuo 4 000 €', 'nuo 29 €/mėn.', 'nuo 99 €/mėn.', 'su PVM']) assert.ok(d.includes(s), s);
  const types = jsonld(page('/diegimas')).map((j) => j['@type']);
  assert.equal(types.filter((t) => t === 'Service').length, 4);
  for (const j of jsonld(page('/iranga/dgx-spark'))) if (j['@type'] === 'Product') assert.equal('offers' in j, false);
});

test('warranty and delivery copy present', () => {
  const t = text(page('/iranga'));
  assert.ok(t.includes(WARRANTY), 'warranty');
  assert.ok(t.includes(DELIVERY), 'delivery');
});

test('duk has FAQPage jsonld with all faq items', () => {
  const h = page('/duk');
  const faq = jsonld(h).find((j) => j['@type'] === 'FAQPage');
  assert.ok(faq);
  assert.ok(faq.mainEntity.length >= 8);
  for (const q of faq.mainEntity) assert.ok(h.includes(q.name.replace(/"/g, '&quot;')) || h.includes(q.name), q.name);
});

test('home links to iranga, diegimas, skaiciuokle, necenzuruoti-modeliai, kontaktai and has Organization jsonld', () => {
  const h = page('/');
  const main = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  for (const href of ['/iranga', '/diegimas', '/skaiciuokle', '/necenzuruoti-modeliai', '/kontaktai']) {
    assert.ok(main.includes(`href="${href}`), href);
  }
  assert.ok(jsonld(h).some((j) => j['@type'] === 'Organization'));
});

test('necenzuruoti page states user responsibility', () => {
  assert.ok(text(page('/necenzuruoti-modeliai')).includes('atsako naudotojas'));
});

test('privatumas covers GDPR basics', () => {
  const t = text(page('/privatumas'));
  for (const s of ['Resend', 'Vercel', '12 mėnesių', 'slapukų', 'Valstybinei duomenų apsaugos inspekcijai']) assert.ok(t.includes(s), s);
});

test('placeholders appear only in footer, kontaktai and privatumas', () => {
  for (const p of allPages()) {
    if (p === '/kontaktai' || p === '/privatumas') continue;
    const h = page(p);
    const noFooter = h.slice(0, h.indexOf('<footer')) + h.slice(h.indexOf('</footer>'));
    const body = noFooter.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    for (const ph of PLACEHOLDERS) assert.ok(!body.includes(ph), `${p} contains ${ph} outside footer`);
  }
});

test('404 page exists and is not in sitemap', () => {
  assert.ok(exists('/404'));
  assert.doesNotMatch(readDist('sitemap-0.xml'), /404/);
});

test('every "nuo N €" on any page is a current catalog service price', () => {
  const allowed = new Set(['nuo 149 €', 'nuo 4 000 €', 'nuo 29 €/mėn.', 'nuo 99 €/mėn.']);
  for (const p of allPages()) {
    for (const m of text(page(p)).matchAll(/nuo \d[\d ]* €(\/mėn\.)?/g)) {
      assert.ok(allowed.has(m[0]), `${p}: ${m[0]}`);
    }
  }
});
