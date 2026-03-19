import Link from 'next/link'

const PLANS = [
  { name: 'Basic', price: '€29/mėn', features: ['Monitoringas', 'Mėnesiniai backupai', 'El. pašto palaikymas'] },
  { name: 'Pro', price: '€59/mėn', features: ['Monitoringas 24/7', 'Savaitiniai backupai', 'Greitas atsakas', 'Turinio keitimai (2h/mėn)'] },
  { name: 'Enterprise', price: '€129/mėn', features: ['Monitoringas 24/7', 'Kasdieniai backupai', 'Prioritetinis palaikymas', 'Turinio keitimai (8h/mėn)', 'SEO stebėjimas'] },
]

export default function SpaPage() {
  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🛡️ Web SPA priežiūra</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>Mėnesiniai priežiūros planai jūsų svetainei</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 900 }}>
        {PLANS.map(({ name, price, features }) => (
          <div key={name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{name}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#2563eb', marginBottom: 16 }}>{price}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
              {features.map(f => (
                <li key={f} style={{ fontSize: 13, color: '#475569', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#2563eb' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
              Užsisakyti →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
