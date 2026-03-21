'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Order = {
  id: string
  user_id: string
  service_type: string
  status: string
  notes: string | null
  price: number | null
  admin_notes: string | null
  created_at: string
  user_name: string
  user_email: string
}

type PendingEdit = {
  status: string
  clientComment: string
  adminNotes: string
  priceStr: string
}

const STATUS_OPTS = [
  { value: 'pending',     label: 'Laukiama',  color: '#f59e0b', bg: '#fef9c3' },
  { value: 'in_progress', label: 'Vykdoma',   color: '#3b82f6', bg: '#dbeafe' },
  { value: 'completed',   label: 'Atlikta',   color: '#10b981', bg: '#dcfce7' },
  { value: 'cancelled',   label: 'Atšaukta',  color: '#94a3b8', bg: '#f1f5f9' },
]

async function getToken() {
  const sb = createClient()
  const { data: { session } } = await sb.auth.getSession()
  return session?.access_token ?? ''
}

function initEdit(order: Order): PendingEdit {
  const savedNotes = typeof window !== 'undefined'
    ? localStorage.getItem(`admin_note_order_${order.id}`) ?? ''
    : ''
  return {
    status:        order.status,
    clientComment: '',
    adminNotes:    savedNotes,
    priceStr:      order.price != null ? String(order.price) : '',
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [pending, setPending]   = useState<Record<string, PendingEdit>>({})
  const [saving, setSaving]     = useState<string | null>(null)
  const [sending, setSending]   = useState<string | null>(null)
  // Track email sent time per order
  const [emailSent, setEmailSent] = useState<Record<string, string>>({})

  const fetchOrders = useCallback(async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setOrders(data.orders ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  function toggleExpand(order: Order) {
    if (expanded === order.id) { setExpanded(null); return }
    setExpanded(order.id)
    // Always re-init from current order data when opening
    setPending(p => ({ ...p, [order.id]: initEdit(order) }))
  }

  function setPendingField(id: string, field: keyof PendingEdit, value: string) {
    setPending(p => ({ ...p, [id]: { ...p[id], [field]: value } }))
  }

  async function callApi(id: string, extra: Record<string, unknown>) {
    const ed = pending[id]
    if (!ed) return false
    const token = await getToken()
    // Save admin notes to localStorage (no DB column for this)
    if (ed.adminNotes) localStorage.setItem(`admin_note_order_${id}`, ed.adminNotes)
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id,
        status: ed.status,
        price:  ed.priceStr ? Number(ed.priceStr) : null,
        ...extra,
      }),
    })
    return res.ok
  }

  async function saveOrder(id: string) {
    const ed = pending[id]
    if (!ed) return
    setSaving(id)
    const ok = await callApi(id, { sendEmail: false })
    if (ok) {
      // Optimistic update — reflect saved values immediately
      setOrders(os => os.map(o => o.id === id
        ? { ...o, status: ed.status, price: ed.priceStr ? Number(ed.priceStr) : o.price, admin_notes: ed.adminNotes }
        : o
      ))
    }
    setSaving(null)
  }

  async function sendToClient(id: string) {
    const ed = pending[id]
    if (!ed) return
    setSending(id)
    const ok = await callApi(id, { sendEmail: true, client_comment: ed.clientComment })
    if (ok) {
      setOrders(os => os.map(o => o.id === id
        ? { ...o, status: ed.status, price: ed.priceStr ? Number(ed.priceStr) : o.price, admin_notes: ed.adminNotes }
        : o
      ))
      const now = new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' })
      setEmailSent(s => ({ ...s, [id]: now }))
      setPending(p => ({ ...p, [id]: { ...p[id], clientComment: '' } }))
    }
    setSending(null)
  }

  async function deleteOrder(id: string) {
    if (!confirm('Ištrinti šį užsakymą?')) return
    const token = await getToken()
    await fetch('/api/admin/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    setOrders(o => o.filter(x => x.id !== id))
    if (expanded === id) setExpanded(null)
  }

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!o.service_type.toLowerCase().includes(q) &&
          !o.user_name.toLowerCase().includes(q) &&
          !o.user_email.toLowerCase().includes(q)) return false
    }
    return true
  })

  const counts = Object.fromEntries(
    STATUS_OPTS.map(s => [s.value, orders.filter(o => o.status === s.value).length])
  )

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>📋 Užsakymai</h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>{orders.length} iš viso</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')}
          style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: filter === 'all' ? '#0f172a' : '#f1f5f9', color: filter === 'all' ? '#fff' : '#374151' }}>
          Visi ({orders.length})
        </button>
        {STATUS_OPTS.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: filter === s.value ? s.color : '#f1f5f9', color: filter === s.value ? '#fff' : '#374151' }}>
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ieškoti..."
          style={{ marginLeft: 'auto', padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: 200 }} />
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Kraunama...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(order => {
            const st = STATUS_OPTS.find(s => s.value === order.status) ?? STATUS_OPTS[0]
            const isOpen = expanded === order.id
            const ed = pending[order.id]
            const edSt = ed ? (STATUS_OPTS.find(s => s.value === ed.status) ?? st) : st
            const hasChanges = ed && (
              ed.status !== order.status ||
              ed.adminNotes !== (order.admin_notes ?? '') ||
              ed.priceStr !== (order.price != null ? String(order.price) : '')
            )
            const sentTime = emailSent[order.id]

            return (
              <div key={order.id} style={{ background: '#fff', border: `1.5px solid ${isOpen ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}>
                {/* Summary row — click to expand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }}
                  onClick={() => toggleExpand(order)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{order.service_type}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      {order.user_name || '—'}
                      {order.user_email && <span style={{ color: '#94a3b8' }}> · {order.user_email}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                      {new Date(order.created_at).toLocaleDateString('lt-LT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Email sent badge */}
                  {sentTime && (
                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, background: '#dcfce7', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      ✉ Išsiųsta {sentTime}
                    </span>
                  )}

                  {/* Status badge */}
                  <span style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {st.label}
                  </span>

                  {order.price != null && (
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#059669', flexShrink: 0 }}>€{order.price}</span>
                  )}

                  <span style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>

                {/* Expanded panel */}
                {isOpen && ed && (
                  <div style={{ borderTop: '1px solid #e2e8f0', padding: 20 }}>

                    {/* Client submitted details */}
                    {order.notes && (
                      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0ea5e9', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                          📋 Kliento pateikta informacija
                        </div>
                        {order.notes.split('\n').filter(Boolean).map((line, i) => {
                          const [label, ...rest] = line.split(': ')
                          const value = rest.join(': ')
                          return value ? (
                            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 4 }}>
                              <span style={{ color: '#0369a1', fontWeight: 600, minWidth: 120, flexShrink: 0 }}>{label}:</span>
                              <span style={{ color: '#0c4a6e' }}>{value}</span>
                            </div>
                          ) : (
                            <div key={i} style={{ fontSize: 13, color: '#0c4a6e', marginBottom: 4 }}>{line}</div>
                          )
                        })}
                      </div>
                    )}

                    {/* Status + Price row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Būsena</label>
                        <select value={ed.status} onChange={e => setPendingField(order.id, 'status', e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', border: `2px solid ${edSt.color}`, borderRadius: 8, background: edSt.bg, color: edSt.color, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                          {STATUS_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Kaina (€)</label>
                        <input value={ed.priceStr} onChange={e => setPendingField(order.id, 'priceStr', e.target.value)}
                          placeholder="pvz: 149"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    {/* Client comment */}
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                        📧 Komentaras klientui
                        <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 6 }}>— bus įtrauktas į el. laišką</span>
                      </label>
                      <textarea value={ed.clientComment} onChange={e => setPendingField(order.id, 'clientComment', e.target.value)}
                        placeholder="Pvz: Pradėjome darbą, planuojame baigti per 3 darbo dienas. Iškilus klausimų — rašykite!"
                        rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} />
                    </div>

                    {/* Admin notes */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                        🔒 Vidiniai užrašai
                        <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 6 }}>— klientas nemato</span>
                      </label>
                      <textarea value={ed.adminNotes} onChange={e => setPendingField(order.id, 'adminNotes', e.target.value)}
                        placeholder="Pastabos, techniniai detalės, klientų komunikacija..."
                        rows={2} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: '#f8fafc', lineHeight: 1.6 }} />
                    </div>

                    {/* Email sent info */}
                    {sentTime && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#166534', fontWeight: 600 }}>
                        ✅ El. laiškas išsiųstas šiandien {sentTime}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => saveOrder(order.id)} disabled={saving === order.id || sending === order.id}
                        style={{ padding: '10px 20px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          background: hasChanges ? '#0f172a' : '#f1f5f9', color: hasChanges ? '#fff' : '#94a3b8',
                          opacity: saving === order.id ? 0.7 : 1 }}>
                        {saving === order.id ? '⏳ Saugoma...' : '💾 Išsaugoti'}
                      </button>

                      <button onClick={() => sendToClient(order.id)} disabled={saving === order.id || sending === order.id}
                        style={{ padding: '10px 22px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          background: '#2563eb', color: '#fff', opacity: sending === order.id ? 0.7 : 1 }}>
                        {sending === order.id ? '📤 Siunčiama...' : '📧 Siųsti klientui'}
                      </button>

                      <Link
                        href={`/admin/saskaitos?client_name=${encodeURIComponent(order.user_name)}&client_email=${encodeURIComponent(order.user_email)}&service=${encodeURIComponent(order.service_type)}&price=${order.price ?? ''}&order_id=${order.id}`}
                        style={{ padding: '10px 16px', background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        💼 Išrašyti sąskaitą
                      </Link>

                      {order.user_email && (
                        <a href={`mailto:${order.user_email}?subject=${encodeURIComponent(`Jūsų ${order.service_type} užsakymas`)}`}
                          style={{ padding: '10px 14px', background: '#f1f5f9', color: '#374151', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', marginLeft: 'auto' }}>
                          ✉ {order.user_email}
                        </a>
                      )}

                      <button onClick={() => deleteOrder(order.id)}
                        style={{ padding: '10px 14px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                        🗑
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && !loading && (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Užsakymų nerasta</div>
          )}
        </div>
      )}
    </div>
  )
}
