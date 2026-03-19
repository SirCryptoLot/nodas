import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Laukia', in_progress: 'Vykdoma', completed: 'Atlikta', cancelled: 'Atšaukta',
}
const STATUS_COLORS: Record<string, string> = {
  pending: '#fef3c7', in_progress: '#dbeafe', completed: '#dcfce7', cancelled: '#fee2e2',
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

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>📋 Mano užsakymai</h1>
        <Link href="/dashboard/orders/new" style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>+ Naujas</Link>
      </div>
      {(!orders || orders.length === 0) ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 40, textAlign: 'center', color: '#64748b' }}>
          Dar nėra užsakymų. <Link href="/dashboard/orders/new" style={{ color: '#2563eb' }}>Pateikti pirmą užsakymą →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order: Order) => (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{order.service_type}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{new Date(order.created_at).toLocaleDateString('lt-LT')}</div>
                {order.notes && <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{order.notes}</div>}
              </div>
              {order.price && <div style={{ fontSize: 15, fontWeight: 700, color: '#2563eb' }}>€{order.price}</div>}
              <div style={{ background: STATUS_COLORS[order.status] ?? '#f1f5f9', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                {STATUS_LABELS[order.status] ?? order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
