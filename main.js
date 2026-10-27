// Langai: DUK ir Kontaktai.
(() => {
  const open = (id) => {
    const d = document.getElementById(id);
    if (d && !d.open) d.showModal();
  };
  document.querySelectorAll('[data-open]').forEach((b) =>
    b.addEventListener('click', () => open(b.dataset.open)));
  document.querySelectorAll('dialog').forEach((d) => {
    d.querySelector('[data-close]')?.addEventListener('click', () => d.close());
    // Paspaudus už lango ribų, jis užsidaro.
    d.addEventListener('click', (e) => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) d.close();
    });
  });
  const hash = location.hash.slice(1);
  if (hash === 'duk' || hash === 'kontaktai') open(hash);
})();

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
      done.setAttribute('role', 'status');
      done.tabIndex = -1;
      form.replaceWith(done);
      done.focus();
    } catch {
      const email = document.querySelector('[data-email]')?.textContent || '';
      const phone = document.querySelector('[data-phone]')?.textContent || '';
      status.className = 'status err';
      status.textContent = `Nepavyko išsiųsti. Parašykite ${email} arba skambinkite ${phone}.`;
      btn.disabled = false;
      btn.textContent = label;
      sending = false;
    }
  });
})();
