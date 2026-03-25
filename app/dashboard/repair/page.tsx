'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function IcoCheck() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
}

const FIELDS = [
  { key: 'url',     label: 'Svetainės URL',                     placeholder: 'https://jusu-svetaine.lt',              required: false },
  { key: 'problem', label: 'Kokia problema?',                   placeholder: 'Pvz: svetainė neatsidaro, klaida 500...', required: true  },
  { key: 'contact', label: 'Jūsų el. paštas arba tel.',        placeholder: 'info@jusu.lt arba +370...',             required: false },
  { key: 'extra',   label: 'Papildoma informacija (neprivaloma)', placeholder: 'Kada pradėjo neveikti, kas paskutiniai pakeitimai...', required: false },
] as const

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

  const topbar = (
    <div style={{
      background: '#fff', borderBottom: '1px solid #e2e8f0', height: 56,
      display: 'flex', alignItems: 'center',
      paddingLeft: 72, paddingRight: 28,
    }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Web Remontas</div>
    </div>
  )

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {topbar}
      <div style={{ padding: 28 }}>
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
          padding: '48px 40px', maxWidth: 480, textAlign: 'center',
        }}>
          <div style={{ color: '#16a34a', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><IcoCheck /></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Užklausa gauta!</div>
          <div style={{ fontSize: 14, color: '#64748b' }}>Susisieksime per 24 valandas el. paštu <strong>info@nodas.lt</strong>.</div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {topbar}
      <div style={{ padding: 28 }}>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px' }}>
          Aprašykite problemą — atsakysime per 24 val. Kaina nuo €39.
        </p>

        <form onSubmit={handleSubmit} style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 16, padding: 28, maxWidth: 560,
        }}>
          {FIELDS.map(({ key, label, placeholder, required }) => (
            <div key={key} style={{ marginBottom: 18 }}>
              <label htmlFor={key} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                {label}
                {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
              </label>
              <textarea
                id={key}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                required={required}
                style={{
                  width: '100%', padding: '10px 13px', border: '1px solid #d1d5db',
                  borderRadius: 8, fontSize: 14, height: 72, resize: 'vertical',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.border = '1px solid #2563eb')}
                onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
              />
            </div>
          ))}

          {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{error}</div>}

          <button
            type="submit"
            disabled={loading || !form.problem.trim()}
            style={{
              background: loading || !form.problem.trim() ? '#94a3b8' : '#f97316',
              color: '#fff', padding: '12px 28px', border: 'none',
              borderRadius: 8, fontSize: 14, fontWeight: 700,
              cursor: loading || !form.problem.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 200ms',
            }}
          >
            {loading ? 'Siunčiama...' : 'Siųsti užklausą →'}
          </button>
        </form>
      </div>
    </div>
  )
}
