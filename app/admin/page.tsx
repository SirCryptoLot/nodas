import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ count: userCount }, { count: orderCount }, { count: siteCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('generated_sites').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>📊 Admin statistika</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {[
          { label: '👥 Vartotojai', value: userCount ?? 0 },
          { label: '📋 Užsakymai', value: orderCount ?? 0 },
          { label: '🌐 Svetainės', value: siteCount ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px 28px' }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#0f172a' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
