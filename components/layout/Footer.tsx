import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '40px 24px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Top row */}
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
              nodas<span style={{ color: '#60a5fa' }}>.lt</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: '0 0 16px' }}>
              Lietuviškas IT specialistas. Web remontas, AI svetainės, serveriai ir daugiau.
            </p>
            <a href="mailto:info@nodas.lt" style={{ color: '#60a5fa', fontSize: 13, textDecoration: 'none' }}>
              ✉️ info@nodas.lt
            </a>
          </div>

          {/* Paslaugos */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
              Paslaugos
            </div>
            {[
              { href: '/#paslaugos', label: 'Web Remontas' },
              { href: '/#paslaugos', label: 'AI Svetainė' },
              { href: '/#paslaugos', label: 'WordPress / CMS' },
              { href: '/#paslaugos', label: 'Web SPA priežiūra' },
              { href: '/#paslaugos', label: 'SEO' },
            ].map(({ href, label }) => (
              <Link key={label} href={href} style={{ display: 'block', fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 8 }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Nuorodos */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
              Nuorodos
            </div>
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/parduotuve', label: 'Parduotuvė' },
              { href: '/#apie', label: 'Apie' },
              { href: '/#kontaktai', label: 'Kontaktai' },
              { href: '/auth/login', label: 'Prisijungti' },
            ].map(({ href, label }) => (
              <Link key={label} href={href} style={{ display: 'block', fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 8 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 13, color: '#475569' }}>
            © {new Date().getFullYear()} nodas.lt — IT paslaugos Lietuvoje
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/privatumas" style={{ color: '#475569', fontSize: 13, textDecoration: 'none' }}>Privatumo politika</Link>
            <span style={{ color: '#1e293b' }}>🇱🇹</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
