'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const NAV_LINKS = [
  { href: '/#paslaugos', label: 'Paslaugos' },
  { href: '/#apie', label: 'Apie' },
  { href: '/blog', label: 'Blog' },
  { href: '/#kontaktai', label: 'Kontaktai' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#fff', borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size={22} />
        </Link>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/auth/login" style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Prisijungti →
          </Link>
        </div>

        {/* Mobile: login + hamburger */}
        <div className="show-mobile" style={{ alignItems: 'center', gap: 12 }}>
          <Link href="/auth/login" style={{ background: '#2563eb', color: '#fff', padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Prisijungti
          </Link>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}
            aria-label="Meniu"
          >
            <span style={{ display: 'block', width: 22, height: 2, background: '#0f172a', borderRadius: 2, transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#0f172a', borderRadius: 2, opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#0f172a', borderRadius: 2, transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 0 16px' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '12px 8px', fontSize: 15, fontWeight: 500, color: '#0f172a', textDecoration: 'none', borderBottom: '1px solid #f8fafc' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
