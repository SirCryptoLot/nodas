import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'

export default async function AdminProductaiPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>🛒 Produktai</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Pavadinimas', 'Kaina', 'Tipas', 'Likutis'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products?.map((p: Product) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: 700 }}>€{p.price}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>{p.type === 'digital' ? 'Skaitmeninis' : 'Fizinis'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{p.stock ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
