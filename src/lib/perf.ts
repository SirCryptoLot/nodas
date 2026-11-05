// Apytikslis greitis (tokenai/s), paremtas llama.cpp matavimais.
// Generuojant kiekvieną tokeną reikia perskaityti aktyvius modelio svorius,
// todėl greitis ≈ efektyvus atminties pralaidumas / aktyvių svorių dydis.
import { engines } from '../data/parts.ts';
import type { Gpu, Cpu, Model, UnifiedDevice, EngineId } from '../data/parts.ts';

export const REF_MODEL_GB = 3.83; // Llama 2 7B Q4_0 (3,56 GiB), kuriuo matuota tg7b
export const FALLBACK_EFF = 0.6; // kai matavimo nėra: dalis teorinio pralaidumo
export const MOE_FACTOR = 0.7; // MoE modelių papildomos sąnaudos (kalibruota: DGX Spark gpt-oss-120b, RTX 4090 gpt-oss-20b ir Qwen3 30B-A3B)
export const KV_OVERHEAD = 1.1; // kontekstas ir darbinė atmintis
export const KV_PER_USER = 0.02; // papildoma atmintis kiekvienam vartotojui (dalis modelio dydžio)
export const VRAM_RESERVE_GB = 1.5;
export const OS_RAM_GB = 8;
export const RAM_EFF = 0.7;

export type System =
  | { kind: 'pc'; gpu: Gpu; gpuCount: number; cpu: Cpu; ramGB: number }
  | { kind: 'own'; gpu: Gpu; gpuCount: number; ramGB: number; ramBwGBs: number }
  | { kind: 'unified'; device: UnifiedDevice };

export type Estimate = { mode: 'vram' | 'partial' | 'none'; tps: number; needGB: number };

export const effBw = (tg7b: number | null, bandwidthGBs: number) =>
  tg7b !== null ? tg7b * REF_MODEL_GB : bandwidthGBs * FALLBACK_EFF;

export function needGB(model: Model, users: number): number {
  return model.sizeGB * KV_OVERHEAD + (users - 1) * model.sizeGB * KV_PER_USER;
}

export function estimate(system: System, model: Model, engine: EngineId, users: number): Estimate {
  const need = needGB(model, users);
  const isVllm = engine === 'vllm';
  const engineFactor = engines.find((e) => e.id === engine)!.factor;
  const userFactor = 1 / (1 + (isVllm ? 0.05 : 0.15) * (users - 1));
  const moe = model.activeB < model.totalB ? MOE_FACTOR : 1;
  const activeGB = (model.sizeGB * model.activeB) / model.totalB;
  const finish = (mode: Estimate['mode'], raw: number): Estimate => ({
    mode,
    tps: Math.max(1, Math.round(raw * moe * (model.calib ?? 1) * engineFactor * userFactor)),
    needGB: Math.round(need * 10) / 10,
  });

  let vram: number;
  let bw: number;
  let ramFree = 0;
  let ramBw = 0;
  if (system.kind === 'unified') {
    vram = system.device.usableGB;
    bw = effBw(system.device.tg7b, system.device.bandwidthGBs);
  } else {
    vram = system.gpu.vramGB * system.gpuCount - VRAM_RESERVE_GB;
    bw = effBw(system.gpu.tg7b, system.gpu.bandwidthGBs);
    if (system.gpuCount > 1 && isVllm) bw *= 1.6; // tensorinis lygiagretumas
    ramFree = Math.max(0, system.ramGB - OS_RAM_GB);
    ramBw = (system.kind === 'pc' ? system.cpu.ramBwGBs : system.ramBwGBs) * RAM_EFF;
  }

  if (need <= vram) return finish('vram', bw / activeGB);
  if (!isVllm && ramFree > 0 && need <= vram + ramFree) {
    const f = vram / need;
    const seconds = (activeGB * f) / bw + (activeGB * (1 - f)) / ramBw;
    return finish('partial', 1 / seconds);
  }
  return { mode: 'none', tps: 0, needGB: Math.round(need * 10) / 10 };
}
