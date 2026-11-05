// Skaičiuoklė „Kokio kompiuterio reikia AI?“. Greitis ir atmintis skaičiuojami
// tuo pačiu varikliu kaip konfigūratoriuje (src/lib/perf.ts, llama.cpp matavimai).
import { devices } from '../data/catalog.ts';
import type { Device, ModelPreset } from '../data/catalog.ts';
import { gpus, cpus, DGX_SPARK } from '../data/parts.ts';
import type { Model } from '../data/parts.ts';
import { estimate, needGB } from './perf.ts';
import type { System } from './perf.ts';

export const WORDS_PER_TOKEN = 0.6;

export type Row = { device: Device; fits: boolean; tps: number; meets: boolean };
export type Recommendation = { device: Device; macNote: boolean; stationNote: boolean; onRequest: boolean };

const gpu = (id: string) => gpus.find((g) => g.id === id)!;
const cpu = (id: string) => cpus.find((c) => c.id === id)!;
const unified = (id: string, name: string, usableGB: number, bandwidthGBs: number) =>
  ({ kind: 'unified', device: { id, name, usableGB, bandwidthGBs, tg7b: null, priceEur: null } }) as System;

// Kiekvieno skaičiuoklės įrenginio konfigūracija greičio varikliui.
const SYSTEMS: Record<string, System> = {
  rtx5090: { kind: 'pc', gpu: gpu('rtx5090'), gpuCount: 1, cpu: cpu('r9-9950x'), ramGB: 96 },
  'dgx-spark': { kind: 'unified', device: DGX_SPARK },
  rtx5090x2: { kind: 'pc', gpu: gpu('rtx5090'), gpuCount: 2, cpu: cpu('tr-9960x'), ramGB: 128 },
  rtxpro6000: { kind: 'pc', gpu: gpu('rtxpro6000'), gpuCount: 1, cpu: cpu('r9-9950x'), ramGB: 192 },
  'dgx-station': unified('dgx-station', 'DGX Station', 270, 8000),
  'mac-m4max': unified('mac-m4max', 'Mac Studio M4 Max', 96, 546),
  'mac-m3ultra': unified('mac-m3ultra', 'Mac Studio M3 Ultra', 384, 819),
};

const asModel = (m: ModelPreset): Model => ({
  id: m.id, name: m.label, sizeGB: m.sizeGB, totalB: m.paramsB, activeB: m.activeB, uncensored: false,
});

export function memoryNeededGB(model: ModelPreset, users: number): number {
  return Math.round(needGB(asModel(model), users) * 10) / 10;
}

// Skaičiuoklė lygina tik tai, kas telpa į vaizdo plokštės / bendrą atmintį.
export function tokensPerSecond(device: Device, model: ModelPreset, users: number): number {
  const e = estimate(SYSTEMS[device.id], asModel(model), 'llamacpp', users);
  return e.mode === 'vram' ? e.tps : 0;
}

export function evaluate(model: ModelPreset, targetTps: number, users: number): Row[] {
  return [...devices]
    .sort((a, b) => a.tier - b.tier)
    .map((device) => {
      const tps = tokensPerSecond(device, model, users);
      const fits = tps > 0;
      return { device, fits, tps, meets: fits && tps >= targetTps };
    });
}

export function recommend(rows: Row[]): Recommendation {
  const sold = rows.filter((r) => r.device.sold && !r.device.onRequest);
  const fastest = (list: Row[]) => list.reduce((a, b) => (b.tps > a.tps ? b : a));

  const meeting = sold.filter((r) => r.meets);
  if (meeting.length) {
    const best = meeting.reduce((a, b) => (b.device.tier < a.device.tier ? b : a));
    return { device: best.device, macNote: false, stationNote: false, onRequest: false };
  }
  const fitting = sold.filter((r) => r.fits);
  const macMeets = rows.some((r) => !r.device.sold && r.meets);
  const stationMeets = rows.some((r) => r.device.onRequest && r.meets);
  if (fitting.length) {
    return { device: fastest(fitting).device, macNote: macMeets, stationNote: stationMeets, onRequest: false };
  }
  const station = rows.find((r) => r.device.onRequest)!.device;
  return { device: station, macNote: false, stationNote: false, onRequest: true };
}

export function readingLabel(tps: number): string {
  const words = tps * WORDS_PER_TOKEN;
  if (words < 3) return 'lėčiau nei skaitote';
  if (words <= 6) return 'maždaug kaip skaitote';
  return 'greičiau nei skaitote';
}
