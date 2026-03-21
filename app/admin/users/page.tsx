'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type User = {
  id: string
  full_name: string | null
  email: string
  tier: string
  is_admin: boolean
  phone: string | null
  created_at: string
}

const TIERS = [
  { value: 'simple',     label: 'Pradedantysis' },
  { value: 'pro',        label: 'Profesionalus' },
  { value: 'business',   label: 'Verslo' },
  { value: 'enterprise', label: 'Enterprise' },
]

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  simple:     { bg: '#f1f5f9', color: '#475569' },
  pro:        { bg: '#dbeafe', color: '#1e40af' },
  business:   { bg: '#fef9c3', color: '#854d0e' },
  enterprise: { bg: '#f3e8ff', color: '#7e22ce' },
}

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function updateUser(id: string, updates: Record<string, unknown>) {
    setSaving(id)
    const token = await getToken()
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...updates }),
    })
    setUsers(us => us.map(u => u.id === id ? { ...u, ...updates } : u))
    setSaving(null)
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Ištrinti vartotoją ${email}? Šis veiksmas negrįžtamas.`)) return
    const token = await getToken()
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    setUsers(us => us.filter(u => u.id !== id))
  }

  const filtered = users.filter(u =>
    !search ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>👥 Vartotojai</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>{users.length} vartotojai</div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ieškoti..." style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: 200 }} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Kraunama...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Vartotojas', 'El. paštas', 'Planas', 'Admin', 'Prisijungė', 'Veiksmai'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const tc = TIER_COLORS[u.tier] ?? TIER_COLORS.simple
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1e40af', flexShrink: 0 }}>
                          {(u.full_name ?? u.email)[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{u.full_name ?? '—'}</div>
                          {u.phone && <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a href={`mailto:${u.email}`} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>{u.email}</a>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={u.tier}
                        disabled={saving === u.id}
                        onChange={e => updateUser(u.id, { tier: e.target.value })}
                        style={{ padding: '5px 8px', borderRadius: 7, border: `1.5px solid ${tc.color}`, background: tc.bg, color: tc.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => updateUser(u.id, { is_admin: !u.is_admin })}
                        disabled={saving === u.id}
                        style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: u.is_admin ? '#dcfce7' : '#f1f5f9', color: u.is_admin ? '#166534' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {u.is_admin ? '✅ Admin' : '—'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>
                      {new Date(u.created_at).toLocaleDateString('lt-LT')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={`mailto:${u.email}`} style={{ padding: '5px 10px', background: '#eff6ff', color: '#1e40af', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>✉</a>
                        <button onClick={() => deleteUser(u.id, u.email)}
                          style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Vartotojų nerasta</div>
          )}
        </div>
      )}
    </div>
  )
}
