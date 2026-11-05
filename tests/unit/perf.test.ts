import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gpus, cpus, models, engines, DGX_SPARK } from '../../src/data/parts.ts';
import { estimate } from '../../src/lib/perf.ts';

const gpu = (id: string) => gpus.find((g) => g.id === id)!;
const cpu = (id: string) => cpus.find((c) => c.id === id)!;
const model = (id: string) => models.find((m) => m.id === id)!;
const sys = (gpuId: string, count: number, cpuId: string, ramGB: number) => ({ kind: 'pc' as const, gpu: gpu(gpuId), gpuCount: count, cpu: cpu(cpuId), ramGB });

test('5090 with a 3.83 GB model ≈ measured 290 tok/s', () => {
  const m = { id: 'x', name: 'x', sizeGB: 3.83, totalB: 7, activeB: 7, uncensored: false };
  const r = estimate(sys('rtx5090', 1, 'r9-9950x', 96), m, 'llamacpp', 1);
  assert.equal(r.mode, 'vram');
  assert.ok(Math.abs(r.tps - 290) <= 3, String(r.tps));
});

test('DGX Spark gpt-oss-120b within 45–75 tok/s (measured ~59)', () => {
  const r = estimate({ kind: 'unified', device: DGX_SPARK }, model('gpt-oss-120b'), 'llamacpp', 1);
  assert.equal(r.mode, 'vram');
  assert.ok(r.tps >= 45 && r.tps <= 75, String(r.tps));
});

test('5090 + 9950X + 96 GB runs Llama 70B partly in RAM at 1–8 tok/s', () => {
  const r = estimate(sys('rtx5090', 1, 'r9-9950x', 96), model('llama3.3-70b'), 'llamacpp', 1);
  assert.equal(r.mode, 'partial');
  assert.ok(r.tps >= 1 && r.tps <= 8, String(r.tps));
});

test('3060 12GB + 16 GB RAM cannot run 70B', () => {
  const r = estimate(sys('rtx3060', 1, 'r5-5600', 16), model('llama3.3-70b'), 'ollama', 1);
  assert.equal(r.mode, 'none');
  assert.equal(r.tps, 0);
});

test('vLLM never offloads to RAM', () => {
  const r = estimate(sys('rtx5090', 1, 'r9-9950x', 128), model('llama3.3-70b'), 'vllm', 1);
  assert.equal(r.mode, 'none');
});

test('two GPUs pool VRAM so 70B fits in 2× 5090', () => {
  const r = estimate(sys('rtx5090', 2, 'tr-9960x', 128), model('llama3.3-70b'), 'llamacpp', 1);
  assert.equal(r.mode, 'vram');
  assert.ok(r.tps > 10);
});

test('more users reduce per-user speed, less with vLLM', () => {
  const s = sys('rtx5090', 1, 'r9-9950x', 64);
  const one = estimate(s, model('qwen3-8b'), 'llamacpp', 1).tps;
  const ten = estimate(s, model('qwen3-8b'), 'llamacpp', 10).tps;
  const tenV = estimate(s, model('qwen3-8b'), 'vllm', 10).tps;
  assert.ok(ten < one / 2);
  assert.ok(tenV > ten);
});

test('Ollama is slightly slower than llama.cpp', () => {
  const s = sys('rtx4090', 1, 'r7-9700x', 64);
  assert.ok(estimate(s, model('qwen3-14b'), 'ollama', 1).tps < estimate(s, model('qwen3-14b'), 'llamacpp', 1).tps);
});

test('data sanity', () => {
  for (const g of gpus) {
    assert.ok(g.vramGB > 0 && g.bandwidthGBs > 0, g.id);
    assert.ok(g.priceEur === null || g.priceEur > 0, g.id);
  }
  for (const c of cpus) assert.ok(c.ramBwGBs > 0 && c.priceEur > 0, c.id);
  for (const m of models) assert.ok(m.sizeGB > 0 && m.activeB <= m.totalB, m.id);
  assert.ok(engines.length === 4);
  assert.ok(gpus.some((g) => g.id === 'rtx2080ti') && gpus.some((g) => g.id === 'rtxpro6000'));
});

// llama.cpp diskusija #17621: RTX 4090 tg128 — gpt-oss-20b MXFP4 232, Qwen3 30B-A3B Q4_K_M 198.
test('MoE calibration: 4090 gpt-oss-20b within 10% of measured 232', () => {
  const r = estimate(sys('rtx4090', 1, 'r9-9950x', 64), model('gpt-oss-20b'), 'llamacpp', 1);
  assert.ok(r.tps >= 209 && r.tps <= 255, String(r.tps));
});

test('MoE calibration: 4090 Qwen3 30B-A3B within 20% of measured 198', () => {
  const r = estimate(sys('rtx4090', 1, 'r9-9950x', 64), model('qwen3-30b-a3b'), 'llamacpp', 1);
  assert.ok(r.tps >= 158 && r.tps <= 238, String(r.tps));
});
