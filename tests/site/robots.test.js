import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readDist, distFiles } from './dist.js';

test('robots disallows all while not indexable', () => {
  const r = readDist('robots.txt');
  assert.match(r, /User-agent: \*/);
  assert.match(r, /Disallow: \//);
  assert.doesNotMatch(r, /Allow: \/\n/);
});

test('sitemap lists home and excludes 404', () => {
  const maps = distFiles().filter((f) => /^sitemap-\d+\.xml$/.test(f)).map(readDist).join('\n');
  assert.match(maps, /<loc>https:\/\/nodas\.lt\/?<\/loc>/);
  assert.doesNotMatch(maps, /404/);
});
