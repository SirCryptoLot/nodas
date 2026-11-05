import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quote, softwareLevel, resolveSystem, results, configText, defaultConfig } from '../../src/lib/quote.ts';
import type { Config } from '../../src/lib/quote.ts';

const base = (over: Partial<Config> = {}): Config => ({ ...defaultConfig(), ...over });

test('own computer = installation only', () => {
  const q = quote(base({ hw: 'own', agents: [] }));
  assert.equal(q.oneOff, 149);
  assert.deepEqual(q.unknown, []);
  assert.equal(q.lines.length, 1);
});

test('built PC = GPU + CPU + RAM + base + 99 assembly + install', () => {
  const q = quote(base({ hw: 'pc', gpuId: 'rtx5070ti', gpuCount: 1, cpuId: 'r7-9700x', ramGB: 32, agents: [] }));
  const expected = 1291 + 239.19 + 474.9 + 625 + 99 + 149;
  assert.ok(Math.abs(q.oneOff - expected) < 0.01, String(q.oneOff));
});

test('two GPUs force Threadripper and the workstation base', () => {
  const cfg = base({ hw: 'pc', gpuId: 'rtx5090', gpuCount: 2, cpuId: 'r5-7600', ramGB: 128, agents: [] });
  const sys = resolveSystem(cfg);
  assert.equal(sys.kind === 'pc' && sys.cpu.id, 'tr-9960x');
  const q = quote(cfg);
  assert.ok(q.lines.some((l) => l.label.includes('Threadripper')));
  assert.ok(q.lines.some((l) => l.eur === 1661));
  assert.ok(Math.abs(q.oneOff - (2 * 6990 + 1531 + 2696 + 1661 + 99 + 149)) < 0.01);
});

test('GPU without a current price goes to unknown and is not summed', () => {
  const q = quote(base({ hw: 'pc', gpuId: 'rtx3090', gpuCount: 1, cpuId: 'r5-5600', ramGB: 32, agents: [] }));
  assert.ok(q.unknown.some((u) => u.includes('RTX 3090')));
  assert.ok(Math.abs(q.oneOff - (106.99 + 218.29 + 625 + 99 + 149)) < 0.01);
});

test('install level: Hermes or vLLM → 349, coding agents → 249, otherwise 149', () => {
  assert.equal(softwareLevel(base({ agents: ['hermes'] })), 'agentas');
  assert.equal(softwareLevel(base({ agents: [], engine: 'vllm' })), 'agentas');
  assert.equal(softwareLevel(base({ agents: ['codex', 'pi'] })), 'programuotojui');
  assert.equal(softwareLevel(base({ agents: [] })), 'paprasciausias');
  assert.equal(quote(base({ hw: 'own', agents: ['hermes'] })).oneOff, 349);
});

test('support is a separate monthly line', () => {
  const q = quote(base({ hw: 'own', agents: [], support: 'verslui' }));
  assert.equal(q.oneOff, 149);
  assert.equal(q.monthly, 99);
  assert.equal(quote(base({ hw: 'own', agents: [], support: 'namams' })).monthly, 29);
});

test('DGX Spark = device + install, no assembly', () => {
  const q = quote(base({ hw: 'dgx', agents: [] }));
  assert.equal(q.oneOff, 5193 + 149);
});

test('DDR4 platform is capped at 128 GB in price and speed', () => {
  const cfg = base({ hw: 'pc', gpuId: 'rtx3060', gpuCount: 1, cpuId: 'r5-5600', ramGB: 192, agents: [] });
  const q = quote(cfg);
  assert.ok(q.lines.some((l) => l.label === '128 GB DDR4 RAM' && l.eur === 873.16));
  assert.deepEqual(q.unknown, []);
  const sys = resolveSystem(cfg);
  assert.equal(sys.kind === 'pc' && sys.ramGB, 128);
  assert.ok(configText(cfg).includes('128 GB RAM'));
});

test('results give one estimate per selected model', () => {
  const r = results(base({ hw: 'pc', gpuId: 'rtx5090', gpuCount: 1, cpuId: 'r9-9950x', ramGB: 64, models: ['qwen3-8b', 'llama3.3-70b'] }));
  assert.equal(r.length, 2);
  assert.equal(r[0].estimate.mode, 'vram');
  assert.equal(r[1].estimate.mode, 'partial');
});

test('configText lists hardware, software, models with tok/s and the total', () => {
  const cfg = base({ hw: 'pc', gpuId: 'rtx5070ti', gpuCount: 1, cpuId: 'r7-9700x', ramGB: 32, models: ['qwen3-14b'], agents: ['pi'] });
  const t = configText(cfg);
  for (const s of ['RTX 5070 Ti', 'AMD Ryzen 7 9700X', '32 GB', 'Ollama', 'Open WebUI', 'Pi', 'Qwen3 14B', 'tok/s', 'Apytikslė kaina']) {
    assert.ok(t.includes(s), s);
  }
  assert.ok(t.length <= 3000);
});
