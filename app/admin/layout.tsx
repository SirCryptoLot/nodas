import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { adminSupabase, ADMIN_EMAILS } from '@/lib/admin'

const ADMIN_NAV = [
  { href: '/admin',           label: '📊 Analytics' },
  { href: '/admin/orders',    label: '📋 Užsakymai' },
  { href: '/admin/users',     label: '👥 Vartotojai' },
  { href: '/admin/blog',      label: '📝 Blog' },
  { href: '/admin/produktai', label: '🛒 Produktai' },
  { href: '/admin/kontaktai', label: '📬 Kontaktai' },
  { href: '/admin/uzrasai',   label: '🗒️ Užrašai' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  if (!ADMIN_EMAILS.includes(user.email ?? '')) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) redirect('/dashboard')
  }

  // Pending orders count for badge
  const { count: pendingCount } = await adminSupabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', left: 0, top: 0 }}>
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
            nodas<span style={{ color: '#3b82f6' }}>.lt</span>
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <nav style={{ padding: '10px 0', flex: 1, overflowY: 'auto' }}>
          {ADMIN_NAV.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', fontSize: 13, color: '#94a3b8',
              textDecoration: 'none', margin: '1px 8px', borderRadius: 6,
            }}>
              <span>{label}</span>
              {href === '/admin/orders' && (pendingCount ?? 0) > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, minWidth: 18, textAlign: 'center' }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>{user.email}</div>
          <Link href="/dashboard" style={{ display: 'block', color: '#64748b', fontSize: 12, textDecoration: 'none', padding: '6px 0' }}>
            ← Valdymas
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div style={{ marginLeft: 220, flex: 1, background: '#f1f5f9', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}
