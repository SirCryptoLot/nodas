'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const SERVICES = [
  'Web Remontas',
  'AI Svetainė',
  'WordPress / CMS',
  'Custom Dev',
  'Web SPA priežiūra',
  'AI Sprendimai',
  'SEO',
  'Serverių diegimas',
  'El. parduotuvė',
]

export default function NewOrderPage() {
  const [service, setService] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!service || !description.trim() || !contact.trim()) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const notes = `${description}\n\nKontaktai: ${contact}${budget ? `\nBiudžetas: ${budget}` : ''}`
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ service_type: service, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Serverio klaida')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: 40, maxWidth: 500, textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#166534', marginTop: 12 }}>Užsakymas pateiktas!</div>
          <div style={{ fontSize: 14, color: '#15803d', marginTop: 8, marginBottom: 24 }}>Susisieksime per 24 valandas.</div>
          <a href="/dashboard/orders" style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Peržiūrėti užsakymus →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: '#0f172a' }}>+ Naujas užsakymas</h1>

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 560 }}>

        {/* Paslauga */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Paslauga <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            value={service}
            onChange={e => setService(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#fff', color: service ? '#0f172a' : '#9ca3af', boxSizing: 'border-box' }}
          >
            <option value="">— Pasirinkite paslaugą —</option>
            {SERVICES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Aprašymas */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Ko reikia? <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Aprašykite problemą ar reikalavimus, terminą, svarbią informaciją..."
            style={{ width: '100%', height: 130, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        {/* Kontaktai */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            El. paštas arba telefonas <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
            placeholder="vardas@email.lt arba +370 600 00000"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>

        {/* Biudžetas */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Biudžetas (neprivaloma)
          </label>
          <input
            type="text"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            placeholder="Pvz: ~€200, iki €500, derinsime..."
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !service || !description.trim() || !contact.trim()}
          style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (loading || !service || !description.trim() || !contact.trim()) ? 0.6 : 1, width: '100%' }}
        >
          {loading ? 'Siunčiama...' : 'Pateikti užsakymą →'}
        </button>
      </form>
    </div>
  )
}
