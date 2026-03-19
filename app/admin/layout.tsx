import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ADMIN_NAV = [
  { href: '/admin', label: '📊 Statistika' },
  { href: '/admin/users', label: '👥 Vartotojai' },
  { href: '/admin/orders', label: '📋 Užsakymai' },
  { href: '/admin/sites', label: '🌐 Svetainės' },
  { href: '/admin/blog', label: '📝 Blog' },
  { href: '/admin/produktai', label: '🛒 Produktai' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <aside style={{ width: 220, background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', left: 0, top: 0 }}>
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #1e293b', fontSize: 16, fontWeight: 800, color: '#93c5fd' }}>
          nodas Admin
        </div>
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {ADMIN_NAV.map(({ href, label }) => (
            <Link key={href} href={href} style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#94a3b8', textDecoration: 'none', margin: '1px 8px', borderRadius: 6 }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b' }}>
          <Link href="/dashboard" style={{ color: '#64748b', fontSize: 12, textDecoration: 'none' }}>← Dashboard</Link>
        </div>
      </aside>
      <div style={{ marginLeft: 220, flex: 1, padding: 28 }}>
        {children}
      </div>
    </div>
  )
}
