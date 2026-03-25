import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// ── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:     { label: 'Laukiama',  color: '#92400e', bg: '#fef9c3', dot: '#f59e0b' },
  in_progress: { label: 'Vykdoma',  color: '#1e40af', bg: '#dbeafe', dot: '#2563eb' },
  completed:   { label: 'Atlikta',  color: '#166534', bg: '#dcfce7', dot: '#16a34a' },
  cancelled:   { label: 'Atšaukta', color: '#64748b', bg: '#f1f5f9', dot: '#94a3b8' },
}

// ── SVG icons ────────────────────────────────────────────────────────────────

function IcoWrench() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg> }
function IcoGlobe() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></svg> }
function IcoCode() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> }
function IcoShield() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> }
function IcoBot() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 16v.01M16 16v.01" /></svg> }
function IcoSearch() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> }
function IcoServer() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg> }
function IcoShop() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> }
function IcoCheck() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> }
function IcoClipboard() { return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg> }

const SERVICE_ICONS: Record<string, () => JSX.Element> = {
  'Web Remontas': IcoWrench,
  'WordPress / CMS': IcoGlobe,
  'Custom Dev': IcoCode,
  'Web SPA priežiūra': IcoShield,
  'AI Sprendimai': IcoBot,
  'SEO': IcoSearch,
  'Serverių diegimas': IcoServer,
  'El. parduotuvė': IcoShop,
}

const SERVICE_COLORS: Record<string, { bg: string; color: string }> = {
  'Web Remontas':      { bg: '#eff6ff', color: '#2563eb' },
  'WordPress / CMS':   { bg: '#fefce8', color: '#ca8a04' },
  'Custom Dev':        { bg: '#f1f5f9', color: '#475569' },
  'Web SPA priežiūra': { bg: '#f0fdf4', color: '#16a34a' },
  'AI Sprendimai':     { bg: '#f5f3ff', color: '#7c3aed' },
  'SEO':               { bg: '#fce7f3', color: '#db2777' },
  'Serverių diegimas': { bg: '#fff7ed', color: '#ea580c' },
  'El. parduotuvė':    { bg: '#ecfdf5', color: '#059669' },
}

function parseNotes(notes: string) {
  return notes.split('\n').filter(Boolean).map(line => {
    const idx = line.indexOf(': ')
    if (idx > 0 && idx < 40) return { label: line.slice(0, idx), value: line.slice(idx + 2) }
    return { label: '', value: line }
  })
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const topbar = (
    <div style={{
      background: '#fff', borderBottom: '1px solid #e2e8f0', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingLeft: 72, paddingRight: 28,
    }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Mano užsakymai</div>
      <Link href="/dashboard/orders/new"
        className="hover:bg-orange-600 transition-colors duration-200"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#f97316', color: '#fff',
          padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none',
        }}
      >
        + Naujas
      </Link>
    </div>
  )

  if (!orders || orders.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        {topbar}
        <div style={{ padding: 28 }}>
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
            padding: '56px 48px', textAlign: 'center', maxWidth: 480,
          }}>
            <div style={{ color: '#cbd5e1', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><IcoClipboard /></div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Dar nėra užsakymų</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Užsakykite paslaugą ir stebėkite jos progresą čia</div>
            <Link href="/dashboard/orders/new"
              className="hover:bg-orange-600 transition-colors duration-200"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#f97316', color: '#fff',
                padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}
            >
              Pateikti pirmą užsakymą →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {topbar}
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => {
            const st = STATUS[order.status] ?? STATUS.pending
            const IconComp = SERVICE_ICONS[order.service_type] ?? IcoClipboard
            const iconStyle = SERVICE_COLORS[order.service_type] ?? { bg: '#f1f5f9', color: '#475569' }
            const parsedNotes = order.notes ? parseNotes(order.notes) : []
            const detailRows = parsedNotes.filter(r => !r.label.toLowerCase().includes('kontakt'))
            const steps = ['pending', 'in_progress', 'completed']
            const currentIdx = steps.indexOf(order.status)

            return (
              <div key={order.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: iconStyle.bg, color: iconStyle.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <IconComp />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{order.service_type}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      Pateikta {new Date(order.created_at).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  {order.price != null && (
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#059669', flexShrink: 0 }}>€{order.price}</div>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '6px 14px', borderRadius: 999,
                    background: st.bg, flexShrink: 0,
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{st.label}</span>
                  </div>
                </div>

                {/* Progress stepper */}
                {order.status !== 'cancelled' && (
                  <div style={{ padding: '0 22px 18px' }}>
                    <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
                      {steps.map((s, i) => {
                        const isPast = i < currentIdx
                        const isCurrent = i === currentIdx
                        const stepSt = STATUS[s]
                        return (
                          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {i > 0 && (
                              <div style={{
                                position: 'absolute', top: 11, left: '-50%', right: '50%', height: 2,
                                background: (isPast || isCurrent) ? '#2563eb' : '#e2e8f0', zIndex: 0,
                              }} />
                            )}
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%', zIndex: 1, position: 'relative',
                              border: `2px solid ${(isPast || isCurrent) ? '#2563eb' : '#e2e8f0'}`,
                              background: isCurrent ? '#2563eb' : isPast ? '#2563eb' : '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: (isPast || isCurrent) ? '#fff' : '#cbd5e1',
                            }}>
                              {isPast ? <IcoCheck /> : isCurrent ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} /> : null}
                            </div>
                            <div style={{ fontSize: 11, color: (isPast || isCurrent) ? '#1e40af' : '#94a3b8', marginTop: 5, fontWeight: isCurrent ? 700 : 400 }}>
                              {stepSt.label}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Details */}
                {detailRows.length > 0 && (
                  <div style={{ padding: '0 22px 18px' }}>
                    <details>
                      <summary style={{ fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer', marginBottom: 8, userSelect: 'none' }}>
                        Pateikta informacija ▾
                      </summary>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginTop: 6 }}>
                        {detailRows.map((row, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, marginBottom: i < detailRows.length - 1 ? 6 : 0 }}>
                            {row.label
                              ? <><span style={{ color: '#64748b', fontWeight: 600, minWidth: 130, flexShrink: 0 }}>{row.label}</span><span style={{ color: '#0f172a' }}>{row.value}</span></>
                              : <span style={{ color: '#0f172a' }}>{row.value}</span>
                            }
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}

                {/* Status notes */}
                {order.status === 'pending' && (
                  <div style={{ margin: '0 22px 18px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e' }}>
                    Jūsų užsakymas peržiūrimas. Susisieksime per 24 valandas el. paštu <strong>info@nodas.lt</strong>.
                  </div>
                )}
                {order.status === 'in_progress' && (
                  <div style={{ margin: '0 22px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e40af' }}>
                    Šiuo metu dirbame prie jūsų užsakymo. Iškilus klausimų — <a href="mailto:info@nodas.lt" style={{ color: '#1e40af', fontWeight: 700 }}>info@nodas.lt</a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
