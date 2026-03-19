import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default async function ParduotuvePage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Parduotuvė</h1>
      <p style={{ color: '#64748b', marginBottom: 40 }}>Skaitmeniniai ir fiziniai IT produktai</p>
      {(!products || products.length === 0) ? (
        <p style={{ color: '#94a3b8' }}>Prekių kol kas nėra.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
          {products.map((p: Product) => (
            <Link key={p.id} href={`/parduotuve/${p.slug}`} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#2563eb', marginBottom: 8 }}>€{p.price}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>{p.type === 'digital' ? 'Skaitmeninis' : 'Fizinis'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
