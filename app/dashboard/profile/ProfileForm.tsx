'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProfileForm({ initialName, initialPhone }: { initialName: string; initialPhone: string }) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ full_name: name, phone }),
    })
    setSuccess(true)
    setLoading(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Vardas Pavardė</label>
        <input value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Telefonas</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+370..."
          style={{ width: '100%', padding: '9px 13px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
      </div>
      {success && <div style={{ color: '#16a34a', fontSize: 13, marginBottom: 12 }}>✅ Išsaugota!</div>}
      <button onClick={handleSave} disabled={loading} style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Saugoma...' : 'Išsaugoti'}
      </button>
    </div>
  )
}
