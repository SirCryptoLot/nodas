'use client'
import { useState, useEffect } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLink = (href: string, icon: string, label: string, key: string) => (
    <Link key={key} href={href} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
      fontSize: 13, fontWeight: pathname === href ? 600 : 500,
      color: pathname === href ? '#1e40af' : '#475569',
      background: pathname === href ? '#eff6ff' : 'transparent',
      textDecoration: 'none', margin: '1px 8px', borderRadius: 8,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>{label}
    </Link>
  )

  const sidebarContent = (
    <aside className={`dashboard-sidebar${mobileOpen ? ' open' : ''}`}
      style={{ background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={22} />
        {/* Close button on mobile */}
        <button className="show-mobile" onClick={() => setMobileOpen(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b', padding: 4 }}>
          ✕
        </button>
      </div>
      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '6px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pagrindinis</div>
        {NAV_MAIN.map(({ href, icon, label }) => navLink(href, icon, label, href + label))}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Paslaugos</div>
        {NAV_SERVICES.map(({ href, icon, label }) => navLink(href, icon, label, label))}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Kita</div>
        {navLink('/dashboard/profile', '👤', 'Profilis', 'profilis')}
      </nav>
      <div style={{ padding: '14px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#1e40af', flexShrink: 0 }}>
          {userName[0]?.toUpperCase() ?? 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>{tier} planas</div>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, flexShrink: 0 }} title="Atsijungti">↩</button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile hamburger button — fixed top-left */}
      <button
        className="show-mobile"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed', top: 14, left: 16, zIndex: 60,
          background: '#2563eb', color: '#fff', border: 'none',
          borderRadius: 8, width: 38, height: 38, cursor: 'pointer',
          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Atidaryti meniu"
      >
        ☰
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {sidebarContent}
    </>
  )
}
