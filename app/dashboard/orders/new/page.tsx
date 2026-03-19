'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SERVICES = ['Web Remontas', 'AI Svetainė', 'WordPress / CMS', 'Custom Dev', 'Web SPA priežiūra', 'AI Sprendimai', 'SEO', 'Serverių diegimas', 'El. parduotuvė']

export default function NewOrderPage() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ service_type: service, notes }),
    })
    router.push('/dashboard/orders')
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>+ Naujas užsakymas</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 560 }}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>1. Pasirinkite paslaugą</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SERVICES.map(s => (
                <button key={s} onClick={() => { setService(s); setStep(2) }}
                  style={{ padding: '12px 16px', background: service === s ? '#eff6ff' : '#f8fafc', border: `1px solid ${service === s ? '#93c5fd' : '#e2e8f0'}`, borderRadius: 8, textAlign: 'left', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>2. Aprašykite užsakymą</h2>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Paslauga: <strong>{service}</strong></div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Aprašykite ko reikia, kokie reikalavimai, terminas..."
              style={{ width: '100%', height: 120, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ padding: '10px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>← Atgal</button>
              <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Siunčiama...' : 'Pateikti užsakymą →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
