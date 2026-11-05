import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, allPages, distFiles, readDist, attr } from './dist.js';

test('home has lang lt, title, description, canonical https://nodas.lt/', () => {
  const h = page('/');
  assert.match(h, /<html lang="lt">/);
  assert.match(h, /<title>[^<]+<\/title>/);
  assert.match(h, /<meta name="description" content="[^"]+"/);
  assert.equal(attr(h, /<link rel="canonical" href="([^"]+)"/), 'https://nodas.lt/');
});

test('noindex on every page while SITE.indexable is false', () => {
  for (const p of allPages()) {
    assert.match(page(p), /<meta name="robots" content="noindex, nofollow">/, p);
  }
});

test('no third-party origins', () => {
  for (const p of allPages()) {
    const h = page(p);
    const urls = [...h.matchAll(/<(?:link|script|img)[^>]+(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
    for (const u of urls) {
      assert.ok(u.startsWith('https://nodas.lt'), `${p}: ${u}`);
    }
  }
  for (const f of distFiles().filter((f) => f.endsWith('.css'))) {
    assert.doesNotMatch(readDist(f), /fonts\.(googleapis|gstatic)\.com/, f);
  }
});

test('Inter font is bundled locally', () => {
  const files = distFiles();
  assert.ok(files.some((f) => f.startsWith('_astro/') && /inter.*\.woff2$/i.test(f)), 'no inter woff2 in _astro');
  const css = files.filter((f) => f.endsWith('.css')).map(readDist).join('\n');
  assert.match(css, /font-family:\s*"?Inter Variable"?/);
  assert.match(css, /U\+0?100-0?2BA/i, 'latin-ext subset missing');
});

test('no inline script or style', () => {
  for (const p of allPages()) {
    const h = page(p);
    const scripts = [...h.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
    for (const a of scripts) {
      assert.ok(/\bsrc=/.test(a) || /type="application\/ld\+json"/.test(a), `${p}: inline <script${a}>`);
    }
    assert.doesNotMatch(h, /<style[\s>]/, `${p}: <style>`);
    assert.doesNotMatch(h, /\sstyle="/, `${p}: style=""`);
  }
});

test('header nav and footer links present', () => {
  const h = page('/');
  for (const href of ['/iranga', '/diegimas', '/skaiciuokle', '/necenzuruoti-modeliai', '/duk', '/kontaktai', '/privatumas']) {
    assert.ok(h.includes(`href="${href}"`), href);
  }
});
