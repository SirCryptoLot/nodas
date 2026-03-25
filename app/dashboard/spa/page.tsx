import Link from 'next/link'

function IcoCheck() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
}

function IcoArrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
}

const PLANS = [
  {
    name: 'Bazinis',
    price: '€29',
    period: '/mėn',
    features: ['Uptime stebėjimas kas 15 min.', 'SSL sertifikato įspėjimas', 'Mėnesinė ataskaita', '1 turinio keitimas/mėn.'],
    popular: false,
    href: '/dashboard/orders/new?s=spa',
  },
  {
    name: 'Pro',
    price: '€59',
    period: '/mėn',
    features: ['Uptime stebėjimas kas 5 min.', 'Kasdieniniai backupai', '3 turinio keitimai/mėn.', 'Atsakymas per 8h'],
    popular: true,
    href: '/dashboard/orders/new?s=spa',
  },
  {
    name: 'Enterprise',
    price: '€129',
    period: '/mėn',
    features: ['Realaus laiko stebėjimas', 'CDN tinklas', 'SLA 99.9%', 'Avarinis atsakymas per 2h (24/7)'],
    popular: false,
    href: '/dashboard/orders/new?s=spa',
  },
]

export default function SpaPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Topbar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0', height: 56,
        display: 'flex', alignItems: 'center',
        paddingLeft: 72, paddingRight: 28,
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Web SPA priežiūra</div>
      </div>

      <div style={{ padding: 28 }}>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32, margin: '0 0 32px' }}>
          Mėnesiniai priežiūros planai jūsų svetainei — pasirinkite tinkamą.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 900, alignItems: 'center' }}>
          {PLANS.map(({ name, price, period, features, popular, href }) => (
            <div key={name} style={{
              background: popular ? 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)' : '#fff',
              border: popular ? 'none' : '1px solid #e2e8f0',
              borderRadius: 18, padding: popular ? 32 : 26,
              boxShadow: popular ? '0 10px 40px rgba(15,23,42,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              transform: popular ? 'scale(1.03)' : 'none',
            }}>
              {popular && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, #f97316, #fb923c)', color: '#fff',
                  fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 999,
                  whiteSpace: 'nowrap', letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>Populiariausias</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: popular ? '#93c5fd' : '#64748b', marginBottom: 12 }}>{name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 22 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: popular ? '#fff' : '#0f172a', letterSpacing: '-1px' }}>{price}</span>
                <span style={{ fontSize: 13, color: popular ? '#93c5fd' : '#94a3b8' }}>{period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: popular ? '#cbd5e1' : '#374151', lineHeight: 1.5 }}>
                    <span style={{ color: popular ? '#4ade80' : '#2563eb', display: 'flex', flexShrink: 0, marginTop: 1 }}><IcoCheck /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={href}
                className={`flex items-center justify-center gap-2 transition-colors duration-200 ${popular ? 'hover:bg-orange-600' : 'hover:bg-blue-900'}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: popular ? '#f97316' : '#1e40af', color: '#fff',
                  padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}
              >
                Užsisakyti <IcoArrow />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
