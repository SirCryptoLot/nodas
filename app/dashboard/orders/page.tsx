import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STATUS: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending:     { label: 'Laukiama',    color: '#92400e', bg: '#fef9c3', icon: '⏳' },
  in_progress: { label: 'Vykdoma',    color: '#1e40af', bg: '#dbeafe', icon: '⚙️' },
  done:        { label: 'Atlikta',    color: '#166534', bg: '#dcfce7', icon: '✅' },
  cancelled:   { label: 'Atšaukta',  color: '#64748b', bg: '#f1f5f9', icon: '❌' },
}

const SERVICE_ICONS: Record<string, string> = {
  'Web Remontas': '🔧',
  'WordPress / CMS': '📦',
  'Custom Dev': '⚡',
  'Web SPA priežiūra': '🛡️',
  'AI Sprendimai': '🧠',
  'SEO': '🔍',
  'Serverių diegimas': '🖥️',
  'El. parduotuvė': '🛒',
}

function parseNotes(notes: string) {
  const lines = notes.split('\n').filter(Boolean)
  return lines.map(line => {
    const colonIdx = line.indexOf(': ')
    if (colonIdx > 0 && colonIdx < 40) {
      return { label: line.slice(0, colonIdx), value: line.slice(colonIdx + 2) }
    }
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

  if (!orders || orders.length === 0) {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>📋 Mano užsakymai</h1>
          <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>+ Naujas</Link>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Dar nėra užsakymų</div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Užsakykite paslaugą ir stebėkite jos progresą čia</div>
          <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Pateikti pirmą užsakymą →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>📋 Mano užsakymai</h1>
        <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>+ Naujas</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(order => {
          const st = STATUS[order.status] ?? STATUS.pending
          const icon = SERVICE_ICONS[order.service_type] ?? '📋'
          const parsedNotes = order.notes ? parseNotes(order.notes) : []
          // Filter out contact line from public display
          const detailRows = parsedNotes.filter(r => !r.label.toLowerCase().includes('kontakt'))

          return (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{order.service_type}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    Pateikta {new Date(order.created_at).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                {order.price != null && (
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', flexShrink: 0 }}>€{order.price}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: st.bg, flexShrink: 0 }}>
                  <span style={{ fontSize: 14 }}>{st.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: st.color }}>{st.label}</span>
                </div>
              </div>

              {/* Status progress bar */}
              {order.status !== 'cancelled' && (
                <div style={{ padding: '0 20px 16px' }}>
                  <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
                    {['pending', 'in_progress', 'done'].map((s, i) => {
                      const steps = ['pending', 'in_progress', 'done']
                      const currentIdx = steps.indexOf(order.status)
                      const isPast = i < currentIdx
                      const isCurrent = i === currentIdx
                      const stepSt = STATUS[s]
                      return (
                        <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                          {i > 0 && (
                            <div style={{ position: 'absolute', top: 12, left: '-50%', right: '50%', height: 2, background: isPast || isCurrent ? '#2563eb' : '#e2e8f0', zIndex: 0 }} />
                          )}
                          <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${(isPast || isCurrent) ? '#2563eb' : '#e2e8f0'}`, background: isCurrent ? '#2563eb' : isPast ? '#eff6ff' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative', fontSize: 11 }}>
                            {isPast ? '✓' : isCurrent ? '●' : ''}
                          </div>
                          <div style={{ fontSize: 11, color: (isPast || isCurrent) ? '#1e40af' : '#94a3b8', marginTop: 4, fontWeight: isCurrent ? 700 : 400 }}>
                            {stepSt.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Submitted details */}
              {detailRows.length > 0 && (
                <div style={{ padding: '0 20px 16px' }}>
                  <details>
                    <summary style={{ fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer', marginBottom: 8, userSelect: 'none' }}>
                      Pateikta informacija ▾
                    </summary>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginTop: 6 }}>
                      {detailRows.map((row, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, marginBottom: i < detailRows.length - 1 ? 6 : 0 }}>
                          {row.label ? (
                            <>
                              <span style={{ color: '#64748b', fontWeight: 600, minWidth: 130, flexShrink: 0 }}>{row.label}</span>
                              <span style={{ color: '#0f172a' }}>{row.value}</span>
                            </>
                          ) : (
                            <span style={{ color: '#0f172a', gridColumn: '1 / -1' }}>{row.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}

              {/* CTA for pending */}
              {order.status === 'pending' && (
                <div style={{ margin: '0 20px 16px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e' }}>
                  ⏳ Jūsų užsakymas peržiūrimas. Susisieksime per 24 valandas su <strong>info@nodas.lt</strong>.
                </div>
              )}
              {order.status === 'in_progress' && (
                <div style={{ margin: '0 20px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e40af' }}>
                  ⚙️ Šiuo metu dirbame prie jūsų užsakymo. Iškilus klausimų — <a href="mailto:info@nodas.lt" style={{ color: '#1e40af', fontWeight: 700 }}>info@nodas.lt</a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
