import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, allPages } from './dist.js';

test('header has an icon menu button and a compact quote button on every page', () => {
  for (const p of allPages()) {
    const h = page(p);
    assert.match(h, /class="nav-toggle"[^>]*aria-label="Meniu"/, p);
    assert.match(h, /class="nav-toggle"[\s\S]*?<svg/, p);
    assert.match(h, /class="btn btn-primary nav-cta"[^>]*href="\/kontaktai"|href="\/kontaktai"[^>]*class="btn btn-primary nav-cta"/, p);
  }
});

test('configurator has a mobile result bar with live total and speed', () => {
  const h = page('/konfiguratorius');
  assert.match(h, /data-cfg-bar/);
  assert.match(h, /data-out="bar-total"[^>]*>[^<]*\d[\d ]* €/);
  assert.match(h, /data-out="bar-speed"[^>]*>[^<]*tok\/s/);
  assert.match(h, /data-cfg-toggle[^>]*aria-expanded="false"/);
  assert.match(h, /data-cfg-close/);
});

test('home guides and featured products are horizontal scrollers', () => {
  const h = page('/');
  assert.ok((h.match(/class="[^"]*\bscroller\b/g) || []).length >= 2);
});

test('product pages have a sticky quote button', () => {
  for (const slug of ['dgx-spark', 'ai-kompiuteris-rtx-5090', 'dgx-station']) {
    assert.match(page(`/iranga/${slug}`), /class="sticky-cta"[\s\S]*?href="\/kontaktai\?plan=/, slug);
  }
});
