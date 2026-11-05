import { test } from 'node:test';
import assert from 'node:assert/strict';
import { devices, models, products, services } from '../../src/data/catalog.ts';
import { memoryNeededGB, tokensPerSecond, evaluate, recommend, readingLabel } from '../../src/lib/calc.ts';

const dev = (id: string) => devices.find((d) => d.id === id)!;
const model = (id: string) => models.find((m) => m.id === id)!;

test('memory for 70b single user is ~47 GB', () => {
  assert.ok(Math.abs(memoryNeededGB(model('70b'), 1) - 47.25) <= 0.1);
});

test('rtx5090 8b ~ 219 tok/s', () => {
  assert.equal(tokensPerSecond(dev('rtx5090'), model('8b'), 1), 219);
});

test('dgx spark 70b ~ 4 tok/s', () => {
  assert.equal(tokensPerSecond(dev('dgx-spark'), model('70b'), 1), 4);
});

test('users slow per-user speed', () => {
  const one = tokensPerSecond(dev('rtx5090'), model('8b'), 1);
  const twenty = tokensPerSecond(dev('rtx5090'), model('8b'), 20);
  assert.ok(twenty < one / 3);
});

test('70b does not fit rtx5090', () => {
  const row = evaluate(model('70b'), 10, 1).find((r) => r.device.id === 'rtx5090')!;
  assert.equal(row.fits, false);
  assert.equal(row.tps, 0);
  assert.equal(row.meets, false);
});

test('evaluate lists every device, sold first by tier then Macs', () => {
  const rows = evaluate(model('8b'), 10, 1);
  assert.equal(rows.length, devices.length);
  assert.deepEqual(rows.map((r) => r.device.id), ['rtx5090', 'dgx-spark', 'rtx5090x2', 'rtxpro6000', 'dgx-station', 'mac-m4max', 'mac-m3ultra']);
});

test('recommend picks cheapest sold device meeting target', () => {
  const rec = recommend(evaluate(model('8b'), 30, 1));
  assert.equal(rec.device.id, 'rtx5090');
  assert.equal(rec.macNote, false);
  assert.equal(rec.onRequest, false);
});

test('recommend falls back to DGX Station', () => {
  const huge = { id: 'x', label: 'x', paramsB: 400, activeB: 400, example: '', hint: '' };
  const rec = recommend(evaluate(huge, 20, 20));
  assert.equal(rec.device.id, 'dgx-station');
  assert.equal(rec.onRequest, true);
});

test('recommend notes Mac Studio when only Mac meets target', () => {
  const m = { id: 'x', label: 'x', paramsB: 150, activeB: 12, example: '', hint: '' };
  const rec = recommend(evaluate(m, 40, 1));
  assert.equal(rec.device.id, 'dgx-spark');
  assert.equal(rec.macNote, true);
  assert.equal(rec.onRequest, false);
});

test('recommend never picks an on-request device while a sold one meets the target', () => {
  const rec = recommend(evaluate(model('120b'), 20, 1));
  assert.notEqual(rec.device.id, 'dgx-station');
});

test('recommend flags DGX Station when only it reaches the target', () => {
  const rec = recommend(evaluate(model('70b'), 25, 20));
  assert.equal(rec.device.id, 'rtxpro6000');
  assert.equal(rec.stationNote, true);
  const easy = recommend(evaluate(model('8b'), 30, 1));
  assert.equal(easy.stationNote, false);
});

test('readingLabel thresholds', () => {
  assert.equal(readingLabel(4), 'lėčiau nei skaitote');
  assert.equal(readingLabel(8), 'maždaug kaip skaitote');
  assert.equal(readingLabel(40), 'greičiau nei skaitote');
});

test('every product points at an existing device', () => {
  for (const p of products) assert.ok(devices.some((d) => d.id === p.deviceId), p.slug);
});

test('prices are null or positive', () => {
  for (const p of products) assert.ok(p.priceEur === null || p.priceEur > 0, p.slug);
  for (const s of services) assert.ok(s.priceFrom > 0, s.slug);
});

test('service prices match the spec', () => {
  const price = (slug: string) => services.find((s) => s.slug === slug)!.priceFrom;
  assert.equal(price('idiegimas'), 149);
  assert.equal(price('verslo-serveris'), 4000);
  assert.equal(price('palaikymas-namams'), 29);
  assert.equal(price('palaikymas-verslui'), 99);
});
