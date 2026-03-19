import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function Navbar() {
  return (
    <nav style={{
      background: '#fff', borderBottom: '1px solid #e2e8f0',
      padding: '0 40px', height: 64, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>
      <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
        {[
          { href: '/#paslaugos', label: 'Paslaugos' },
          { href: '/#kainos', label: 'Kainos' },
          { href: '/blog', label: 'Blog' },
          { href: '/#kontaktai', label: 'Kontaktai' },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link href={href} style={{ color: '#475569', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/auth/login" style={{
        background: '#2563eb', color: '#fff', padding: '9px 20px',
        borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
      }}>
        Prisijungti →
      </Link>
    </nav>
  )
}
