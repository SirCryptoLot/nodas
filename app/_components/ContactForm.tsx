'use client'
import { useState } from 'react'

const SERVICE_OPTIONS = ['Web Remontas', 'AI Svetainė', 'WordPress / CMS', 'Custom Dev', 'Web SPA priežiūra', 'AI Sprendimai', 'SEO', 'Serverių diegimas', 'El. parduotuvė', 'Kita']

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', service: 'Web Remontas', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Klaida siunčiant')
      setSuccess(true)
    } catch {
      setError('Klaida siunčiant. Bandykite dar kartą.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: 32 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#166534', marginTop: 12 }}>Užklausa gauta!</div>
      <div style={{ fontSize: 14, color: '#15803d', marginTop: 8 }}>Susisieksime per 24 valandas.</div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
      {[
        { key: 'name', label: 'Vardas', type: 'text', placeholder: 'Jūsų vardas' },
        { key: 'email', label: 'El. paštas', type: 'email', placeholder: 'jusu@pastas.lt' },
      ].map(({ key, label, type, placeholder }) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
          <input
            type={type}
            value={form[key as 'name' | 'email']}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
            required
            style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>
      ))}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Paslauga</label>
        <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
          style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#f9fafb', boxSizing: 'border-box' }}>
          {SERVICE_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Žinutė</label>
        <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required
          placeholder="Aprašykite savo projektą ar problemą..."
          style={{ width: '100%', height: 80, padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
      </div>
      {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading}
        style={{ background: '#2563eb', color: '#fff', width: '100%', padding: 12, borderRadius: 8, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Siunčiama...' : 'Siųsti užklausą →'}
      </button>
    </form>
  )
}
