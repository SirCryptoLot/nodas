// Skaičiuoklės rodinio būsena: tą pačią funkciją naudoja serveris (pradinis vaizdas) ir naršyklė.
import { models } from '../data/catalog.ts';
import { evaluate, recommend, memoryNeededGB, readingLabel } from './calc.ts';
import type { Row, Recommendation } from './calc.ts';

export const COMPACT_IDS = ['dgx-spark', 'mac-m3ultra'];

export type CalcView = {
  memory: number;
  reading: string;
  rows: Row[];
  rec: Recommendation;
  note: string;
  cta: string;
};

export function recNote(rec: Recommendation): string {
  if (rec.onRequest) return 'Tiekiama tik pagal užklausą.';
  const parts: string[] = [];
  if (rec.stationNote) parts.push('Norimą greitį pasiektų tik DGX Station (tiekiama pagal užklausą).');
  if (rec.macNote) parts.push('Mac Studio irgi tiktų, bet jo neparduodame.');
  return parts.join(' ');
}

export function calcView(modelId: string, tps: number, users: number, compact = false): CalcView {
  const model = models.find((m) => m.id === modelId) ?? models[1];
  const all = evaluate(model, tps, users);
  const rec = recommend(all);
  const rows = compact
    ? all.filter((r) => r.device.id === rec.device.id || COMPACT_IDS.includes(r.device.id))
    : all;
  const tema = `Skaičiuoklė: ${model.label}, ${tps} tok/s, ${users} vart.`;
  return {
    memory: memoryNeededGB(model, users),
    reading: readingLabel(tps),
    rows,
    rec,
    note: recNote(rec),
    cta: `/kontaktai?plan=${rec.device.id}&tema=${encodeURIComponent(tema)}`,
  };
}

export function rowStatus(r: Row): { text: string; cls: string } {
  if (!r.fits) return { text: 'netelpa', cls: 'no' };
  return { text: `~${r.tps} tok/s${r.meets ? ' ✓' : ''}`, cls: r.meets ? 'ok' : '' };
}
