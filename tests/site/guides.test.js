import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, exists, jsonld, allPages, distFiles, readDist } from './dist.js';

const SLUGS = [
  'dgx-spark-lietuvoje', 'dgx-station', 'kokio-kompiuterio-reikia-ai', 'dgx-spark-vs-rtx-5090-vs-mac-studio',
  'privatus-ai-imonei', 'chatgpt-alternatyva-be-debesies', 'ai-buhalterijai', 'ai-teisininkams', 'ai-klinikoms',
  'ai-gamybai', 'necenzuruoti-ai-modeliai', 'lietuviskas-ai-lokaliai', 'di-aktas-imonei',
];

const article = (h) => {
  const m = h.match(/<article[\s\S]*?<\/article>/);
  return m ? m[0] : '';
};
const words = (h) => h.replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

test('all 13 guides built', () => {
  for (const s of SLUGS) assert.ok(exists('/' + s), s);
});

test('each guide ≥ 500 words', () => {
  for (const s of SLUGS) {
    const n = words(article(page('/' + s)));
    assert.ok(n >= 500, `${s}: ${n} words`);
  }
});

test('each guide has Article jsonld and one h1', () => {
  for (const s of SLUGS) {
    const h = page('/' + s);
    assert.ok(jsonld(h).some((j) => j['@type'] === 'Article'), s);
    assert.ok(jsonld(h).some((j) => j['@type'] === 'BreadcrumbList'), s);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, s);
  }
});

test('each guide links to /skaiciuokle or /iranga or /kontaktai from its body', () => {
  for (const s of SLUGS) {
    const a = article(page('/' + s));
    assert.match(a, /href="\/(skaiciuokle|iranga|kontaktai)/, s);
  }
});

test('guides are in sitemap', () => {
  const maps = distFiles().filter((f) => /^sitemap-\d+\.xml$/.test(f)).map(readDist).join('\n');
  for (const s of SLUGS) assert.ok(maps.includes(`https://nodas.lt/${s}<`), s);
});

test('home and iranga link the guides', () => {
  const home = page('/');
  for (const s of SLUGS) assert.ok(home.includes(`href="/${s}"`), `home → ${s}`);
  const iranga = page('/iranga');
  for (const s of ['dgx-spark-lietuvoje', 'kokio-kompiuterio-reikia-ai', 'dgx-spark-vs-rtx-5090-vs-mac-studio']) {
    assert.ok(iranga.includes(`href="/${s}"`), `iranga → ${s}`);
  }
});

test('no guide links to a non-existent internal path', () => {
  const pages = new Set(allPages());
  const files = new Set(distFiles().map((f) => '/' + f));
  for (const p of allPages()) {
    const h = page(p);
    for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) {
      const target = m[1] === '/' ? '/' : m[1].replace(/\/$/, '');
      assert.ok(pages.has(target) || files.has(target), `${p} → ${m[1]}`);
    }
  }
});
