'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SitesPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ html: string; name: string } | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/generate-site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ html: result.html, name: result.name, prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      alert(`Svetainė išsaugota! Subdomain: ${data.site.subdomain}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Klaida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>🤖 AI Svetainių generatorius</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, maxWidth: 600 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Aprašykite savo verslą</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Pvz: Vilniaus kavinė su puikia kava ir desertais. Dirbame I-V 8-20, VI-VII 9-18."
          style={{ width: '100%', height: 120, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
        />
        {error && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</div>}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{ background: '#2563eb', color: '#fff', padding: '11px 24px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 12, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Generuojama...' : 'Generuoti svetainę →'}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Peržiūra: {result.name}</h2>
            <button onClick={handleSave} disabled={loading} style={{ background: '#16a34a', color: '#fff', padding: '6px 16px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              💾 Išsaugoti
            </button>
          </div>
          <iframe srcDoc={result.html} style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 8 }} />
        </div>
      )}
    </div>
  )
}
