// Konfigūratorius naršyklėje: skaito pasirinkimus, perskaičiuoja greitį ir kainą,
// užpildo užklausos formos lauką „config“.
import { presets, goals, cpus } from '../data/parts';
import type { EngineId } from '../data/parts';
import { defaultConfig, quote, results, configText, eur, modeText } from '../lib/quote';
import type { Config } from '../lib/quote';

const FIT = { vram: 'telpa', partial: 'dalinai RAM', none: 'netelpa' } as const;

function setRadio(form: HTMLFormElement, name: string, value: string) {
  const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
  if (el) el.checked = true;
}
function setChecks(form: HTMLFormElement, name: string, values: string[]) {
  form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`).forEach((el) => { el.checked = values.includes(el.value); });
}

function read(form: HTMLFormElement): Config {
  const d = new FormData(form);
  const base = defaultConfig();
  return {
    goal: String(d.get('goal') ?? base.goal),
    hw: String(d.get('hw') ?? 'pc') as Config['hw'],
    gpuId: String(d.get('gpuId') ?? base.gpuId),
    gpuCount: Number(d.get('gpuCount') ?? 1),
    cpuId: String(d.get('cpuId') ?? base.cpuId),
    ramGB: Number(d.get('ramGB') ?? base.ramGB),
    os: String(d.get('os') ?? base.os),
    engine: String(d.get('engine') ?? base.engine) as EngineId,
    ui: String(d.get('ui') ?? base.ui),
    agents: d.getAll('agents').map(String),
    models: d.getAll('models').map(String),
    support: String(d.get('support') ?? 'none') as Config['support'],
    users: Number(d.get('users') ?? 1),
  };
}

function li(left: string, right: string, cls = '') {
  const item = document.createElement('li');
  const a = document.createElement('span');
  a.textContent = left;
  const b = document.createElement(cls ? 'b' : 'span');
  b.textContent = right;
  if (cls) b.className = cls;
  item.append(a, b);
  return item;
}

function render(root: HTMLElement, form: HTMLFormElement) {
  const cfg = read(form);
  root.querySelectorAll<HTMLElement>('[data-show]').forEach((el) => {
    el.hidden = !el.dataset.show!.split(' ').includes(cfg.hw);
  });
  const cpuSelect = form.elements.namedItem('cpuId') as HTMLSelectElement;
  cpuSelect.disabled = cfg.gpuCount > 1;
  const cpuNote = root.querySelector('[data-out="cpu-note"]')!;
  cpuNote.textContent = cfg.gpuCount > 1 ? 'Dviem plokštėms parenkame AMD Threadripper platformą.' : '';

  const res = results(cfg);
  const allFit = results({ ...cfg, models: [...form.querySelectorAll<HTMLInputElement>('input[name="models"]')].map((i) => i.value) });
  allFit.forEach((r) => {
    const el = root.querySelector(`[data-fit="${r.model.id}"]`);
    if (el) { el.textContent = FIT[r.estimate.mode]; el.className = `fit ${r.estimate.mode}`; }
  });

  const out = (n: string) => root.querySelector<HTMLElement>(`[data-out="${n}"]`)!;
  out('results').replaceChildren(...(res.length
    ? res.map((r) => li(r.model.name, modeText(r.estimate), r.estimate.mode))
    : [li('Pasirinkite bent vieną modelį', '')]));
  const q = quote(cfg);
  out('lines').replaceChildren(...q.lines.map((l) => li(l.label, l.eur === null ? 'pagal užklausą' : eur(l.eur))));
  out('total').textContent = `~${eur(q.oneOff)}`;
  out('unknown').textContent = q.unknown.length ? '+ dalys pagal užklausą' : '';
  out('monthly').textContent = q.monthly ? `+ palaikymas ${q.monthly} €/mėn.` : '';

  const config = document.querySelector<HTMLInputElement>('#forma input[name="config"]');
  if (config) config.value = configText(cfg);
}

export function initConfigurator() {
  const root = document.querySelector<HTMLElement>('[data-cfg]');
  if (!root) return;
  const form = root.querySelector<HTMLFormElement>('.cfg-form')!;
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'goal') {
      const g = goals.find((x) => x.id === t.value)!;
      setRadio(form, 'preset', g.preset);
      setChecks(form, 'models', g.models);
      applyPreset(form, g.preset);
    } else if (t.name === 'preset') {
      applyPreset(form, t.value);
    } else if (t.name === 'cpuId') {
      const c = cpus.find((x) => x.id === t.value);
      if (c?.ramType === 'DDR4' && Number(new FormData(form).get('ramGB')) > 128) setRadio(form, 'ramGB', '128');
    }
    render(root, form);
  });
  form.addEventListener('input', () => render(root, form));
  render(root, form);
}

function applyPreset(form: HTMLFormElement, id: string) {
  const p = presets.find((x) => x.id === id);
  if (!p) return;
  setRadio(form, 'engine', p.engine);
  setRadio(form, 'ui', p.ui);
  setChecks(form, 'agents', p.agents);
}
