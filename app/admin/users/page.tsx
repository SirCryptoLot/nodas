import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>👥 Vartotojai</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Vardas', 'Tier', 'Admin', 'Data'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u: Profile) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#0f172a' }}>{u.full_name ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{u.tier}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: u.is_admin ? '#16a34a' : '#94a3b8' }}>{u.is_admin ? '✅ Admin' : '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(u.created_at).toLocaleDateString('lt-LT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
