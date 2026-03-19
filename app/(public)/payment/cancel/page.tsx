import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>❌</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#991b1b', marginBottom: 12 }}>Mokėjimas atšauktas</h1>
      <p style={{ color: '#64748b', marginBottom: 28 }}>Mokėjimas nebuvo baigtas. Galite bandyti dar kartą.</p>
      <Link href="/parduotuve/krepselis" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
        ← Grįžti į krepšelį
      </Link>
    </div>
  )
}
