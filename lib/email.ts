import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM ?? 'nodas.lt <info@nodas.lt>'
const ADMIN_EMAIL = 'info@nodas.lt'

function baseLayout(content: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f8fafc;padding:32px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0">
      <div style="font-size:20px;font-weight:800;color:#1e40af;margin-bottom:24px">nodas.lt</div>
      ${content}
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
        nodas.lt — IT paslaugos Lietuvoje | info@nodas.lt
      </div>
    </div>
  </body></html>`
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({ from: FROM, to, subject: 'Sveiki atvykę į nodas.lt!',
    html: baseLayout(`<h2>Sveiki, ${name}!</h2><p>Džiaugiamės, kad prisijungėte prie nodas.lt. Galite pradėti naudotis paslaugomis savo paskyroje.</p>`) })
}

export async function sendOrderConfirmEmail(to: string, name: string, serviceType: string) {
  await resend.emails.send({ from: FROM, to, subject: `Užsakymas gautas — ${serviceType}`,
    html: baseLayout(`<h2>Užsakymas gautas!</h2><p>Sveiki, ${name}! Jūsų užsakymas <strong>${serviceType}</strong> gautas. Susisieksime per 24 val..</p>`) })
}

export async function sendOrderStatusEmail(to: string, serviceType: string, status: string) {
  await resend.emails.send({ from: FROM, to, subject: `Užsakymo statusas pakeistas — ${serviceType}`,
    html: baseLayout(`<h2>Statusas: ${status}</h2><p>Jūsų užsakymo <strong>${serviceType}</strong> statusas pakeistas į <strong>${status}</strong>.</p>`) })
}

export async function sendAdminNewOrder(serviceType: string, userName: string) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `📋 Naujas užsakymas: ${serviceType}`,
    html: baseLayout(`<h2>Naujas užsakymas!</h2><p>Klientas: <strong>${userName}</strong><br>Paslauga: <strong>${serviceType}</strong></p>`) })
}

export async function sendAdminNewUser(userName: string, email: string) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `👤 Naujas vartotojas: ${userName}`,
    html: baseLayout(`<h2>Naujas vartotojas!</h2><p>Vardas: ${userName}<br>El. paštas: ${email}</p>`) })
}

export async function sendSiteGeneratedEmail(to: string, name: string, subdomain: string) {
  await resend.emails.send({ from: FROM, to, subject: `🌐 Jūsų svetainė paruošta!`,
    html: baseLayout(`<h2>Svetainė paruošta!</h2><p>Sveiki, ${name}! Jūsų AI svetainė pasiekiama:<br><a href="https://${subdomain}.nodas.lt">${subdomain}.nodas.lt</a></p>`) })
}

export async function sendContactEmail(data: { name: string; email: string; service: string; message: string }) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `📩 Kontakto užklausa: ${data.service}`,
    html: baseLayout(`<h2>Nauja kontakto užklausa</h2><p>Vardas: ${data.name}<br>El. paštas: ${data.email}<br>Paslauga: ${data.service}</p><p>${data.message}</p>`) })
}

export async function sendShopOrderConfirmEmail(to: string, total: number) {
  await resend.emails.send({ from: FROM, to, subject: `🛒 Pirkimas patvirtintas — €${total}`,
    html: baseLayout(`<h2>Ačiū už pirkimą!</h2><p>Jūsų užsakymas €${total} patvirtintas. Informuosime kai bus išsiųstas.</p>`) })
}

export async function sendAdminShopOrder(total: number, itemCount: number) {
  await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `🛒 Parduotuvės užsakymas €${total}`,
    html: baseLayout(`<h2>Parduotuvės užsakymas</h2><p>Suma: €${total}<br>Prekių: ${itemCount}</p>`) })
}
