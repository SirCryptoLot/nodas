import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM ?? 'nodas.lt <info@nodas.lt>'
const ADMIN_EMAIL = 'info@nodas.lt'
const SITE_URL = 'https://nodas.lt'

// ── Base layout ────────────────────────────────────────────────────────────

function layout(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="lt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>nodas.lt</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}&nbsp;&zwnj;</div>` : ''}

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:16px 16px 0 0;padding:28px 36px;text-align:center">
    <div style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">nodas<span style="color:#93c5fd">.lt</span></div>
    <div style="font-size:12px;color:#bfdbfe;margin-top:4px;letter-spacing:1px;text-transform:uppercase">IT paslaugos · Web kūrimas</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0">
    ${content}
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:24px 36px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:12px;color:#64748b;line-height:1.6">
          <strong style="color:#374151">nodas.lt</strong> — IT paslaugos Lietuvoje<br>
          El. paštas: <a href="mailto:info@nodas.lt" style="color:#2563eb;text-decoration:none">info@nodas.lt</a><br>
          Svetainė: <a href="${SITE_URL}" style="color:#2563eb;text-decoration:none">nodas.lt</a>
        </td>
        <td align="right" style="font-size:11px;color:#94a3b8;vertical-align:top">
          © ${new Date().getFullYear()} nodas.lt
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
}

// ── Helpers ────────────────────────────────────────────────────────────────

function btn(url: string, text: string, color = '#2563eb') {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0">
    <tr><td style="background:${color};border-radius:10px">
      <a href="${url}" style="display:block;padding:14px 28px;color:#fff;font-size:15px;font-weight:700;text-decoration:none;text-align:center">${text}</a>
    </td></tr>
  </table>`
}

function badge(text: string, color = '#dbeafe', textColor = '#1e40af') {
  return `<span style="display:inline-block;background:${color};color:${textColor};padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700">${text}</span>`
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;white-space:nowrap;vertical-align:top;width:140px">${label}</td>
    <td style="padding:10px 14px;font-size:13px;color:#0f172a;border-left:2px solid #f1f5f9">${value}</td>
  </tr>`
}

function infoTable(rows: [string, string][]) {
  return `<table cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin:20px 0;overflow:hidden">
    <tbody>${rows.map(([l, v]) => infoRow(l, v)).join('')}</tbody>
  </table>`
}

function notesBox(notes: string) {
  if (!notes.trim()) return ''
  const lines = notes.split('\n').filter(Boolean)
  return `<div style="background:#f0f9ff;border:1px solid #bae6fd;border-left:4px solid #0ea5e9;border-radius:8px;padding:16px 18px;margin:20px 0">
    <div style="font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">📋 Užsakymo detalės</div>
    ${lines.map(l => `<div style="font-size:13px;color:#0c4a6e;margin-bottom:6px;line-height:1.5">${l}</div>`).join('')}
  </div>`
}

function steps(items: { icon: string; title: string; desc: string }[]) {
  return `<div style="margin:24px 0">
    ${items.map((item, i) => `
      <div style="display:flex;align-items:flex-start;margin-bottom:16px">
        <div style="width:32px;height:32px;background:#eff6ff;border:2px solid #bfdbfe;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;margin-right:14px;text-align:center;line-height:32px">${item.icon}</div>
        <div style="padding-top:4px">
          <div style="font-size:13px;font-weight:700;color:#0f172a">${i + 1}. ${item.title}</div>
          <div style="font-size:12px;color:#64748b;margin-top:2px">${item.desc}</div>
        </div>
      </div>
    `).join('')}
  </div>`
}

// ── Welcome email ──────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM, to,
    subject: '👋 Sveiki atvykę į nodas.lt — jūsų paskyra aktyvi!',
    html: layout(`
      <h1 style="font-size:26px;font-weight:900;color:#0f172a;margin:0 0 8px">Sveiki, ${name}! 👋</h1>
      <p style="font-size:15px;color:#64748b;margin:0 0 24px">Džiaugiamės, kad prisijungėte. Jūsų paskyra sukurta ir paruošta naudojimui.</p>

      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:8px">✅ Paskyra aktyvi ir paruošta</div>
        <div style="font-size:13px;color:#15803d">Galite užsakyti paslaugas, peržiūrėti statusą ir bendrauti su komanda tiesiogiai per paskyrą.</div>
      </div>

      <p style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 12px">Ką galite daryti?</p>
      ${steps([
        { icon: '🔧', title: 'Užsakyti paslaugą', desc: 'Web remontas, SEO, Custom Dev, AI sprendimai ir dar daugiau' },
        { icon: '📋', title: 'Sekti užsakymo statusą', desc: 'Realaus laiko atnaujinimai — žinosite kas vyksta' },
        { icon: '💬', title: 'Susisiekti', desc: 'info@nodas.lt — atsakome per 24 val.' },
      ])}

      ${btn(`${SITE_URL}/dashboard/orders/new`, '🚀 Pradėti pirmą užsakymą →')}

      <p style="font-size:13px;color:#94a3b8;margin:0">Klausimų? Rašykite <a href="mailto:info@nodas.lt" style="color:#2563eb">info@nodas.lt</a></p>
    `, `Sveiki atvykę į nodas.lt, ${name}! Jūsų paskyra paruošta.`),
  })
}

// ── Order confirmation (client) ────────────────────────────────────────────

export async function sendOrderConfirmEmail(
  to: string,
  name: string,
  serviceType: string,
  notes = '',
  orderId = '',
) {
  const serviceIcon: Record<string, string> = {
    'Web Remontas': '🔧', 'AI Svetainė': '🤖', 'WordPress / CMS': '📦',
    'Custom Dev': '⚡', 'Web SPA priežiūra': '🛡️', 'AI Sprendimai': '🧠',
    'SEO': '🔍', 'Serverių diegimas': '🖥️', 'El. parduotuvė': '🛒',
  }
  const icon = serviceIcon[serviceType] ?? '📋'

  await resend.emails.send({
    from: FROM, to,
    subject: `${icon} Užsakymas gautas — ${serviceType} | nodas.lt`,
    html: layout(`
      <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">${icon}</div>
        <div style="font-size:20px;font-weight:900;color:#166534">Užsakymas gautas!</div>
        <div style="font-size:13px;color:#15803d;margin-top:4px">Gavome jūsų užklausą ir jau dirbame</div>
      </div>

      <p style="font-size:16px;color:#0f172a;margin:0 0 20px">Sveiki, <strong>${name}</strong>!</p>
      <p style="font-size:14px;color:#475569;margin:0 0 20px;line-height:1.7">
        Jūsų užsakymas sėkmingai pateiktas. Komanda susisieks su jumis <strong>per 24 valandas</strong> aptarti detalių ir tolimesnių žingsnių.
      </p>

      ${infoTable([
        ['Paslauga', `${icon} ${serviceType}`],
        ['Statusas', `${badge('Laukiama patvirtinimo', '#fef9c3', '#854d0e')}`],
        ['Atsakysime iki', `${new Date(Date.now() + 24 * 3600 * 1000).toLocaleDateString('lt-LT', { weekday: 'long', month: 'long', day: 'numeric' })}`],
        ...(orderId ? [['Užsakymo Nr.', `#${orderId.slice(0, 8).toUpperCase()}`] as [string, string]] : []),
      ])}

      ${notesBox(notes)}

      <p style="font-size:14px;font-weight:700;color:#0f172a;margin:24px 0 12px">Kas toliau?</p>
      ${steps([
        { icon: '📞', title: 'Susisieksime per 24h', desc: 'Komandos narys peržiūrės jūsų užklausą ir susisieks aptarti detalių' },
        { icon: '📝', title: 'Gausite pasiūlymą', desc: 'Pateiksite tikslią kainą ir terminus — be jokių netikėtumų' },
        { icon: '🚀', title: 'Pradedame darbą', desc: 'Patvirtinus, pradedame vykdyti ir informuojame kiekviename žingsnyje' },
      ])}

      ${btn(`${SITE_URL}/dashboard/orders`, '📋 Peržiūrėti užsakymą →')}

      <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;margin-top:24px">
        <div style="font-size:12px;color:#64748b;line-height:1.6">
          💬 <strong>Klausimų?</strong> Rašykite <a href="mailto:info@nodas.lt" style="color:#2563eb;text-decoration:none">info@nodas.lt</a> — atsakome per 24 val.<br>
          📱 Arba skambinkite — kontaktai <a href="${SITE_URL}#kontaktai" style="color:#2563eb;text-decoration:none">nodas.lt</a>
        </div>
      </div>
    `, `Jūsų ${serviceType} užsakymas gautas. Susisieksime per 24 val.`),
  })
}

// ── Order status change (client) ───────────────────────────────────────────

export async function sendOrderStatusEmail(
  to: string,
  name: string,
  serviceType: string,
  status: string,
  notes = '',
  clientComment = '',
) {
  const statusMap: Record<string, { icon: string; label: string; color: string; bg: string; msg: string }> = {
    in_progress: { icon: '⚙️', label: 'Vykdoma', color: '#1e40af', bg: '#dbeafe', msg: 'Komanda pradėjo dirbti su jūsų užsakymu.' },
    done:        { icon: '✅', label: 'Atlikta', color: '#166534', bg: '#dcfce7', msg: 'Darbas atliktas! Tikimės, kad viską įvertinsite teigiamai.' },
    cancelled:   { icon: '❌', label: 'Atšaukta', color: '#991b1b', bg: '#fee2e2', msg: 'Jūsų užsakymas atšauktas. Klausimų — rašykite info@nodas.lt.' },
  }
  const s = statusMap[status] ?? { icon: '📋', label: status, color: '#374151', bg: '#f1f5f9', msg: 'Jūsų užsakymo statusas atnaujintas.' }

  await resend.emails.send({
    from: FROM, to,
    subject: `${s.icon} Užsakymo statusas: ${s.label} — ${serviceType}`,
    html: layout(`
      <div style="background:${s.bg};border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center">
        <div style="font-size:36px;margin-bottom:8px">${s.icon}</div>
        <div style="font-size:18px;font-weight:900;color:${s.color}">${s.label}</div>
      </div>

      <p style="font-size:16px;color:#0f172a;margin:0 0 16px">Sveiki, <strong>${name}</strong>!</p>
      <p style="font-size:14px;color:#475569;margin:0 0 20px;line-height:1.7">${s.msg}</p>

      ${infoTable([
        ['Paslauga', serviceType],
        ['Statusas', `${badge(s.label, s.bg, s.color)}`],
        ['Atnaujinta', new Date().toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })],
      ])}

      ${clientComment ? `
        <div style="background:#f0fdf4;border:1px solid #86efac;border-left:4px solid #22c55e;border-radius:8px;padding:16px 18px;margin:20px 0">
          <div style="font-size:12px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">💬 Žinutė nuo komandos</div>
          <div style="font-size:14px;color:#14532d;line-height:1.7;white-space:pre-wrap">${clientComment}</div>
        </div>
      ` : ''}
      ${notes ? notesBox(notes) : ''}

      ${status === 'done' ? `
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px 18px;margin:20px 0;text-align:center">
          <div style="font-size:14px;font-weight:700;color:#92400e;margin-bottom:6px">⭐ Kaip įvertinote paslaugą?</div>
          <div style="font-size:13px;color:#b45309">Jūsų atsiliepimas padeda mums tobulėti. Rašykite info@nodas.lt</div>
        </div>
      ` : ''}

      ${btn(`${SITE_URL}/dashboard/orders`, '📋 Peržiūrėti užsakymą →')}
    `, `Jūsų ${serviceType} statusas: ${s.label}`),
  })
}

// ── Admin — new order ──────────────────────────────────────────────────────

export async function sendAdminNewOrder(
  serviceType: string,
  userName: string,
  userEmail: string,
  notes = '',
  orderId = '',
) {
  const now = new Date().toLocaleDateString('lt-LT', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  await resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `🔔 Naujas užsakymas: ${serviceType} — ${userName}`,
    html: layout(`
      <div style="background:#eff6ff;border:2px solid #2563eb;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">🔔 Naujas užsakymas</div>
        <div style="font-size:22px;font-weight:900;color:#0f172a">${serviceType}</div>
      </div>

      ${infoTable([
        ['Klientas', `<strong>${userName}</strong>`],
        ['El. paštas', `<a href="mailto:${userEmail}" style="color:#2563eb;text-decoration:none">${userEmail}</a>`],
        ['Paslauga', serviceType],
        ['Pateikta', now],
        ...(orderId ? [['Užsakymo ID', orderId] as [string, string]] : []),
      ])}

      ${notesBox(notes)}

      <div style="display:flex;gap:12px;margin-top:24px">
        ${btn(`${SITE_URL}/admin/orders`, '🛠️ Atidaryti admin →', '#1e40af')}
      </div>

      <div style="background:#fef9c3;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-top:16px">
        <div style="font-size:12px;color:#854d0e">⏰ Rekomenduojama atsakyti per <strong>24 valandas</strong>. Klientas: <a href="mailto:${userEmail}" style="color:#92400e">${userEmail}</a></div>
      </div>
    `, `Naujas ${serviceType} užsakymas nuo ${userName}`),
  })
}

// ── Admin — new user ───────────────────────────────────────────────────────

export async function sendAdminNewUser(userName: string, email: string) {
  await resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `👤 Naujas vartotojas: ${userName} (${email})`,
    html: layout(`
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 20px">👤 Naujas vartotojas</h2>

      ${infoTable([
        ['Vardas', userName],
        ['El. paštas', `<a href="mailto:${email}" style="color:#2563eb">${email}</a>`],
        ['Užsiregistravo', new Date().toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })],
      ])}

      ${btn(`${SITE_URL}/admin/users`, '👥 Peržiūrėti vartotojus →', '#475569')}
    `, `Naujas vartotojas: ${userName}`),
  })
}

// ── Contact form (admin) ───────────────────────────────────────────────────

export async function sendContactEmail(data: {
  name: string; email: string; service: string; message: string
}) {
  await resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `📩 Kontakto užklausa: ${data.service} — ${data.name}`,
    html: layout(`
      <div style="background:#f0f9ff;border:2px solid #0ea5e9;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">📩 Kontakto forma</div>
        <div style="font-size:20px;font-weight:800;color:#0f172a">${data.name}</div>
      </div>

      ${infoTable([
        ['Vardas', `<strong>${data.name}</strong>`],
        ['El. paštas', `<a href="mailto:${data.email}" style="color:#2563eb">${data.email}</a>`],
        ['Paslauga', data.service],
        ['Gauta', new Date().toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })],
      ])}

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 18px;margin:16px 0">
        <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Žinutė</div>
        <div style="font-size:14px;color:#0f172a;line-height:1.7;white-space:pre-wrap">${data.message}</div>
      </div>

      <table cellpadding="0" cellspacing="0" style="margin:24px 0">
        <tr><td style="background:#0ea5e9;border-radius:10px">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.service)} — nodas.lt&body=Sveiki, ${encodeURIComponent(data.name)}!%0A%0A"
            style="display:block;padding:13px 24px;color:#fff;font-size:14px;font-weight:700;text-decoration:none">
            ↩️ Atsakyti ${data.name} →
          </a>
        </td></tr>
      </table>
    `, `Nauja kontakto užklausa nuo ${data.name}: ${data.service}`),
  })
}

// ── Shop order confirm (client) ────────────────────────────────────────────

export async function sendShopOrderConfirmEmail(to: string, total: number, items: string[] = []) {
  await resend.emails.send({
    from: FROM, to,
    subject: `🛒 Pirkimas patvirtintas — €${total} | nodas.lt`,
    html: layout(`
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center">
        <div style="font-size:36px;margin-bottom:8px">🛒</div>
        <div style="font-size:20px;font-weight:900;color:#166534">Ačiū už pirkimą!</div>
        <div style="font-size:13px;color:#15803d;margin-top:4px">Užsakymas patvirtintas</div>
      </div>

      ${infoTable([
        ['Suma', `<strong style="font-size:18px;color:#0f172a">€${total}</strong>`],
        ['Statusas', badge('Patvirtinta', '#dcfce7', '#166534')],
        ['Data', new Date().toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })],
        ...(items.length ? [['Prekės', items.join(', ')] as [string, string]] : []),
      ])}

      <p style="font-size:14px;color:#475569;line-height:1.7;margin:20px 0">
        Informuosime, kai užsakymas bus išsiųstas. Klausimų — rašykite <a href="mailto:info@nodas.lt" style="color:#2563eb">info@nodas.lt</a>
      </p>

      ${btn(`${SITE_URL}/dashboard`, '📦 Peržiūrėti užsakymą →')}
    `, `Jūsų €${total} pirkimas patvirtintas.`),
  })
}

// ── Admin — shop order ─────────────────────────────────────────────────────

export async function sendAdminShopOrder(total: number, itemCount: number) {
  await resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `🛒 Parduotuvės užsakymas €${total} (${itemCount} prekės)`,
    html: layout(`
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 20px">🛒 Naujas parduotuvės užsakymas</h2>

      ${infoTable([
        ['Suma', `<strong>€${total}</strong>`],
        ['Prekių', String(itemCount)],
        ['Gauta', new Date().toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })],
      ])}

      ${btn(`${SITE_URL}/admin`, '🛠️ Atidaryti admin →', '#475569')}
    `),
  })
}
