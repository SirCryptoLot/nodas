'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_MAIN = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/sites', icon: '🌐', label: 'Mano svetainės' },
  { href: '/dashboard/orders', icon: '📋', label: 'Užsakymai' },
]
const NAV_SERVICES = [
  { href: '/dashboard/sites', icon: '🤖', label: 'AI Svetainė' },
  { href: '/dashboard/repair', icon: '🔧', label: 'Web Remontas' },
  { href: '/dashboard/spa', icon: '🛡️', label: 'Web SPA' },
  { href: '/dashboard/ai', icon: '🧠', label: 'AI Sprendimai' },
  { href: '/dashboard/seo', icon: '🔍', label: 'SEO' },
]

export function DashboardSidebar({ userName, tier }: { userName: string; tier: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <Logo size={24} />
      </div>
      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '6px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pagrindinis</div>
        {NAV_MAIN.map(({ href, icon, label }) => (
          <Link key={href} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
            fontSize: 13, fontWeight: pathname === href ? 600 : 500,
            color: pathname === href ? '#1e40af' : '#475569',
            background: pathname === href ? '#eff6ff' : 'transparent',
            textDecoration: 'none', margin: '1px 8px', borderRadius: 8,
          }}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Paslaugos</div>
        {NAV_SERVICES.map(({ href, icon, label }) => (
          <Link key={label} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
            fontSize: 13, fontWeight: 500, color: '#475569',
            textDecoration: 'none', margin: '1px 8px', borderRadius: 8,
          }}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Kita</div>
        <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#475569', textDecoration: 'none', margin: '1px 8px', borderRadius: 8 }}>
          <span>👤</span>Profilis
        </Link>
      </nav>
      <div style={{ padding: '14px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#1e40af' }}>
          {userName[0]?.toUpperCase() ?? 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{userName}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>{tier} planas</div>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} title="Atsijungti">↩</button>
      </div>
    </aside>
  )
}
