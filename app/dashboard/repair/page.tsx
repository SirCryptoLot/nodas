'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RepairPage() {
  const [form, setForm] = useState({ url: '', problem: '', contact: '', extra: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const notes = `URL: ${form.url}\nProblema: ${form.problem}\nKontaktas: ${form.contact}\nPapildoma: ${form.extra}`
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ service_type: 'Web Remontas', notes }),
      })
      if (!res.ok) throw new Error('Klaida siunčiant užklausą')
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ padding: 28 }}>
      <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: 32, maxWidth: 500, textAlign: 'center' }}>
        <div style={{ fontSize: 32 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#166534', marginTop: 12 }}>Užklausa gauta!</div>
        <div style={{ fontSize: 14, color: '#15803d', marginTop: 8 }}>Susisieksime per 24 valandas.</div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🔧 Web Remontas</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Aprašykite problemą — atsakysime per 24 val. Kaina nuo €39.</p>
      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 560 }}>
        {[
          { key: 'url', label: 'Svetainės URL', placeholder: 'https://jusu-svetaine.lt' },
          { key: 'problem', label: 'Kokia problema?', placeholder: 'Pvz: svetainė neatsidaro, rodo klaidą 500...' },
          { key: 'contact', label: 'Jūsų el. paštas arba tel.', placeholder: 'info@jusu.lt arba +370...' },
          { key: 'extra', label: 'Papildoma informacija (neprivaloma)', placeholder: 'Kada pradėjo neveikti, kas paskutiniai pakeitimai...' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
            <textarea
              value={form[key as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, height: 72, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button type="submit" onClick={e => e.stopPropagation()} disabled={loading || !form.problem.trim()} style={{ background: '#2563eb', color: '#fff', padding: '11px 24px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Siunčiama...' : 'Siųsti užklausą →'}
        </button>
      </form>
    </div>
  )
}
