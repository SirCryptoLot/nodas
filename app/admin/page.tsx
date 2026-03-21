import { adminSupabase } from '@/lib/admin'
import Link from 'next/link'

const TIER_LABELS: Record<string, string> = {
  simple: 'Pradedantysis', pro: 'Profesionalus', business: 'Verslo', enterprise: 'Enterprise',
}
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', in_progress: '#3b82f6', completed: '#10b981', cancelled: '#94a3b8',
}
const STATUS_LT: Record<string, string> = {
  pending: 'Laukiama', in_progress: 'Vykdoma', completed: 'Atlikta', cancelled: 'Atšaukta',
}

export default async function AdminPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: totalUsers },
    { count: newUsersMonth },
    { count: totalOrders },
    { count: pendingOrders },
    { count: activeOrders },
    { count: doneOrders },
    { count: totalContacts },
    { data: revenueData },
    { data: recentOrders },
    { data: recentUsers },
    { data: allOrders },
  ] = await Promise.all([
    adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
    adminSupabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    adminSupabase.from('orders').select('id', { count: 'exact', head: true }),
    adminSupabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    adminSupabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
    adminSupabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    adminSupabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
    adminSupabase.from('orders').select('price').eq('status', 'completed').not('price', 'is', null),
    adminSupabase.from('orders').select('id, service_type, status, created_at').order('created_at', { ascending: false }).limit(10),
    adminSupabase.from('profiles').select('id, full_name, tier, created_at').order('created_at', { ascending: false }).limit(5),
    adminSupabase.from('orders').select('status'),
  ])

  const revenue = (revenueData ?? []).reduce((s, o) => s + (Number(o.price) ?? 0), 0)
  const total = totalOrders ?? 0
  const byStatus = ['pending', 'in_progress', 'completed', 'cancelled'].map(s => {
    const count = (allOrders ?? []).filter(o => o.status === s).length
    return { status: s, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }
  })

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>📊 Analytics</h1>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          {now.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Vartotojai', value: totalUsers ?? 0, sub: `+${newUsersMonth ?? 0} šį mėnesį`, icon: '👥', href: '/admin/users' },
          { label: 'Užsakymai', value: total, sub: `${pendingOrders ?? 0} laukia · ${activeOrders ?? 0} aktyvūs`, icon: '📋', href: '/admin/orders' },
          { label: 'Pajamos', value: `€${revenue}`, sub: `${doneOrders ?? 0} atlikta`, icon: '💰', href: '/admin/orders' },
          { label: 'Kontaktai', value: totalContacts ?? 0, sub: 'formos užklausos', icon: '📬', href: '/admin/kontaktai' },
        ].map(({ label, value, sub, icon, href }) => (
          <Link key={label} href={href} style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <span style={{ fontSize: 18 }}>{icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Orders by status */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Užsakymai pagal būseną</div>
          {byStatus.map(({ status, count, pct }) => (
            <div key={status} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{STATUS_LT[status]}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{count} <span style={{ color: STATUS_COLORS[status] }}>({pct}%)</span></span>
              </div>
              <div style={{ height: 7, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLORS[status], borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent signups */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Nauji vartotojai</div>
            <Link href="/admin/users" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Visi →</Link>
          </div>
          {(recentUsers ?? []).map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1e40af', flexShrink: 0 }}>
                {(u.full_name ?? '?')[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{u.full_name ?? 'Nežinomas'}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{TIER_LABELS[u.tier] ?? u.tier}</div>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(u.created_at).toLocaleDateString('lt-LT')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 22, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>📋 Paskutiniai užsakymai</div>
          <Link href="/admin/orders" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Valdyti →</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Paslauga', 'Statusas', 'Data'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(recentOrders ?? []).map(o => (
              <tr key={o.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{o.service_type}</td>
                <td style={{ padding: '10px 0' }}>
                  <span style={{ background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status], padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    {STATUS_LT[o.status] ?? o.status}
                  </span>
                </td>
                <td style={{ padding: '10px 0', fontSize: 12, color: '#94a3b8' }}>{new Date(o.created_at).toLocaleDateString('lt-LT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
