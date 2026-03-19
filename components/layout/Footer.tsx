import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{
      background: '#0f172a', color: '#94a3b8', padding: '28px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13,
    }}>
      <div>© {new Date().getFullYear()} nodas.lt — IT paslaugos Lietuvoje</div>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link href="/privatumas" style={{ color: '#60a5fa', textDecoration: 'none' }}>Privatumo politika</Link>
        <a href="mailto:info@nodas.lt" style={{ color: '#60a5fa', textDecoration: 'none' }}>info@nodas.lt</a>
      </div>
    </footer>
  )
}
