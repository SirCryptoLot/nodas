import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, jsonld } from './dist.js';

const h = () => page('/konfiguratorius');

test('configurator page exists with breadcrumbs jsonld and one h1', () => {
  assert.equal((h().match(/<h1[\s>]/g) || []).length, 1);
  assert.ok(jsonld(h()).some((j) => j['@type'] === 'BreadcrumbList'));
});

test('default configuration is server-rendered with tok/s and a total price', () => {
  const html = h();
  assert.match(html, /data-out="results"[\s\S]*?tok\/s/);
  assert.match(html, /data-out="total"[^>]*>[^<]*\d[\d ]* €/);
  assert.ok(html.includes('Apytikslė kaina'));
  assert.ok(html.includes('preliminari'));
  assert.ok(html.includes('apytiksliai'));
});

test('all hardware and software choices are listed', () => {
  const html = h();
  for (const s of ['RTX 2080 Ti', 'RTX 3060 12 GB', 'RTX 3090', 'RTX 4090', 'RTX 5060 Ti', 'RTX 5090', 'RTX PRO 6000',
    'Ryzen 5 5600', 'i5-12400F', 'Threadripper', 'DGX Spark', 'Windows 11', 'Ubuntu', 'Ollama', 'llama.cpp', 'LM Studio', 'vLLM',
    'Open WebUI', 'LibreChat', 'Pi', 'Hermes Agent', 'Codex CLI', 'OpenCode', 'Aider', 'gpt-oss-120b', 'Llama 3.3 70B', 'necenzūruotas']) {
    assert.ok(html.includes(s), s);
  }
  for (const r of ['16', '32', '64', '128', '192']) assert.match(html, new RegExp(`name="ramGB"[^>]*value="${r}"|value="${r}"[^>]*name="ramGB"`), r);
  for (const p of ['paprasciausias', 'programuotojui', 'agentas']) assert.match(html, new RegExp(`name="preset"[^>]*value="${p}"|value="${p}"[^>]*name="preset"`), p);
});

test('request form is on the page with config and konfiguratorius plan', () => {
  const html = h();
  assert.match(html, /<form[^>]*id="forma"/);
  assert.match(html, /name="config"/);
  assert.match(html, /<option value="konfiguratorius" selected/);
});

test('header links to the configurator', () => {
  assert.match(page('/'), /href="\/konfiguratorius"/);
});

test('platform line is a live output', () => {
  assert.match(h(), /data-out="platform"/);
});

test('hardware choice is three clear cards with description and price hint, parts in a separate panel', () => {
  const html = h();
  const cards = html.match(/<label class="hw-card[^"]*"[\s\S]*?<\/label>/g) || [];
  assert.equal(cards.length, 3);
  for (const c of cards) {
    assert.match(c, /type="radio" name="hw"/);
    assert.match(c, /class="hw-desc"/);
    assert.match(c, /class="hw-price"[^>]*>[^<]*\d[\d ]* €/);
  }
  assert.match(html, /class="hw-panel"[\s\S]*?name="gpuId"/);
});
