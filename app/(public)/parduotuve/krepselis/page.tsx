'use client'
import { useState, useEffect } from 'react'

interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export default function KrepselisPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setItems(JSON.parse(stored))
  }, [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleCheckout = async () => {
    if (!items.length) return
    setLoading(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })), total }),
      })
      const data = await res.json()
      if (data.payseraUrl) {
        localStorage.removeItem('cart')
        window.location.href = data.payseraUrl
      }
    } catch { setLoading(false) }
  }

  if (!items.length) return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Krepšelis tuščias</h1>
      <a href="/parduotuve" style={{ color: '#2563eb', fontSize: 14 }}>← Į parduotuvę</a>
    </div>
  )

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>🛒 Krepšelis</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {items.map(item => (
          <div key={item.product_id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Kiekis: {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 800, color: '#2563eb' }}>€{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Iš viso:</span>
        <span style={{ fontWeight: 900, fontSize: 22, color: '#2563eb' }}>€{total.toFixed(2)}</span>
      </div>
      <button onClick={handleCheckout} disabled={loading} style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '14px', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Nukreipiama...' : 'Apmokėti per Paysera →'}
      </button>
    </div>
  )
}
