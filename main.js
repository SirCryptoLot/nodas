// Kontaktų formos siuntimas.
(() => {
  const form = document.getElementById('forma');
  if (!form) return;
  const btn = document.getElementById('forma-siusti');
  const status = document.getElementById('forma-zinute');
  let sending = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;

    if (!form.checkValidity()) {
      status.className = 'status err';
      status.textContent = 'Įrašykite vardą ir el. paštą arba telefoną.';
      form.querySelector(':invalid')?.focus();
      return;
    }

    sending = true;
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = 'Siunčiama…';
    status.className = 'status';
    status.textContent = '';

    const data = Object.fromEntries(new FormData(form));
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || !body.ok) throw new Error('send');

      const done = document.createElement('p');
      done.className = 'done';
      done.textContent = 'Ačiū! Atsakysime kuo greičiau.';
      form.replaceWith(done);
    } catch {
      const email = document.querySelector('[data-email]')?.textContent || '';
      status.className = 'status err';
      status.textContent = `Nepavyko išsiųsti. Parašykite mums: ${email}`;
      btn.disabled = false;
      btn.textContent = label;
      sending = false;
    }
  });
})();
