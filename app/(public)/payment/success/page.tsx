import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#166534', marginBottom: 12 }}>Mokėjimas sėkmingas!</h1>
      <p style={{ color: '#64748b', marginBottom: 28 }}>Ačiū už pirkimą. Patvirtinimą gausite el. paštu.</p>
      <Link href="/parduotuve" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
        ← Grįžti į parduotuvę
      </Link>
    </div>
  )
}
