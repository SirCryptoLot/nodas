// Kontaktų forma: patikrina užklausą ir išsiunčia ją el. paštu per Resend.

const PLANS = {
  idiegimas: 'AI įdiegimas',
  'dgx-spark': 'DGX Spark',
  rtx5090: 'AI kompiuteris RTX 5090',
  rtx5090x2: 'AI kompiuteris 2× RTX 5090',
  rtxpro6000: 'AI darbo stotis RTX PRO 6000',
  'dgx-station': 'DGX Station',
  'verslo-serveris': 'Verslo AI serveris',
  palaikymas: 'Palaikymas',
  necenzuruotas: 'Necenzūruotas modelis',
  nezinau: 'Nežinau',
};

const str = (v) => (typeof v === 'string' ? v.trim() : '');

export function validate(body) {
  const b = body && typeof body === 'object' ? body : {};
  const data = {
    name: str(b.name),
    contact: str(b.contact),
    plan: str(b.plan) || 'nezinau',
    topic: str(b.topic),
    message: str(b.message),
  };
  if (!data.name || data.name.length > 100) return { ok: false };
  if (!data.contact || data.contact.length > 200) return { ok: false };
  if (!Object.hasOwn(PLANS, data.plan)) return { ok: false };
  if (data.topic.length > 300) return { ok: false };
  if (data.message.length > 2000) return { ok: false };
  return { ok: true, data };
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseBody(raw) {
  if (raw && typeof raw === 'object') return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return null;
}

// Paprastas limitas: iki 5 užklausų per 10 min. iš vieno IP.
// Atmintis gyvena tik vienoje funkcijos instancijoje, todėl tai apsauga nuo paprasto šlamšto, ne nuo rimtos atakos.
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

export function _resetRateLimit() {
  hits.clear();
}

function rateLimited(req) {
  const fwd = req.headers?.['x-forwarded-for'];
  const ip = (typeof fwd === 'string' && fwd.split(',')[0].trim()) || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const body = parseBody(req.body);
  if (!body) return res.status(400).json({ ok: false, error: 'invalid' });

  // Botai užpildo paslėptą lauką: apsimetame, kad viskas gerai, bet nieko nesiunčiame.
  if (body.website) return res.status(200).json({ ok: true });

  if (rateLimited(req)) return res.status(429).json({ ok: false, error: 'rate' });

  const v = validate(body);
  if (!v.ok) return res.status(400).json({ ok: false, error: 'invalid' });

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    return res.status(500).json({ ok: false, error: 'config' });
  }

  const { name, contact, plan, topic, message } = v.data;
  const rows = [
    ['Vardas', name],
    ['Kontaktas', contact],
    ['Paketas', PLANS[plan]],
    ...(topic ? [['Tema', topic]] : []),
    ['Žinutė', message || '—'],
  ];
  const html = rows
    .map(([k, val]) => `<p><b>${k}:</b><br>${escapeHtml(val).replace(/\n/g, '<br>')}</p>`)
    .join('');

  const email = {
    from: CONTACT_FROM,
    to: CONTACT_TO,
    subject: `Nauja užklausa: ${PLANS[plan]}`,
    html,
  };
  // Atsakymo adresas tik tada, kai laukas yra vienas aiškus el. paštas, kitaip Resend atmestų laišką.
  if (/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(contact)) email.reply_to = contact;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'send' });
  } catch {
    return res.status(502).json({ ok: false, error: 'send' });
  }

  return res.status(200).json({ ok: true });
}
