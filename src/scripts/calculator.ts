// Skaičiuoklės atnaujinimas naršyklėje.
import { calcView, rowStatus } from '../lib/calcView';

const SPEC_LABELS: [string, 'gpu' | 'cpu' | 'ram' | 'disk' | 'psu'][] = [
  ['Vaizdo plokštė', 'gpu'], ['Procesorius', 'cpu'], ['Atmintis', 'ram'], ['Diskas', 'disk'], ['Maitinimas', 'psu'],
];

function el<T extends Element>(root: Element, name: string): T | null {
  return root.querySelector<T>(`[data-out="${name}"]`);
}

function update(root: HTMLElement) {
  const compact = root.dataset.compact === 'true';
  const form = root.querySelector('form')!;
  const data = new FormData(form);
  const model = String(data.get('model') ?? '32b');
  const tps = Number(data.get('tps') ?? 20);
  const users = Number(data.get('users') ?? 1);
  const v = calcView(model, tps, users, compact);

  el(root, 'tps')!.textContent = String(tps);
  el(root, 'reading')!.textContent = v.reading;
  el(root, 'memory')!.textContent = String(v.memory);

  const tbody = el<HTMLTableSectionElement>(root, 'rows')!;
  tbody.replaceChildren(...v.rows.map((r) => {
    const tr = document.createElement('tr');
    if (r.device.id === v.rec.device.id) tr.className = 'is-rec';
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = r.device.name;
    if (!r.device.sold) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = 'tik palyginimui';
      th.append(tag);
    }
    const td = document.createElement('td');
    const st = rowStatus(r);
    td.textContent = st.text;
    if (st.cls) td.className = st.cls;
    tr.append(th, td);
    return tr;
  }));

  el(root, 'rec-name')!.textContent = v.rec.device.name;
  el(root, 'rec-note')!.textContent = v.note;

  const specEl = el<HTMLDListElement>(root, 'rec-spec');
  if (specEl) {
    specEl.replaceChildren(...SPEC_LABELS.flatMap(([label, key]) => {
      const val = v.rec.device.spec[key];
      if (!val) return [];
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = val;
      return [dt, dd];
    }));
  }
  el<HTMLAnchorElement>(root, 'cta')!.href = v.cta;
}

export function initCalculators() {
  document.querySelectorAll<HTMLElement>('[data-calc]').forEach((root) => {
    const form = root.querySelector('form')!;
    form.addEventListener('input', () => update(root));
    form.addEventListener('submit', (e) => e.preventDefault());
    update(root);
  });
}
