// Skaičiuoklė „Kokio kompiuterio reikia AI?“. Apytiksliai įvertinimai:
// atmintis pagal modelio dydį, greitis pagal atminties pralaidumą.
import { devices } from '../data/catalog.ts';
import type { Device, ModelPreset } from '../data/catalog.ts';

export const BYTES_PER_PARAM = 0.5625; // ~4,5 bito parametrui (4 bitų kvantizacija)
export const OVERHEAD = 1.2; // kontekstas ir darbinė atmintis
export const EFFICIENCY = 0.55; // kiek pralaidumo realiai išnaudojama
export const KV_PER_USER_PER_B = 0.02; // papildoma atmintis kiekvienam vartotojui
export const WORDS_PER_TOKEN = 0.6;

export type Row = { device: Device; fits: boolean; tps: number; meets: boolean };
export type Recommendation = { device: Device; macNote: boolean; onRequest: boolean };

export function memoryNeededGB(model: ModelPreset, users: number): number {
  const gb = model.paramsB * BYTES_PER_PARAM * OVERHEAD + (users - 1) * model.paramsB * KV_PER_USER_PER_B;
  return Math.round(gb * 10) / 10;
}

export function tokensPerSecond(device: Device, model: ModelPreset, users: number): number {
  const single = (EFFICIENCY * device.bandwidthGBs) / (model.activeB * BYTES_PER_PARAM);
  return Math.round(single / (1 + 0.15 * (users - 1)));
}

export function evaluate(model: ModelPreset, targetTps: number, users: number): Row[] {
  const need = memoryNeededGB(model, users);
  return [...devices]
    .sort((a, b) => a.tier - b.tier)
    .map((device) => {
      const fits = need <= device.usableGB;
      const tps = fits ? tokensPerSecond(device, model, users) : 0;
      return { device, fits, tps, meets: fits && tps >= targetTps };
    });
}

export function recommend(rows: Row[]): Recommendation {
  const sold = rows.filter((r) => r.device.sold && !r.device.onRequest);
  const fastest = (list: Row[]) => list.reduce((a, b) => (b.tps > a.tps ? b : a));

  const meeting = sold.filter((r) => r.meets);
  if (meeting.length) {
    const best = meeting.reduce((a, b) => (b.device.tier < a.device.tier ? b : a));
    return { device: best.device, macNote: false, onRequest: false };
  }
  const fitting = sold.filter((r) => r.fits);
  const macMeets = rows.some((r) => !r.device.sold && r.meets);
  if (fitting.length) {
    return { device: fastest(fitting).device, macNote: macMeets, onRequest: false };
  }
  const station = rows.find((r) => r.device.onRequest)!.device;
  return { device: station, macNote: false, onRequest: true };
}

export function readingLabel(tps: number): string {
  const words = tps * WORDS_PER_TOKEN;
  if (words < 3) return 'lėčiau nei skaitote';
  if (words <= 6) return 'maždaug kaip skaitote';
  return 'greičiau nei skaitote';
}
