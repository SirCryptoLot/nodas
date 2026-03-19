import Link from 'next/link'

export default function AiPage() {
  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🧠 AI Sprendimai</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>Individualūs AI sprendimai jūsų verslui</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, maxWidth: 700 }}>
        {[
          { icon: '🤖', title: 'AI Chatbot', desc: 'Automatinis klientų aptarnavimas jūsų svetainėje 24/7' },
          { icon: '⚡', title: 'Automatizavimas', desc: 'Verslo procesų automatizavimas su AI agentais' },
          { icon: '📊', title: 'Duomenų analizė', desc: 'AI analizuoja jūsų verslo duomenis ir teikia įžvalgas' },
          { icon: '📝', title: 'Turinio kūrimas', desc: 'AI generuoja turinį jūsų svetainei ir socialiniams tinklams' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{desc}</div>
            <Link href="/dashboard/orders/new" style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Užklausti →</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
