import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Laukia', in_progress: 'Vykdoma', completed: 'Atlikta', cancelled: 'Atšaukta',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>📋 Visi užsakymai</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Paslauga', 'Statusas', 'Kaina', 'Data'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: Order) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#0f172a' }}>{o.service_type}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>{STATUS_LABELS[o.status] ?? o.status}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#2563eb', fontWeight: 600 }}>{o.price ? `€${o.price}` : '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(o.created_at).toLocaleDateString('lt-LT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
