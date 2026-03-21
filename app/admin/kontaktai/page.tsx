'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Submission = {
  id: string
  name: string
  email: string
  service: string
  message: string
  created_at: string
}

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}

export default function AdminKontaktaiPage() {
  const [subs, setSubs] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchSubs = useCallback(async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/kontaktai', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setSubs(data.submissions ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSubs() }, [fetchSubs])

  async function deleteSub(id: string) {
    if (!confirm('Ištrinti šią užklausą?')) return
    const token = await getToken()
    await fetch('/api/admin/kontaktai', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    setSubs(s => s.filter(x => x.id !== id))
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>📬 Kontaktų užklausos</h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>{subs.length} užklausos</div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Kraunama...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subs.map(sub => (
            <div key={sub.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}>
                <div style={{ width: 36, height: 36, background: '#f0f9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#0369a1', flexShrink: 0 }}>
                  {sub.name[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{sub.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                    <a href={`mailto:${sub.email}`} onClick={e => e.stopPropagation()} style={{ color: '#2563eb', textDecoration: 'none' }}>{sub.email}</a>
                    {' · '}{sub.service}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {new Date(sub.created_at).toLocaleDateString('lt-LT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                <span style={{ color: '#94a3b8', fontSize: 16, marginLeft: 8 }}>{expanded === sub.id ? '▲' : '▼'}</span>
              </div>

              {expanded === sub.id && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px', marginTop: 12, fontSize: 14, color: '#0f172a', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {sub.message}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <a href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.service)} — nodas.lt&body=Sveiki, ${encodeURIComponent(sub.name)}!%0A%0A`}
                      style={{ padding: '7px 16px', background: '#2563eb', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                      ✉ Atsakyti
                    </a>
                    <button onClick={() => deleteSub(sub.id)}
                      style={{ padding: '7px 14px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                      🗑 Ištrinti
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {subs.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📬</div>
              Kontaktų užklausų nerasta
            </div>
          )}
        </div>
      )}
    </div>
  )
}
