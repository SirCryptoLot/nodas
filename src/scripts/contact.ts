// Užklausos forma: užpildymas iš nuorodos (?plan=, ?tema=) ir siuntimas.
export function initContactForm() {
  const form = document.getElementById('forma') as HTMLFormElement | null;
  if (!form) return;
  const btn = document.getElementById('forma-siusti') as HTMLButtonElement;
  const status = document.getElementById('forma-zinute')!;
  const select = form.elements.namedItem('plan') as HTMLSelectElement;
  const topicInput = form.elements.namedItem('topic') as HTMLInputElement;

  const params = new URLSearchParams(location.search);
  const plan = params.get('plan');
  select.value = plan && [...select.options].some((o) => o.value === plan) ? plan : 'nezinau';
  const tema = (params.get('tema') ?? '').trim().slice(0, 300);
  if (tema) {
    topicInput.value = tema;
    const line = form.querySelector<HTMLElement>('[data-topic-line]')!;
    form.querySelector('[data-topic-text]')!.textContent = tema;
    line.hidden = false;
  }

  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!form.checkValidity()) {
      status.className = 'form-status err';
      status.textContent = 'Įrašykite vardą ir el. paštą arba telefoną.';
      form.querySelector<HTMLElement>(':invalid')?.focus();
      return;
    }
    sending = true;
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = 'Siunčiama…';
    status.className = 'form-status';
    status.textContent = '';

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || !body.ok) throw new Error('send');
      const done = document.createElement('p');
      done.className = 'form-done';
      done.setAttribute('role', 'status');
      done.tabIndex = -1;
      done.textContent = 'Ačiū! Gavome jūsų užklausą ir atsakysime kuo greičiau.';
      form.replaceWith(done);
      done.focus();
    } catch {
      const email = document.querySelector('[data-email]')?.textContent ?? '';
      const phone = document.querySelector('[data-phone]')?.textContent ?? '';
      status.className = 'form-status err';
      status.textContent = `Nepavyko išsiųsti. Parašykite ${email} arba skambinkite ${phone}.`;
      btn.disabled = false;
      btn.textContent = label;
      sending = false;
    }
  });
}
