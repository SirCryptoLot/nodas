import Link from 'next/link'

export default function CheckoutPage() {
  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Apmokėjimas</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Atsiskaitymas vykdomas per Paysera mokėjimų sistemą.</p>
      <Link href="/parduotuve/krepselis" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
        ← Grįžti į krepšelį
      </Link>
    </div>
  )
}
