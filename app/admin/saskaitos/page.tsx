'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type InvoiceItem = { description: string; qty: number; unit_price: number }

type Invoice = {
  id: string
  invoice_number: string
  invoice_type: 'invoice' | 'proforma'
  client_name: string
  client_email: string
  client_company?: string
  client_address?: string
  client_vat?: string
  items: InvoiceItem[]
  vat_rate: number
  due_date?: string
  notes?: string
  issued_at: string
  sent_at?: string
  created_at: string
  order_id?: string
}

const empty: Omit<Invoice, 'id' | 'invoice_number' | 'issued_at' | 'created_at'> = {
  invoice_type: 'invoice',
  client_name: '',
  client_email: '',
  client_company: '',
  client_address: '',
  client_vat: '',
  items: [{ description: '', qty: 1, unit_price: 0 }],
  vat_rate: 21,
  due_date: '',
  notes: '',
}

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}

function calcTotals(items: InvoiceItem[], vatRate: number) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0)
  const vat = subtotal * (vatRate / 100)
  return { subtotal, vat, total: subtotal + vat }
}

function printInvoice(inv: Invoice) {
  const { subtotal, vat, total } = calcTotals(inv.items, inv.vat_rate)
  const isProforma = inv.invoice_type === 'proforma'
  const dueDate = inv.due_date ? new Date(inv.due_date).toLocaleDateString('lt-LT') : '—'

  const w = window.open('', '_blank', 'width=900,height=700')
  if (!w) return

  w.document.write(`<!DOCTYPE html>
<html lang="lt">
<head>
<meta charset="UTF-8">
<title>${isProforma ? 'Išankstinė sąskaita' : 'Sąskaita faktūra'} Nr. ${inv.invoice_number}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0 }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 48px; color: #0f172a; font-size: 14px }
  h1 { font-size: 26px; font-weight: 900 }
  table { width: 100%; border-collapse: collapse }
  th { background: #f8fafc; padding: 10px 12px; font-size: 12px; font-weight: 700; color: #64748b; text-align: left; border-bottom: 2px solid #e2e8f0 }
  td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px }
  .total-row td { font-weight: 800; font-size: 16px; color: #166534; background: #f0fdf4 }
  .right { text-align: right }
  .label { color: #64748b; font-size: 12px; margin-bottom: 2px }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0 }
  .proforma-badge { display: inline-block; background: #fef9c3; color: #854d0e; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-left: 12px }
  @media print { button { display: none } }
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2563eb;padding-bottom:24px;margin-bottom:24px">
  <div>
    <div style="font-size:22px;font-weight:900;color:#2563eb;margin-bottom:4px">nodas<span style="color:#93c5fd">.lt</span></div>
    <div style="font-size:12px;color:#64748b">IT paslaugos · Web kūrimas</div>
    <div style="font-size:12px;color:#64748b">info@nodas.lt · nodas.lt</div>
  </div>
  <div style="text-align:right">
    <h1>${isProforma ? 'Išankstinė sąskaita' : 'Sąskaita faktūra'}${isProforma ? '<span class="proforma-badge">IŠANKSTINĖ</span>' : ''}</h1>
    <div style="font-size:15px;color:#64748b;margin-top:4px">Nr. <strong>${inv.invoice_number}</strong></div>
  </div>
</div>

<div class="info-grid">
  <div>
    <div class="label">Klientas</div>
    <div style="font-weight:700">${inv.client_name}</div>
    ${inv.client_company ? `<div style="color:#475569">${inv.client_company}</div>` : ''}
    ${inv.client_address ? `<div style="color:#475569">${inv.client_address}</div>` : ''}
    ${inv.client_email ? `<div style="color:#475569">${inv.client_email}</div>` : ''}
    ${inv.client_vat ? `<div style="color:#475569">PVM kodas: ${inv.client_vat}</div>` : ''}
  </div>
  <div style="text-align:right">
    <div class="label">Išrašyta</div>
    <div style="font-weight:600">${new Date(inv.issued_at).toLocaleDateString('lt-LT')}</div>
    <div class="label" style="margin-top:12px">Apmokėti iki</div>
    <div style="font-weight:700;color:#dc2626">${dueDate}</div>
  </div>
</div>

<table style="margin:24px 0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
  <thead><tr>
    <th>Aprašymas</th>
    <th class="right" style="width:80px">Kiekis</th>
    <th class="right" style="width:110px">Kaina</th>
    <th class="right" style="width:110px">Suma</th>
  </tr></thead>
  <tbody>
    ${inv.items.map(i => `<tr>
      <td>${i.description}</td>
      <td class="right">${i.qty}</td>
      <td class="right">€${i.unit_price.toFixed(2)}</td>
      <td class="right">€${(i.qty * i.unit_price).toFixed(2)}</td>
    </tr>`).join('')}
  </tbody>
  <tfoot>
    <tr><td colspan="3" class="right" style="color:#64748b">Suma be PVM</td><td class="right">€${subtotal.toFixed(2)}</td></tr>
    ${inv.vat_rate > 0 ? `<tr><td colspan="3" class="right" style="color:#64748b">PVM (${inv.vat_rate}%)</td><td class="right">€${vat.toFixed(2)}</td></tr>` : ''}
    <tr class="total-row"><td colspan="3" class="right">Viso mokėti</td><td class="right">€${total.toFixed(2)}</td></tr>
  </tfoot>
</table>

${inv.notes ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 16px;margin-bottom:24px">
  <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:6px">Pastabos</div>
  <div style="font-size:13px;color:#374151;white-space:pre-wrap">${inv.notes}</div>
</div>` : ''}

<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin-top:16px">
  <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:4px">💳 Apmokėjimo informacija</div>
  <div style="font-size:13px;color:#1e40af">El. paštas: info@nodas.lt &nbsp;|&nbsp; Apmokėti iki: ${dueDate}</div>
</div>

<div style="margin-top:32px;text-align:center">
  <button onclick="window.print()" style="background:#2563eb;color:#fff;padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">🖨️ Spausdinti / Išsaugoti PDF</button>
</div>
</body></html>`)
  w.document.close()
}

export default function SaskaitosPage() {
  const searchParams = useSearchParams()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Invoice | null>(null)
  const [form, setForm] = useState<typeof empty>({ ...empty })
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/saskaitos', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setInvoices(data.invoices ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Auto-open create modal when navigated from orders page
  useEffect(() => {
    const clientName  = searchParams.get('client_name') ?? ''
    const clientEmail = searchParams.get('client_email') ?? ''
    const service     = searchParams.get('service') ?? ''
    const price       = searchParams.get('price') ?? ''
    const orderId     = searchParams.get('order_id') ?? ''
    if (clientEmail || clientName) {
      const unitPrice = price ? Number(price) : 0
      setForm({
        ...empty,
        client_name:  clientName,
        client_email: clientEmail,
        order_id:     orderId || undefined,
        items: [{ description: service || 'Paslauga', qty: 1, unit_price: unitPrice }],
        due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      })
      setEditing(null)
      setModal('create')
    }
  }, [searchParams])

  function openCreate() {
    setForm({ ...empty, items: [{ description: '', qty: 1, unit_price: 0 }] })
    setEditing(null)
    setModal('create')
  }

  function openEdit(inv: Invoice) {
    setEditing(inv)
    setForm({
      invoice_type: inv.invoice_type,
      client_name: inv.client_name,
      client_email: inv.client_email,
      client_company: inv.client_company ?? '',
      client_address: inv.client_address ?? '',
      client_vat: inv.client_vat ?? '',
      items: inv.items,
      vat_rate: inv.vat_rate,
      due_date: inv.due_date ?? '',
      notes: inv.notes ?? '',
      order_id: inv.order_id,
    })
    setModal('edit')
  }

  async function save() {
    if (!form.client_name || !form.client_email) {
      setMsg('❌ Privalomi laukai: Kliento vardas ir el. paštas')
      return
    }
    setSaving(true)
    const token = await getToken()
    // Sanitize: convert empty strings to null for optional DB fields
    const body = {
      ...form,
      due_date:       form.due_date       || null,
      client_company: form.client_company || null,
      client_address: form.client_address || null,
      client_vat:     form.client_vat     || null,
      notes:          form.notes          || null,
      order_id:       form.order_id       || null,
      issued_at:      editing?.issued_at ?? new Date().toISOString(),
    }
    let res: Response
    if (modal === 'create') {
      res = await fetch('/api/admin/saskaitos', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    } else {
      res = await fetch('/api/admin/saskaitos', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: editing!.id, ...body }) })
    }
    setSaving(false)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setMsg(`❌ Klaida: ${err.error ?? res.statusText}`)
      return
    }
    setModal(null)
    setMsg('✅ Sąskaita išsaugota')
    setTimeout(() => setMsg(''), 3000)
    load()
  }

  async function sendEmail(inv: Invoice) {
    setSending(inv.id)
    const token = await getToken()
    await fetch('/api/admin/saskaitos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: inv.id, sendEmail: true }),
    })
    setSending(null)
    setMsg(`✅ Sąskaita Nr. ${inv.invoice_number} išsiųsta ${inv.client_email}`)
    setTimeout(() => setMsg(''), 4000)
    load()
  }

  async function del(id: string) {
    if (!confirm('Ištrinti sąskaitą?')) return
    const token = await getToken()
    await fetch('/api/admin/saskaitos', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) })
    load()
  }

  function setItem(idx: number, key: keyof InvoiceItem, value: string | number) {
    setForm(f => {
      const items = [...f.items]
      items[idx] = { ...items[idx], [key]: key === 'description' ? value : Number(value) }
      return { ...f, items }
    })
  }

  function addItem() { setForm(f => ({ ...f, items: [...f.items, { description: '', qty: 1, unit_price: 0 }] })) }
  function removeItem(idx: number) { setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) })) }

  const { subtotal, vat, total } = calcTotals(form.items, form.vat_rate)

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block' as const, fontSize: 12, fontWeight: 600 as const, color: '#374151', marginBottom: 4 }

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>💼 Sąskaitos faktūros</h1>
        <button onClick={openCreate} style={{ background: '#2563eb', color: '#fff', padding: '9px 20px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + Nauja sąskaita
        </button>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#166534' }}>{msg}</div>}

      {loading ? (
        <div style={{ color: '#94a3b8', fontSize: 14 }}>Kraunama...</div>
      ) : invoices.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧾</div>
          <div style={{ fontSize: 14 }}>Dar nėra sąskaitų. Sukurkite pirmą!</div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Nr.', 'Tipas', 'Klientas', 'El. paštas', 'Suma', 'Apmok. iki', 'Išsiųsta', 'Veiksmai'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748b', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const t = calcTotals(inv.items, inv.vat_rate).total
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{inv.invoice_number}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: inv.invoice_type === 'proforma' ? '#fef9c3' : '#dbeafe', color: inv.invoice_type === 'proforma' ? '#854d0e' : '#1e40af', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                        {inv.invoice_type === 'proforma' ? 'Išankstinė' : 'Faktūra'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#0f172a' }}>{inv.client_name}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{inv.client_email}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>€{t.toFixed(2)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: inv.due_date && new Date(inv.due_date) < new Date() && !inv.sent_at ? '#dc2626' : '#64748b' }}>
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString('lt-LT') : '—'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {inv.sent_at ? (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                          ✅ {new Date(inv.sent_at).toLocaleDateString('lt-LT')}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={() => printInvoice(inv)} title="Spausdinti / PDF" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>🖨️</button>
                        <button onClick={() => sendEmail(inv)} disabled={sending === inv.id} title="Siųsti el. paštu" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                          {sending === inv.id ? '...' : '📧'}
                        </button>
                        <button onClick={() => openEdit(inv)} title="Redaguoti" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>✏️</button>
                        <button onClick={() => del(inv.id)} title="Ištrinti" style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#dc2626', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 720, padding: 32, margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {modal === 'create' ? '+ Nauja sąskaita' : `✏️ Redaguoti ${editing?.invoice_number}`}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {/* Type */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {(['invoice', 'proforma'] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, invoice_type: t }))} style={{
                  padding: '7px 18px', borderRadius: 8, border: '2px solid', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  borderColor: form.invoice_type === t ? '#2563eb' : '#e2e8f0',
                  background: form.invoice_type === t ? '#eff6ff' : '#f8fafc',
                  color: form.invoice_type === t ? '#2563eb' : '#64748b',
                }}>
                  {t === 'invoice' ? '🧾 Sąskaita faktūra' : '📋 Išankstinė (proforma)'}
                </button>
              ))}
            </div>

            {/* Client info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Kliento vardas *', key: 'client_name', placeholder: 'Jonas Jonaitis' },
                { label: 'El. paštas *', key: 'client_email', placeholder: 'klientas@email.lt' },
                { label: 'Įmonė', key: 'client_company', placeholder: 'UAB Pavyzdys' },
                { label: 'Adresas', key: 'client_address', placeholder: 'Gedimino pr. 1, Vilnius' },
                { label: 'PVM kodas', key: 'client_vat', placeholder: 'LT123456789' },
                { label: 'Apmokėti iki', key: 'due_date', placeholder: '', type: 'date' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type ?? 'text'}
                    value={(form as Record<string, unknown>)[key] as string ?? ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            {/* VAT */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>PVM tarifas (%)</label>
              <select value={form.vat_rate} onChange={e => setForm(f => ({ ...f, vat_rate: Number(e.target.value) }))} style={{ ...inputStyle, width: 160 }}>
                {[0, 5, 9, 21].map(r => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Paslaugos / prekės</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Aprašymas', 'Kiekis', 'Kaina (€)', 'Suma', ''].map(h => (
                      <th key={h} style={{ padding: '7px 8px', fontSize: 11, fontWeight: 700, color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '4px 4px' }}>
                        <input value={item.description} onChange={e => setItem(idx, 'description', e.target.value)} placeholder="Paslaugos pavadinimas" style={{ ...inputStyle, fontSize: 12 }} />
                      </td>
                      <td style={{ padding: '4px 4px', width: 70 }}>
                        <input type="number" min={1} value={item.qty} onChange={e => setItem(idx, 'qty', e.target.value)} style={{ ...inputStyle, fontSize: 12 }} />
                      </td>
                      <td style={{ padding: '4px 4px', width: 110 }}>
                        <input type="number" min={0} step={0.01} value={item.unit_price} onChange={e => setItem(idx, 'unit_price', e.target.value)} style={{ ...inputStyle, fontSize: 12 }} />
                      </td>
                      <td style={{ padding: '4px 8px', fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>€{(item.qty * item.unit_price).toFixed(2)}</td>
                      <td style={{ padding: '4px 4px' }}>
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addItem} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>+ Pridėti eilutę</button>
            </div>

            {/* Totals */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#64748b' }}>Suma be PVM: <strong>€{subtotal.toFixed(2)}</strong></div>
              {form.vat_rate > 0 && <div style={{ fontSize: 13, color: '#64748b' }}>PVM ({form.vat_rate}%): <strong>€{vat.toFixed(2)}</strong></div>}
              <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginTop: 6 }}>Viso: €{total.toFixed(2)}</div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Pastabos</label>
              <textarea value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Mokėjimo sąlygos, pastabos..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Atšaukti</button>
              <button onClick={save} disabled={saving} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saugoma...' : '💾 Išsaugoti'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
