'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Order = { id: string; service_type: string; status: string; created_at: string }

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#fef9c3', color: '#854d0e', label: 'Laukiama' },
  in_progress: { bg: '#dbeafe', color: '#1e40af', label: 'Vykdoma' },
  done:        { bg: '#dcfce7', color: '#166534', label: 'Atlikta' },
  cancelled:   { bg: '#f1f5f9', color: '#64748b', label: 'Atšaukta' },
}

export function ProfileClient({
  email, profile, recentOrders,
}: {
  email: string
  profile: Record<string, string> | null
  recentOrders: Order[]
}) {
  const [name, setName]   = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nodas_profile_notes')
    if (stored) setNotes(stored)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ full_name: name, phone }),
    })
    localStorage.setItem('nodas_profile_notes', notes)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const TIER_LABELS: Record<string, string> = {
    simple: 'Pradedantysis', pro: 'Profesionalus', business: 'Verslo', enterprise: 'Enterprise',
  }
  const tierLabel = TIER_LABELS[profile?.tier ?? 'simple'] ?? 'Pradedantysis'
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' })
    : '—'

  return (
    <div style={{ padding: 28, maxWidth: 760 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: '#0f172a' }}>👤 Profilis</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* === Account info === */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, background: 'linear-gradient(135deg,#2563eb,#1e40af)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>
              {(name || email)[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{name || email}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{email}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <span style={{
                background: '#dbeafe', color: '#1e40af', padding: '4px 14px',
                borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
              }}>
                {tierLabel} planas
              </span>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Narys nuo {memberSince}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Vardas Pavardė', value: name, set: setName, placeholder: 'Jonas Jonaitis' },
              { label: 'Telefonas', value: phone, set: setPhone, placeholder: '+370 600 00000' },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                <input
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: '#2563eb', color: '#fff', padding: '9px 22px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              {saving ? 'Saugoma...' : 'Išsaugoti'}
            </button>
            {saved && <span style={{ color: '#16a34a', fontSize: 13 }}>✅ Išsaugota!</span>}
          </div>
        </div>

        {/* === Notes === */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22, gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>📝 Mano užrašai</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Asmeniniai užrašai — projekto idėjos, reikalavimai, pastabos, ką reikia užsakyti..."
            rows={4}
            style={{
              width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
              borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Saugoma tik šioje naršyklėje</span>
            <button
              onClick={() => { localStorage.setItem('nodas_profile_notes', notes); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
              style={{ background: '#f1f5f9', color: '#374151', padding: '7px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              💾 Išsaugoti užrašus
            </button>
          </div>
        </div>

        {/* === Recent orders === */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>📋 Paskutiniai užsakymai</div>
            <Link href="/dashboard/orders" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Visi →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
              Dar nėra užsakymų.{' '}
              <Link href="/dashboard/orders/new" style={{ color: '#2563eb', textDecoration: 'none' }}>Užsakyti paslaugą →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentOrders.map(order => {
                const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending
                return (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{order.service_type}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        {new Date(order.created_at).toLocaleDateString('lt-LT')}
                      </div>
                    </div>
                    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* === Quick actions === */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22, gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>⚡ Greiti veiksmai</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { href: '/dashboard/orders/new', label: '+ Naujas užsakymas', primary: true },
              { href: '/dashboard/orders/new?s=remontas', label: '🔧 Web Remontas' },
              { href: '/dashboard/orders/new?s=spa', label: '🛡️ Web SPA priežiūra' },
              { href: '/dashboard/orders/new?s=seo', label: '🔍 SEO' },
              { href: '/dashboard/orders/new?s=custom', label: '⚡ Custom Dev' },
            ].map(({ href, label, primary }) => (
              <Link key={href} href={href} style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                background: primary ? '#2563eb' : '#f1f5f9',
                color: primary ? '#fff' : '#374151',
                border: primary ? 'none' : '1px solid #e2e8f0',
              }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
