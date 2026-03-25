'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TIER_LABELS: Record<string, string> = {
  simple:     'Pradedantysis',
  pro:        'Profesionalus',
  business:   'Verslo',
  enterprise: 'Enterprise',
}

const TIER_COLORS: Record<string, string> = {
  simple:     '#64748b',
  pro:        '#2563eb',
  business:   '#7c3aed',
  enterprise: '#f97316',
}

// ── Inline SVG icons ────────────────────────────────────────────────────────

function IcoHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IcoGlobe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </svg>
  )
}

function IcoClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function IcoWrench() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function IcoShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IcoCode() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function IcoBot() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="10" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4M8 16v.01M16 16v.01" />
    </svg>
  )
}

function IcoSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IcoServer() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}

function IcoShoppingBag() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" x2="21" y1="6" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function IcoUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

function IcoLogOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function IcoPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  )
}

function IcoChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ── Nav data ────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { href: '/dashboard',        Icon: IcoHome,      label: 'Valdymas' },
  { href: '/dashboard/sites',  Icon: IcoGlobe,     label: 'Mano svetainės' },
  { href: '/dashboard/orders', Icon: IcoClipboard, label: 'Užsakymai' },
]

const NAV_SERVICES = [
  { href: '/dashboard/orders/new?s=remontas',  Icon: IcoWrench,      label: 'Web Remontas' },
  { href: '/dashboard/orders/new?s=wordpress', Icon: IcoGlobe,       label: 'WordPress / CMS' },
  { href: '/dashboard/orders/new?s=custom',    Icon: IcoCode,        label: 'Custom Dev' },
  { href: '/dashboard/orders/new?s=spa',       Icon: IcoShield,      label: 'Web SPA' },
  { href: '/dashboard/orders/new?s=ai',        Icon: IcoBot,         label: 'AI Sprendimai' },
  { href: '/dashboard/orders/new?s=seo',       Icon: IcoSearch,      label: 'SEO' },
  { href: '/dashboard/orders/new?s=server',    Icon: IcoServer,      label: 'Serveriai' },
  { href: '/dashboard/orders/new?s=shop',      Icon: IcoShoppingBag, label: 'El. parduotuvė' },
]

// ── Sidebar ─────────────────────────────────────────────────────────────────

export function DashboardSidebar({ userName, tier }: { userName: string; tier: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string) =>
    href.includes('?s=') ? pathname === '/dashboard/orders/new' : pathname === href

  const NavLink = ({ href, Icon, label }: { href: string; Icon: () => JSX.Element; label: string }) => {
    const active = isActive(href)
    return (
      <Link href={href} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', margin: '1px 8px', borderRadius: 8,
        fontSize: 13, fontWeight: active ? 600 : 400,
        color: active ? '#fff' : '#94a3b8',
        background: active ? 'rgba(37,99,235,0.4)' : 'transparent',
        textDecoration: 'none', transition: 'background 150ms, color 150ms',
      }}>
        <span style={{ display: 'flex', flexShrink: 0, opacity: active ? 1 : 0.7 }}><Icon /></span>
        {label}
      </Link>
    )
  }

  const sidebarContent = (
    <aside
      className={`dashboard-sidebar${mobileOpen ? ' open' : ''}`}
      style={{
        background: '#0f172a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'fixed', left: 0, top: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '18px 18px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo size={22} />
        <button
          className="show-mobile"
          onClick={() => setMobileOpen(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b', padding: 4 }}
          aria-label="Uždaryti meniu"
        >
          ✕
        </button>
      </div>

      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
        {/* New order */}
        <div style={{ margin: '6px 10px 12px' }}>
          <Link href="/dashboard/orders/new" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '10px', background: '#f97316', color: '#fff',
            borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700,
          }}>
            <IcoPlus />
            Naujas užsakymas
          </Link>
        </div>

        {/* Main nav */}
        <div style={{ padding: '4px 14px 4px', fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Pagrindinis
        </div>
        {NAV_MAIN.map(item => <NavLink key={item.href} {...item} />)}

        {/* Services */}
        <button
          onClick={() => setServicesOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '10px 14px 4px',
            fontSize: 10, fontWeight: 700, color: '#334155',
            textTransform: 'uppercase', letterSpacing: '0.8px',
            background: 'none', border: 'none', cursor: 'pointer',
            marginTop: 8,
          }}
        >
          <span>Paslaugos</span>
          <span style={{ transform: servicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex', color: '#475569' }}>
            <IcoChevronDown />
          </span>
        </button>
        {servicesOpen && NAV_SERVICES.map(item => <NavLink key={item.label} {...item} />)}

        {/* Other */}
        <div style={{ padding: '14px 14px 4px', fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 8 }}>
          Kita
        </div>
        <NavLink href="/dashboard/profile" Icon={IcoUser} label="Profilis" />
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #1e40af, #2563eb)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {userName[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: TIER_COLORS[tier] ?? '#64748b', marginTop: 1 }}>
              {TIER_LABELS[tier] ?? tier}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer',
          }}
        >
          <IcoLogOut />
          Atsijungti
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="show-mobile"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed', top: 14, left: 16, zIndex: 60,
          background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, width: 38, height: 38, cursor: 'pointer',
          fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Atidaryti meniu"
      >
        ☰
      </button>
      <div className={`sidebar-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />
      {sidebarContent}
    </>
  )
}
