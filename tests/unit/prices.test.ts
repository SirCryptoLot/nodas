import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { priceText, services } from '../../src/data/catalog.ts';
import { calcView } from '../../src/lib/calcView.ts';

function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

test('no hardcoded "nuo N €" prices outside catalog.ts', () => {
  const offenders = walk('src')
    .filter((f) => !f.endsWith('catalog.ts'))
    .filter((f) => /nuo \d[\d ]* €/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, []);
});

test('priceText formats services from the catalog', () => {
  assert.equal(priceText('idiegimas'), 'nuo 149 €');
  assert.equal(priceText('verslo-serveris'), 'nuo 4 000 €');
  assert.equal(priceText('palaikymas-namams'), 'nuo 29 €/mėn.');
  assert.equal(priceText('palaikymas-verslui'), 'nuo 99 €/mėn.');
  assert.equal(services.length, 4);
});

test('calculator view carries the recommended product price', () => {
  assert.equal(calcView('32b', 20, 1).priceText, 'Kaina pagal užklausą');
});

test('fillPrices replaces placeholders and throws on unknown service', async () => {
  const { fillPrices } = await import('../../src/lib/fillPrices.ts');
  assert.equal(fillPrices('Diegimas {{kaina:idiegimas}}, palaikymas {{kaina:palaikymas-verslui}}'), 'Diegimas nuo 149 €, palaikymas nuo 99 €/mėn.');
  assert.throws(() => fillPrices('{{kaina:nera}}'));
});
