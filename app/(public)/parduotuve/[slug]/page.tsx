import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single()
  if (!product) notFound()

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px' }}>
      <Link href="/parduotuve" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Parduotuvė</Link>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>{product.name}</h1>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#2563eb', marginBottom: 16 }}>€{product.price}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, textTransform: 'uppercase' }}>{product.type === 'digital' ? 'Skaitmeninis produktas' : 'Fizinis produktas'}</div>
      <Link href="/parduotuve/krepselis" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
        Į krepšelį →
      </Link>
    </div>
  )
}
