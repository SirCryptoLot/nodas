import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { page, allPages, DIST } from './dist.js';

const cfg = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const headersFor = (source) => cfg.headers.find((h) => h.source === source)?.headers ?? [];

test('vercel.json CSP has no unsafe-inline and keeps strict directives', () => {
  const csp = headersFor('/(.*)').find((h) => h.key === 'Content-Security-Policy').value;
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  for (const d of ["default-src 'self'", "script-src 'self'", "style-src 'self'", "frame-ancestors 'none'", "form-action 'self'"]) {
    assert.ok(csp.includes(d), d);
  }
});

test('vercel.json builds astro into dist and caches hashed assets', () => {
  assert.equal(cfg.framework, 'astro');
  assert.equal(cfg.outputDirectory, 'dist');
  const cache = headersFor('/_astro/(.*)').find((h) => h.key === 'Cache-Control');
  assert.match(cache.value, /max-age=31536000, immutable/);
});

test('og.png is 1200x630 PNG', () => {
  const png = readFileSync(DIST + 'og.png');
  assert.equal(png.subarray(1, 4).toString('latin1'), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('every page references og.png', () => {
  for (const p of allPages()) {
    assert.match(page(p), /<meta property="og:image" content="https:\/\/nodas\.lt\/og\.png">/, p);
  }
});
