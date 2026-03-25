import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// ── SVG icons ────────────────────────────────────────────────────────────────

function IcoWrench() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
}
function IcoGlobe() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></svg>
}
function IcoCode() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
}
function IcoShield() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
}
function IcoBot() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 16v.01M16 16v.01" /></svg>
}
function IcoSearch() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
}
function IcoServer() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg>
}
function IcoShop() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
}
function IcoArrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  { s: 'remontas',  Icon: IcoWrench, name: 'Web Remontas',     price: 'nuo €39',    bg: '#eff6ff', color: '#2563eb' },
  { s: 'wordpress', Icon: IcoGlobe,  name: 'WordPress / CMS',  price: 'nuo €349',   bg: '#fefce8', color: '#ca8a04' },
  { s: 'custom',    Icon: IcoCode,   name: 'Custom Dev',        price: 'Individualus', bg: '#f1f5f9', color: '#475569' },
  { s: 'spa',       Icon: IcoShield, name: 'Web SPA priežiūra', price: 'nuo €29/mėn', bg: '#f0fdf4', color: '#16a34a' },
  { s: 'ai',        Icon: IcoBot,    name: 'AI Sprendimai',     price: 'Individualus', bg: '#f5f3ff', color: '#7c3aed' },
  { s: 'seo',       Icon: IcoSearch, name: 'SEO',               price: 'Individualus', bg: '#fce7f3', color: '#db2777' },
  { s: 'server',    Icon: IcoServer, name: 'Serverių diegimas', price: 'Individualus', bg: '#fff7ed', color: '#ea580c' },
  { s: 'shop',      Icon: IcoShop,   name: 'El. parduotuvė',   price: 'Individualus', bg: '#ecfdf5', color: '#059669' },
]

const TIER_LABELS: Record<string, string> = {
  simple:     'Pradedantysis',
  pro:        'Profesionalus',
  business:   'Verslo',
  enterprise: 'Enterprise',
}

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
  const tierLabel = TIER_LABELS[profile?.tier ?? 'simple'] ?? 'Pradedantysis'
  const isSimple = (profile?.tier ?? 'simple') === 'simple'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 72, paddingRight: 28,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
          Sveiki sugrįžę, <strong>{firstName}</strong> 👋
        </div>
        <Link href="/dashboard/orders/new"
          className="inline-flex items-center gap-2 hover:bg-orange-600 transition-colors duration-200"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#f97316', color: '#fff',
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}
        >
          + Naujas užsakymas
        </Link>
      </div>

      <div style={{ padding: '28px 28px 40px' }}>
        {/* ── Tier banner ──────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
          borderRadius: 16, padding: '20px 24px', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
              Jūsų planas
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{tierLabel}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
              {isSimple ? 'Pagrindinis funkcionalumas' : 'Premium funkcionalumas · Prioritetinis aptarnavimas'}
            </div>
          </div>
          <Link href="/dashboard/orders/new?s=spa"
            className="hover:bg-white/30 transition-colors duration-200"
            style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap',
            }}
          >
            Atnaujinti planą →
          </Link>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Svetainės', value: siteCount, sub: `iš ${isSimple ? '1' : '∞'} leidžiamų`, href: '/dashboard/sites', accent: '#2563eb' },
            { label: 'Užsakymai', value: orderCount, sub: `${activeOrders} vykdomi`, href: '/dashboard/orders', accent: '#7c3aed' },
            { label: 'Laukiama', value: pendingOrders, sub: 'atsakymo', href: '/dashboard/orders', accent: '#f97316' },
            { label: 'SPA planas', value: '—', sub: 'užsakyti →', href: '/dashboard/orders/new?s=spa', accent: '#16a34a' },
          ].map(({ label, value, sub, href, accent }) => (
            <Link key={label} href={href}
              className="hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', textDecoration: 'none' }}
            >
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: accent, marginTop: 5, fontWeight: 600 }}>{sub}</div>
            </Link>
          ))}
        </div>

        {/* ── All services ─────────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Visos paslaugos</div>
          <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {SERVICES.map(({ s, Icon, name, price, bg, color }) => (
              <Link key={s} href={`/dashboard/orders/new?s=${s}`}
                className="hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
                  padding: '16px 14px', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color, flexShrink: 0,
                }}>
                  <Icon />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{price}</div>
                </div>
                <span style={{ color: '#cbd5e1', display: 'flex', flexShrink: 0 }}><IcoArrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
