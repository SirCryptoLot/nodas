'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

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

const STATUS_OPTS = [
  { value: 'pending',     label: 'Laukiama',  color: '#f59e0b', bg: '#fef9c3' },
  { value: 'in_progress', label: 'Vykdoma',   color: '#3b82f6', bg: '#dbeafe' },
  { value: 'done',        label: 'Atlikta',   color: '#10b981', bg: '#dcfce7' },
  { value: 'cancelled',  label: 'Atšaukta',  color: '#94a3b8', bg: '#f1f5f9' },
]

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<{ id: string; val: string } | null>(null)
  const [editNotes, setEditNotes] = useState<{ id: string; val: string } | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setOrders(data.orders ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function updateOrder(id: string, updates: Record<string, unknown>) {
    setSaving(id)
    const token = await getToken()
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...updates }),
    })
    await fetchOrders()
    setSaving(null)
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
  }

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search && !o.service_type.toLowerCase().includes(search.toLowerCase()) &&
        !o.user_name.toLowerCase().includes(search.toLowerCase()) &&
        !o.user_email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = Object.fromEntries(STATUS_OPTS.map(s => [s.value, orders.filter(o => o.status === s.value).length]))

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>📋 Užsakymai</h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>{orders.length} iš viso</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: filter === 'all' ? '#0f172a' : '#f1f5f9', color: filter === 'all' ? '#fff' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Visi ({orders.length})
        </button>
        {STATUS_OPTS.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: filter === s.value ? s.color : '#f1f5f9', color: filter === s.value ? '#fff' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Ieškoti..." style={{ marginLeft: 'auto', padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: 200 }}
        />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Kraunama...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(order => {
            const st = STATUS_OPTS.find(s => s.value === order.status) ?? STATUS_OPTS[0]
            const isExpanded = expanded === order.id
            return (
              <div key={order.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                {/* Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 120px 100px', gap: 12, padding: '14px 16px', alignItems: 'center' }}>
                  {/* Info */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{order.service_type}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      {order.user_name || order.user_email || order.user_id.slice(0, 8)}
                      {order.user_email && <a href={`mailto:${order.user_email}`} style={{ color: '#2563eb', marginLeft: 6, textDecoration: 'none' }}>✉</a>}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{new Date(order.created_at).toLocaleDateString('lt-LT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>

                  {/* Status */}
                  <select
                    value={order.status}
                    disabled={saving === order.id}
                    onChange={e => updateOrder(order.id, { status: e.target.value })}
                    style={{ padding: '6px 8px', borderRadius: 8, border: `2px solid ${st.color}`, background: st.bg, color: st.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {STATUS_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>

                  {/* Price */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {editPrice?.id === order.id ? (
                      <>
                        <input value={editPrice.val} onChange={e => setEditPrice({ id: order.id, val: e.target.value })}
                          style={{ width: 60, padding: '5px 6px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }} />
                        <button onClick={() => { updateOrder(order.id, { price: Number(editPrice.val) }); setEditPrice(null) }}
                          style={{ padding: '5px 8px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>✓</button>
                      </>
                    ) : (
                      <button onClick={() => setEditPrice({ id: order.id, val: String(order.price ?? '') })}
                        style={{ padding: '5px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: order.price ? '#059669' : '#94a3b8', fontWeight: order.price ? 700 : 400 }}>
                        {order.price ? `€${order.price}` : '+ Kaina'}
                      </button>
                    )}
                  </div>

                  {/* Status label */}
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {saving === order.id ? '⏳ Saugoma...' : ''}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setExpanded(isExpanded ? null : order.id)}
                      style={{ padding: '5px 10px', background: '#eff6ff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#1e40af', fontWeight: 600 }}>
                      {isExpanded ? '▲' : '▼'}
                    </button>
                    <button onClick={() => deleteOrder(order.id)}
                      style={{ padding: '5px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#dc2626' }}>
                      🗑
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f1f5f9' }}>
                    {order.notes && (
                      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '12px 14px', marginTop: 12, marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kliento detalės</div>
                        <div style={{ fontSize: 13, color: '#0c4a6e', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{order.notes}</div>
                      </div>
                    )}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>Admin užrašai</div>
                      {editNotes?.id === order.id ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <textarea value={editNotes.val} onChange={e => setEditNotes({ id: order.id, val: e.target.value })}
                            rows={3} style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <button onClick={() => { updateOrder(order.id, { admin_notes: editNotes.val }); setEditNotes(null) }}
                              style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Išsaugoti</button>
                            <button onClick={() => setEditNotes(null)}
                              style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Atšaukti</button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => setEditNotes({ id: order.id, val: order.admin_notes ?? '' })}
                          style={{ padding: '8px 12px', background: '#f8fafc', border: '1px dashed #d1d5db', borderRadius: 8, fontSize: 13, color: order.admin_notes ? '#0f172a' : '#94a3b8', cursor: 'pointer', minHeight: 40, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                          {order.admin_notes || 'Spustelėkite norėdami pridėti admin užrašus...'}
                        </div>
                      )}
                    </div>
                    {order.user_email && (
                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <a href={`mailto:${order.user_email}?subject=Jūsų ${order.service_type} užsakymas — nodas.lt`}
                          style={{ padding: '7px 14px', background: '#eff6ff', color: '#1e40af', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          ✉ Rašyti {order.user_email}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Užsakymų nerasta</div>
          )}
        </div>
      )}
    </div>
  )
}
