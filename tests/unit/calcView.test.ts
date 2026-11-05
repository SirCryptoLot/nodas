import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcView } from '../../src/lib/calcView.ts';

test('note mentions DGX Station when only it reaches the target', () => {
  assert.equal(calcView('70b', 25, 20).note, 'Norimą greitį pasiektų tik DGX Station (tiekiama pagal užklausą).');
});

test('120B MoE for 20 users fits the RTX PRO 6000 workstation', () => {
  const v = calcView('120b', 40, 20);
  assert.equal(v.rec.device.id, 'rtxpro6000');
  assert.equal(v.note, '');
});

test('no note when a sold device meets the target', () => {
  assert.equal(calcView('8b', 30, 1).note, '');
});

test('compact view keeps recommended, DGX Spark and Mac Studio M3 Ultra', () => {
  const ids = calcView('32b', 20, 1, true).rows.map((r) => r.device.id);
  assert.deepEqual(ids, ['rtx5090', 'dgx-spark', 'mac-m3ultra']);
});
