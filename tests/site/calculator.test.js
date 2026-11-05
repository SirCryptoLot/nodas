import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, jsonld } from './dist.js';

const NAMES = ['AI kompiuteris su RTX 5090', 'NVIDIA DGX Spark (GB10)', 'AI kompiuteris su 2× RTX 5090', 'AI darbo stotis su RTX PRO 6000', 'NVIDIA DGX Station (GB300)', 'Mac Studio M4 Max 128 GB', 'Mac Studio M3 Ultra 512 GB'];

test('calculator page server-renders a recommendation and all devices', () => {
  const h = page('/skaiciuokle');
  assert.match(h, /data-calc/);
  for (const n of NAMES) assert.ok(h.includes(n), n);
  assert.match(h, /data-out="rec-name"[^>]*>[^<]+</);
  assert.match(h, /type="range"[^>]*min="5"[^>]*max="100"/);
  for (const m of ['8b', '32b', '70b', '120b']) assert.match(h, new RegExp(`name="model"[^>]*value="${m}"|value="${m}"[^>]*name="model"`), m);
  for (const u of ['1', '5', '20']) assert.match(h, new RegExp(`name="users"[^>]*value="${u}"|value="${u}"[^>]*name="users"`), `users ${u}`);
});

test('calculator page has FAQPage and BreadcrumbList jsonld', () => {
  const types = jsonld(page('/skaiciuokle')).map((j) => j['@type']);
  assert.ok(types.includes('FAQPage'));
  assert.ok(types.includes('BreadcrumbList'));
});

test('compact calculator on home', () => {
  const h = page('/');
  assert.match(h, /data-calc[^>]*data-compact/);
  assert.match(h, /type="range"/);
});

test('cta prefill link present', () => {
  const h = page('/skaiciuokle');
  assert.match(h, /data-out="cta"[^>]*href="\/kontaktai\?plan=[a-z0-9-]+&amp;tema=Skai/);
});

test('apytikslis įvertinimas label present', () => {
  assert.ok(page('/skaiciuokle').includes('apytikslis įvertinimas'));
  assert.ok(page('/').includes('apytikslis įvertinimas'));
});

test('calculator script is an external module', () => {
  assert.match(page('/skaiciuokle'), /<script type="module" src="\/_astro\/[^"]+\.js"/);
});
