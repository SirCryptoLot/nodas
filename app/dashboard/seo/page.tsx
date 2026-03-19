import Link from 'next/link'

export default function SeoPage() {
  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🔍 SEO paslaugos</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>Padidiname jūsų svetainės matomumą Google paieškoje</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
        {[
          { title: 'SEO auditas', desc: 'Pilna svetainės SEO analizė su patarimais', price: 'nuo €99' },
          { title: 'Raktažodžių tyrimas', desc: 'Jūsų sričiai aktualių raktažodžių analizė', price: 'nuo €79' },
          { title: 'On-page optimizavimas', desc: 'Svetainės turinio ir techniniai SEO patobulinimai', price: 'nuo €149' },
          { title: 'Mėnesinis SEO', desc: 'Nuolatinis SEO darbas ir rezultatų stebėjimas', price: 'nuo €199/mėn' },
        ].map(({ title, desc, price }) => (
          <div key={title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>{price}</div>
              <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Užsisakyti</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
