'use client'
import { useState, useEffect } from 'react'

type Tab = { key: string; label: string; icon: string; placeholder: string }

const TABS: Tab[] = [
  { key: 'darbai', label: 'Darbų sąrašas', icon: '✅', placeholder: '- [ ] Susisiekti su klientu\n- [ ] Išsiųsti pasiūlymą\n- [ ] Atnaujinti svetainę' },
  { key: 'idejos', label: 'Idėjos', icon: '💡', placeholder: 'Verslo idėjos, pasiūlymai, planai...' },
  { key: 'klientai', label: 'Klientų pastabos', icon: '👥', placeholder: 'Pastabos apie klientus, svarbūs kontaktai...' },
  { key: 'techninės', label: 'Techninės', icon: '⚙️', placeholder: 'Techniniai sprendimai, komandos, konfigūracijos...' },
]

export default function AdminUzrasaiPage() {
  const [activeTab, setActiveTab] = useState('darbai')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored: Record<string, string> = {}
    TABS.forEach(t => {
      stored[t.key] = localStorage.getItem(`admin_note_${t.key}`) ?? ''
    })
    setNotes(stored)
  }, [])

  function save() {
    TABS.forEach(t => {
      localStorage.setItem(`admin_note_${t.key}`, notes[t.key] ?? '')
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentTab = TABS.find(t => t.key === activeTab)!
  const wordCount = (notes[activeTab] ?? '').split(/\s+/).filter(Boolean).length

  return (
    <div style={{ padding: 28, height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>🗒️ Admin užrašai</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✅ Išsaugota!</span>}
          <button onClick={save}
            style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            💾 Išsaugoti
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 4 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: activeTab === tab.key ? '#0f172a' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#64748b',
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {notes[tab.key] && <span style={{ width: 6, height: 6, background: activeTab === tab.key ? '#60a5fa' : '#94a3b8', borderRadius: '50%' }} />}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={notes[activeTab] ?? ''}
          onChange={e => setNotes(n => ({ ...n, [activeTab]: e.target.value }))}
          placeholder={currentTab.placeholder}
          style={{
            flex: 1, width: '100%', padding: '16px 18px', border: '1px solid #e2e8f0',
            borderRadius: 12, fontSize: 14, lineHeight: 1.8, resize: 'none',
            boxSizing: 'border-box', fontFamily: 'ui-monospace, monospace',
            background: '#fff', color: '#0f172a', outline: 'none',
          }}
          onKeyDown={e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault()
              save()
            }
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
          <span>Ctrl+S — išsaugoti</span>
          <span>{wordCount} žodžiai · {(notes[activeTab] ?? '').length} simboliai</span>
        </div>
      </div>
    </div>
  )
}
