// Konfigūratoriaus būsena, apytikslė kaina, greičio įvertinimai ir užklausos tekstas.
import {
  gpus, cpus, models, engines, operatingSystems, interfaces, agents,
  ramPrices, BASE_PRICES, DGX_SPARK, INSTALL_PRICES, ASSEMBLY_PRICE,
} from '../data/parts.ts';
import type { EngineId, Level, Model } from '../data/parts.ts';
import { services } from '../data/catalog.ts';
import { estimate } from './perf.ts';
import type { System, Estimate } from './perf.ts';

export type Config = {
  goal: string;
  hw: 'pc' | 'dgx' | 'own';
  gpuId: string;
  gpuCount: number;
  cpuId: string;
  ramGB: number;
  os: string;
  engine: EngineId;
  ui: string;
  agents: string[];
  models: string[];
  support: 'none' | 'namams' | 'verslui';
  users: number;
};

export const OWN_RAM_BW = 60; // kai klientas naudoja savo kompiuterį, procesoriaus nežinome
const WORKSTATION_CPU = 'tr-9960x';

export function defaultConfig(): Config {
  return {
    goal: 'pokalbiai', hw: 'pc', gpuId: 'rtx5070ti', gpuCount: 1, cpuId: 'r7-9700x', ramGB: 32,
    os: 'windows11', engine: 'ollama', ui: 'open-webui', agents: [], models: ['qwen3-8b', 'gemma3-12b'],
    support: 'none', users: 1,
  };
}

const gpuOf = (cfg: Config) => gpus.find((g) => g.id === cfg.gpuId) ?? gpus[0];
export const cpuOf = (cfg: Config) =>
  cpus.find((c) => c.id === (cfg.gpuCount > 1 ? WORKSTATION_CPU : cfg.cpuId)) ?? cpus[0];

export function resolveSystem(cfg: Config): System {
  if (cfg.hw === 'dgx') return { kind: 'unified', device: DGX_SPARK };
  if (cfg.hw === 'own') return { kind: 'own', gpu: gpuOf(cfg), gpuCount: cfg.gpuCount, ramGB: cfg.ramGB, ramBwGBs: OWN_RAM_BW };
  return { kind: 'pc', gpu: gpuOf(cfg), gpuCount: cfg.gpuCount, cpu: cpuOf(cfg), ramGB: cfg.ramGB };
}

const LEVEL_ORDER: Level[] = ['paprasciausias', 'programuotojui', 'agentas'];
export function softwareLevel(cfg: Config): Level {
  let level = 0;
  if (cfg.engine === 'vllm') level = 2;
  for (const id of cfg.agents) {
    const a = agents.find((x) => x.id === id);
    if (a) level = Math.max(level, LEVEL_ORDER.indexOf(a.level));
  }
  return LEVEL_ORDER[level];
}

export type QuoteLine = { label: string; eur: number | null };
export type Quote = { lines: QuoteLine[]; oneOff: number; unknown: string[]; monthly: number };

const LEVEL_NAMES: Record<Level, string> = {
  paprasciausias: 'Paprasčiausias', programuotojui: 'Programuotojui', agentas: 'Agentas',
};

export function quote(cfg: Config): Quote {
  const lines: QuoteLine[] = [];
  if (cfg.hw === 'pc') {
    const g = gpuOf(cfg);
    const c = cpuOf(cfg);
    const count = cfg.gpuCount > 1 ? 2 : 1;
    lines.push({ label: `${count > 1 ? '2× ' : ''}${g.name}`, eur: g.priceEur === null ? null : g.priceEur * count });
    lines.push({ label: c.name, eur: c.priceEur });
    lines.push({ label: `${cfg.ramGB} GB ${c.ramType} RAM`, eur: ramPrices[c.ramType][cfg.ramGB] ?? null });
    lines.push({ label: c.platform === 'workstation' ? 'Bazė (darbo stotis)' : 'Bazė (plokštė, diskas, maitinimas, korpusas)', eur: BASE_PRICES[c.platform] });
    lines.push({ label: 'Surinkimas ir išbandymas', eur: ASSEMBLY_PRICE });
  } else if (cfg.hw === 'dgx') {
    lines.push({ label: DGX_SPARK.name, eur: DGX_SPARK.priceEur });
  }
  const level = softwareLevel(cfg);
  lines.push({ label: `AI diegimas: ${LEVEL_NAMES[level]}`, eur: INSTALL_PRICES[level] });

  const oneOff = Math.round(lines.reduce((s, l) => s + (l.eur ?? 0), 0) * 100) / 100;
  const unknown = lines.filter((l) => l.eur === null).map((l) => l.label);
  const support = cfg.support === 'none' ? null : services.find((s) => s.slug === `palaikymas-${cfg.support}`);
  return { lines, oneOff, unknown, monthly: support ? support.priceFrom : 0 };
}

export type ModelResult = { model: Model; estimate: Estimate };
export function results(cfg: Config): ModelResult[] {
  const sys = resolveSystem(cfg);
  return cfg.models
    .map((id) => models.find((m) => m.id === id))
    .filter((m): m is Model => !!m)
    .map((model) => ({ model, estimate: estimate(sys, model, cfg.engine, cfg.users) }));
}

const name = <T extends { id: string; name: string }>(list: T[], id: string) => list.find((x) => x.id === id)?.name ?? id;
export const eur = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
export const modeText = (e: Estimate) =>
  e.mode === 'none' ? 'netelpa' : `~${e.tps} tok/s${e.mode === 'partial' ? ' (dalis RAM)' : ''}`;

export function configText(cfg: Config): string {
  const q = quote(cfg);
  const hw = cfg.hw === 'dgx'
    ? DGX_SPARK.name
    : cfg.hw === 'own'
      ? `Savas kompiuteris: ${cfg.gpuCount > 1 ? '2× ' : ''}${gpuOf(cfg).name}, ${cfg.ramGB} GB RAM`
      : `${cfg.gpuCount > 1 ? '2× ' : ''}${gpuOf(cfg).name}, ${cpuOf(cfg).name}, ${cfg.ramGB} GB RAM`;
  const out = [
    `Įranga: ${hw}`,
    `Operacinė sistema: ${name(operatingSystems, cfg.os)}`,
    `Variklis: ${name(engines, cfg.engine)}`,
    `Sąsaja: ${name(interfaces, cfg.ui)}`,
    `Agentai: ${cfg.agents.length ? cfg.agents.map((a) => name(agents, a)).join(', ') : 'nėra'}`,
    `Vartotojų: ${cfg.users}`,
    'Modeliai:',
    ...results(cfg).map((r) => `- ${r.model.name}: ${modeText(r.estimate)}`),
    ...q.lines.map((l) => `${l.label}: ${l.eur === null ? 'pagal užklausą' : eur(l.eur)}`),
    `Apytikslė kaina: ~${eur(q.oneOff)}${q.unknown.length ? ' + dalys pagal užklausą' : ''}`,
    q.monthly ? `Palaikymas: ${q.monthly} €/mėn.` : 'Palaikymas: nepasirinktas',
  ];
  return out.join('\n').slice(0, 3000);
}
