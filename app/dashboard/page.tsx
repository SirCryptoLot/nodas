import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const SERVICES = [
  { s: 'remontas',  icon: '🔧', name: 'Web Remontas',      price: 'nuo €39' },
  { s: 'ai-site',  icon: '🤖', name: 'AI Svetainė',        price: '€149' },
  { s: 'wordpress', icon: '📦', name: 'WordPress / CMS',    price: 'nuo €349' },
  { s: 'custom',   icon: '⚡', name: 'Custom Dev',          price: 'Individualus' },
  { s: 'spa',      icon: '🛡️', name: 'Web SPA priežiūra',  price: 'nuo €29/mėn' },
  { s: 'ai',       icon: '🧠', name: 'AI Sprendimai',       price: 'Individualus' },
  { s: 'seo',      icon: '🔍', name: 'SEO',                 price: 'Individualus' },
  { s: 'server',   icon: '🖥️', name: 'Serverių diegimas',  price: 'Individualus' },
  { s: 'shop',     icon: '🛒', name: 'El. parduotuvė',      price: 'Individualus' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: sites }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('full_name, tier').eq('id', user.id).single(),
    supabase.from('generated_sites').select('id').eq('user_id', user.id),
    supabase.from('orders').select('id, status').eq('user_id', user.id),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Vartotojas'
  const siteCount = sites?.length ?? 0
  const orderCount = orders?.length ?? 0
  const activeOrders = orders?.filter(o => o.status === 'in_progress').length ?? 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length ?? 0

  return (
    <div style={{ padding: '0 28px 28px' }}>
      {/* Topbar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, marginLeft: -28, marginRight: -28, paddingLeft: 72, paddingRight: 28,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Sveiki sugrįžę, {firstName} 👋</div>
        <Link href="/dashboard/orders/new" style={{
          background: '#2563eb', color: '#fff', padding: '7px 16px',
          borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}>
          + Naujas užsakymas
        </Link>
      </div>

      {/* Tier banner */}
      <div style={{
        background: 'linear-gradient(135deg,#1e40af,#2563eb)', borderRadius: 12,
        padding: '18px 20px', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Jūsų planas</div>
          <div style={{ fontSize: 18, fontWeight: 800, textTransform: 'capitalize' }}>{profile?.tier ?? 'simple'}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>
            {profile?.tier === 'simple' ? '1 AI svetainė · Pagrindinis funkcionalumas' : 'Neribotos svetainės · Premium funkcionalumas'}
          </div>
        </div>
        <Link href="/dashboard/orders/new?s=spa" style={{
          background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px',
          borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap',
        }}>
          Atnaujinti planą →
        </Link>
      </div>

      {/* Stats */}
      <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: '🌐 Svetainės', value: siteCount, sub: `iš ${profile?.tier === 'simple' ? '1' : '∞'} leidžiamų`, href: '/dashboard/sites' },
          { label: '📋 Užsakymai', value: orderCount, sub: `${activeOrders} vykdomi`, href: '/dashboard/orders' },
          { label: '⏳ Laukiama', value: pendingOrders, sub: 'atsakymo', href: '/dashboard/orders' },
          { label: '🛡️ SPA planas', value: '—', sub: 'užsakyti →', href: '/dashboard/orders/new?s=spa' },
        ].map(({ label, value, sub, href }) => (
          <Link key={label} href={href} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px', textDecoration: 'none' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>
          </Link>
        ))}
      </div>

      {/* All services grid */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Visos paslaugos</div>
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {SERVICES.map(({ s, icon, name, price }) => (
            <Link key={s} href={`/dashboard/orders/new?s=${s}`} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
              padding: '16px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{name}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{price}</div>
              </div>
              <span style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: 16, flexShrink: 0 }}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
