'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SERVICES = [
  { name: 'Web Remontas', icon: '🔧', desc: 'Svetainės klaidos, lėtas greitis, nulaužtas kodas' },
  { name: 'AI Svetainė', icon: '🤖', desc: 'Claude AI sugeneruoja svetainę per 5 minutes' },
  { name: 'WordPress / CMS', icon: '📦', desc: 'Pilnai valdoma svetainė su admin paneliu' },
  { name: 'Custom Dev', icon: '⚡', desc: 'React, Next.js — individualūs sprendimai' },
  { name: 'Web SPA priežiūra', icon: '🛡️', desc: 'Mėnesinė priežiūra, monitoringas, backupai' },
  { name: 'AI Sprendimai', icon: '🧠', desc: 'Chatbotai, automatizavimas, AI agentai' },
  { name: 'SEO', icon: '🔍', desc: 'Google paieškos optimizavimas' },
  { name: 'Serverių diegimas', icon: '🖥️', desc: 'Linux, hosting, domenai, konfigūracija' },
  { name: 'El. parduotuvė', icon: '🛒', desc: 'WooCommerce ar custom e-commerce' },
]

export default function NewOrderPage() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [form, setForm] = useState({ description: '', contact: '', budget: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!form.description.trim() || !form.contact.trim()) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const notes = `${form.description}\n\nKontaktai: ${form.contact}${form.budget ? `\nBiudžetas: ${form.budget}` : ''}`
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ service_type: service, notes }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Serverio klaida')
      }
      router.push('/dashboard/orders')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>+ Naujas užsakymas</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
        {step === 1 ? 'Pasirinkite paslaugą' : `Paslauga: ${service} — užpildykite detales`}
      </p>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, maxWidth: 600 }}>

        {/* Step 1: Select service */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SERVICES.map(s => (
              <button key={s.name} onClick={() => { setService(s.name); setStep(2) }}
                style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Aprašykite ko reikia <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Kuo galiu padėti? Aprašykite problemą ar reikalavimus, terminą, svarbią informaciją..."
                style={{ width: '100%', height: 130, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Jūsų el. paštas arba telefonas <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                value={form.contact}
                onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                placeholder="vardas@email.lt arba +370 600 00000"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Biudžetas (neprivaloma)
              </label>
              <input
                value={form.budget}
                onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                placeholder="Pvz: ~€200, iki €500, derinsime..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
                ← Atgal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.description.trim() || !form.contact.trim()}
                style={{ padding: '11px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (loading || !form.description.trim() || !form.contact.trim()) ? 0.6 : 1 }}
              >
                {loading ? 'Siunčiama...' : 'Pateikti užsakymą →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
