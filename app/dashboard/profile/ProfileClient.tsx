'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Order = { id: string; service_type: string; status: string; created_at: string }

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  pending:     { bg: '#fef9c3', color: '#854d0e', dot: '#f59e0b', label: 'Laukiama' },
  in_progress: { bg: '#dbeafe', color: '#1e40af', dot: '#2563eb', label: 'Vykdoma' },
  completed:   { bg: '#dcfce7', color: '#166534', dot: '#16a34a', label: 'Atlikta' },
  cancelled:   { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', label: 'Atšaukta' },
}

const TIER_LABELS: Record<string, string> = {
  simple: 'Pradedantysis', pro: 'Profesionalus', business: 'Verslo', enterprise: 'Enterprise',
}

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  simple:     { bg: '#f1f5f9', color: '#475569' },
  pro:        { bg: '#dbeafe', color: '#1e40af' },
  business:   { bg: '#ede9fe', color: '#7c3aed' },
  enterprise: { bg: '#fff7ed', color: '#c2410c' },
}

function IcoSave() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
}

function IcoCheck() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
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

  const tierLabel = TIER_LABELS[profile?.tier ?? 'simple'] ?? 'Pradedantysis'
  const tierStyle = TIER_COLORS[profile?.tier ?? 'simple'] ?? TIER_COLORS.simple
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' })
    : '—'

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
    borderRadius: 8, fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Topbar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0', height: 56,
        display: 'flex', alignItems: 'center',
        paddingLeft: 72, paddingRight: 28,
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Profilis</div>
      </div>

      <div style={{ padding: 28, maxWidth: 800 }}>
        {/* Account card */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>
              {(name || email)[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{name || email}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: tierStyle.bg, color: tierStyle.color,
                padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              }}>
                {tierLabel}
              </span>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Narys nuo {memberSince}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            {[
              { id: 'name',  label: 'Vardas Pavardė', value: name,  set: setName,  placeholder: 'Jonas Jonaitis' },
              { id: 'phone', label: 'Telefonas',       value: phone, set: setPhone, placeholder: '+370 600 00000' },
            ].map(({ id, label, value, set, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                <input
                  id={id}
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={e => (e.target.style.border = '1px solid #2563eb')}
                  onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: saving ? '#94a3b8' : '#1e40af', color: '#fff',
                padding: '9px 22px', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background 200ms',
              }}
            >
              <IcoSave />
              {saving ? 'Saugoma...' : 'Išsaugoti'}
            </button>
            {saved && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                <IcoCheck /> Išsaugota!
              </span>
            )}
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Mano užrašai</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Asmeniniai užrašai — projekto idėjos, reikalavimai, pastabos..."
            rows={4}
            style={{
              ...inputStyle, height: 'auto', resize: 'vertical', marginBottom: 10,
              border: '1px solid #d1d5db',
            }}
            onFocus={e => (e.target.style.border = '1px solid #2563eb')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Saugoma tik šioje naršyklėje</span>
            <button
              onClick={() => { localStorage.setItem('nodas_profile_notes', notes); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#f1f5f9', color: '#374151',
                padding: '7px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <IcoSave />
              Išsaugoti užrašus
            </button>
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Paskutiniai užsakymai</div>
            <Link href="/dashboard/orders" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Visi →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 13 }}>
              Dar nėra užsakymų.{' '}
              <Link href="/dashboard/orders/new" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Užsakyti paslaugą →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentOrders.map(order => {
                const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                return (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{order.service_type}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        {new Date(order.created_at).toLocaleDateString('lt-LT')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: st.bg, padding: '4px 12px', borderRadius: 999 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Greiti veiksmai</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { href: '/dashboard/orders/new',             label: '+ Naujas užsakymas', primary: true },
              { href: '/dashboard/orders/new?s=remontas',  label: 'Web Remontas' },
              { href: '/dashboard/orders/new?s=spa',       label: 'Web SPA priežiūra' },
              { href: '/dashboard/orders/new?s=seo',       label: 'SEO' },
              { href: '/dashboard/orders/new?s=custom',    label: 'Custom Dev' },
            ].map(({ href, label, primary }) => (
              <Link key={href} href={href} style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                background: primary ? '#f97316' : '#f1f5f9',
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
